"""
PEDRA STUDIO — do bruto ao Reels pronto, 100% local e gratuito.

  FALA      (você gravou falando):
    python pipeline/reel.py fala bruto.mp4 --nome casa-a --gancho "Casa sem derrubar UMA árvore" --chaves árvore,90

  NARRAÇÃO  (voz de IA sobre imagens da obra):
    python pipeline/reel.py narracao roteiro.txt --fundo obra.mp4 --voz locutor --nome casa-a --gancho "..."

Etapas: cortar silêncios (auto-editor) → narrar (Chatterbox) → transcrever palavra-a-palavra
(faster-whisper) → gerar JSON do Reel → renderizar (Remotion).
Use --so-json para parar antes do render e ajustar B-rolls/palavras-chave no JSON.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # pedra-studio/
PUBLIC = ROOT / "public"
VOZES = ROOT / "vozes"  # coloque aqui clipes de ~10 s: vozes/<nome>.wav


def gpu() -> bool:
    try:
        import torch
        return torch.cuda.is_available()
    except ImportError:
        return False


def run(cmd: list[str]) -> None:
    print("›", " ".join(cmd))
    subprocess.run(cmd, check=True, cwd=ROOT, shell=sys.platform == "win32")


# ---------- 1. Cortar silêncios (jump cuts) ----------
def cortar_silencios(src: Path, dst: Path) -> None:
    if not shutil.which("auto-editor"):
        sys.exit("Instale: pip install auto-editor")
    run(["auto-editor", str(src), "--margin", "0.12s", "--no-open", "-o", str(dst)])


# ---------- 2. Narração natural (Chatterbox, local, ilimitado) ----------
def narrar(roteiro: str, voz: str | None, dst: Path, emocao: float) -> None:
    import torch
    import torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    ref = None
    if voz:
        ref = VOZES / f"{voz}.wav"
        if not ref.exists():
            sys.exit(f"Voz não encontrada: {ref}. Vozes disponíveis: {[p.stem for p in VOZES.glob('*.wav')]}")
    model = ChatterboxMultilingualTTS.from_pretrained(device="cuda" if gpu() else "cpu")
    # Frase a frase + respiro entre elas = soa humano (bloco único soa robótico).
    frases = [f.strip() for f in re.split(r"(?<=[.!?…])\s+", roteiro) if f.strip()]
    pausa = torch.zeros(1, int(model.sr * 0.28))
    partes = []
    for i, frase in enumerate(frases, 1):
        print(f"  voz {i}/{len(frases)}: {frase[:60]}")
        partes += [model.generate(frase, language_id="pt", audio_prompt_path=str(ref) if ref else None,
                                  exaggeration=emocao, cfg_weight=0.4), pausa]
    ta.save(str(dst), torch.cat(partes, dim=1), model.sr)


# ---------- 3. Transcrição palavra-a-palavra ----------
def transcrever(media: Path) -> tuple[list[dict], float]:
    from faster_whisper import WhisperModel

    model = WhisperModel("large-v3" if gpu() else "small", device="cuda" if gpu() else "cpu",
                         compute_type="float16" if gpu() else "int8")
    segs, info = model.transcribe(str(media), language="pt", word_timestamps=True, vad_filter=True)
    words = [{"t": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)}
             for s in segs for w in (s.words or []) if w.word.strip()]
    return words, round(info.duration, 2)


# ---------- 4. JSON do Reel + render ----------
def montar(args, words, duration, main_key: str, main_rel: str, audio_rel: str | None) -> Path:
    primeira = re.split(r"(?<=[.!?])\s", " ".join(w["t"] for w in words))[0]
    data = {
        "duration": duration,
        main_key: main_rel,
        "words": words,
        "hook": {"text": args.gancho or primeira, "highlight": args.destaque},
        "keywords": [k.strip() for k in (args.chaves or "").split(",") if k.strip()],
        "inserts": [],
        "cta": {"text": args.cta},
    }
    if audio_rel:
        data["audio"] = audio_rel
    if args.musica:
        data["music"], data["musicVolume"] = copiar(Path(args.musica), args.nome), 0.12
    props = ROOT / "projetos" / f"{args.nome}.json"
    props.parent.mkdir(exist_ok=True)
    props.write_text(json.dumps({"data": data}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"✓ Roteiro do vídeo: {props}  (edite 'inserts'/'keywords' se quiser)")
    return props


def copiar(src: Path, nome: str) -> str:
    rel = f"projetos/{nome}/{src.name}"
    (PUBLIC / rel).parent.mkdir(parents=True, exist_ok=True)
    if src.resolve() != (PUBLIC / rel).resolve():
        shutil.copy2(src, PUBLIC / rel)
    return rel


def render(props: Path, nome: str) -> None:
    out = ROOT / "out" / f"{nome}.mp4"
    run(["npx", "remotion", "render", "ReelRetencao", str(out), f"--props={props}", "--codec=h264", "--crf=18"])
    print(f"\n🎬 PRONTO: {out}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Pedra Studio — Reels de retenção")
    ap.add_argument("modo", choices=["fala", "narracao", "render"])
    ap.add_argument("entrada", help="vídeo bruto (fala), roteiro .txt (narracao) ou JSON (render)")
    ap.add_argument("--nome", default="reel")
    ap.add_argument("--gancho", help="texto do gancho dos 2 primeiros segundos")
    ap.add_argument("--destaque", help="palavra do gancho em vermelho")
    ap.add_argument("--chaves", help="palavras de impacto separadas por vírgula")
    ap.add_argument("--cta", default="Siga para ver mais obras")
    ap.add_argument("--fundo", help="[narracao] vídeo/imagem de fundo")
    ap.add_argument("--voz", help="[narracao] nome do arquivo em vozes/ (sem .wav)")
    ap.add_argument("--emocao", type=float, default=0.55, help="[narracao] 0.3 calmo … 0.8 intenso")
    ap.add_argument("--musica", help="trilha de fundo (.mp3/.wav)")
    ap.add_argument("--so-json", action="store_true", help="para antes de renderizar")
    a = ap.parse_args()

    entrada = Path(a.entrada)
    if not entrada.exists():
        sys.exit(f"Arquivo não encontrado: {entrada}")

    if a.modo == "render":
        return render(entrada, entrada.stem)

    pasta = PUBLIC / "projetos" / a.nome
    pasta.mkdir(parents=True, exist_ok=True)

    if a.modo == "fala":
        cortado = pasta / "fala.mp4"
        cortar_silencios(entrada, cortado)
        words, dur = transcrever(cortado)
        props = montar(a, words, dur, "video", f"projetos/{a.nome}/fala.mp4", None)
    else:
        if not a.fundo:
            sys.exit("--fundo é obrigatório no modo narracao")
        voz = pasta / "voz.wav"
        narrar(entrada.read_text(encoding="utf-8"), a.voz, voz, a.emocao)
        words, dur = transcrever(voz)
        props = montar(a, words, dur, "bg", copiar(Path(a.fundo), a.nome), f"projetos/{a.nome}/voz.wav")

    if not a.so_json:
        render(props, a.nome)


if __name__ == "__main__":
    main()
