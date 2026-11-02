#!/usr/bin/env python3
"""captions_engine — edição automática estilo Captions ("AI Edit").

Vídeo cru de fala -> corte de silêncios/vícios -> zoom em cada corte -> B-roll ->
legenda animada palavra a palavra -> efeitos sonoros -> trilha com ducking -> 1080x1920.

Comandos:
  transcribe IN [--model small] [--lang pt]       gera IN.words.json (faster-whisper)
  edit IN OUT --preset impacto [opções]            edição completa
  presets                                          lista os templates disponíveis

Só depende de ffmpeg (com libass). faster-whisper é opcional se --words for informado.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRESETS_DIR = ROOT / "presets"
FONTS_DIR = ROOT / "assets" / "fonts"
W, H, FPS = 1080, 1920, 30
FILLERS_PT = {"é", "éé", "ééé", "hã", "hum", "ahn", "ã", "tipo", "né", "então", "assim"}
SENTENCE_END = re.compile(r"[.!?…]$")
NUMBER = re.compile(r"\d|R\$|%")


@dataclass
class Word:
    text: str
    start: float
    end: float
    emphasis: bool = False


@dataclass
class Segment:
    start: float  # tempo na fonte
    end: float
    zoom: float = 1.0
    out_start: float = 0.0  # tempo na saída
    words: list[Word] = field(default_factory=list)

    @property
    def dur(self) -> float:
        return self.end - self.start


# ---------------------------------------------------------------- utilidades
def run(cmd: list[str]) -> str:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"erro no comando: {' '.join(cmd[:4])}...\n{proc.stderr[-2000:]}")
    return proc.stdout


def probe(path: Path) -> dict:
    info = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type",
                           "-of", "json", str(path)]))
    return {"duration": float(info["format"]["duration"]),
            "has_audio": any(s["codec_type"] == "audio" for s in info["streams"])}


def load_preset(name: str) -> dict:
    path = PRESETS_DIR / f"{name}.json"
    if not path.exists():
        sys.exit(f"preset '{name}' não existe. Disponíveis: {', '.join(list_presets())}")
    return json.loads(path.read_text(encoding="utf-8"))


def list_presets() -> list[str]:
    return sorted(p.stem for p in PRESETS_DIR.glob("*.json"))


# ---------------------------------------------------------------- transcrição
def transcribe(video: Path, model: str = "small", lang: str = "pt") -> Path:
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("instale com: pip install faster-whisper  (ou passe --words com um JSON pronto)")
    wm = WhisperModel(model, device="auto", compute_type="int8")
    segments, _ = wm.transcribe(str(video), language=lang, word_timestamps=True, vad_filter=True)
    words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
             for seg in segments for w in (seg.words or []) if w.word.strip()]
    out = video.with_suffix(".words.json")
    out.write_text(json.dumps(words, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"transcrição: {len(words)} palavras -> {out}")
    return out


def load_words(path: Path) -> list[Word]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return [Word(d["text"], float(d["start"]), float(d["end"])) for d in data]


# ---------------------------------------------------------------- planejamento de cortes
def plan_segments(words: list[Word], duration: float, max_gap: float | None,
                  remove_fillers: bool, pad: float = 0.08) -> list[Segment]:
    if remove_fillers:
        words = [w for w in words if w.text.lower().strip(".,!?…") not in FILLERS_PT]
    if not words or max_gap is None:
        return [Segment(0.0, duration, words=list(words))]
    segs: list[Segment] = []
    cur = Segment(max(0.0, words[0].start - pad), words[0].end, words=[words[0]])
    for prev, w in zip(words, words[1:]):
        if w.start - prev.end > max_gap:
            cur.end = min(duration, prev.end + pad)
            segs.append(cur)
            cur = Segment(max(cur.end, w.start - pad), w.end, words=[])
        cur.words.append(w)
        cur.end = w.end
    cur.end = min(duration, cur.end + pad)
    segs.append(cur)
    return segs


def split_long(segs: list[Segment], max_len: float) -> list[Segment]:
    """Divide segmentos longos em fim de frase para trocar o zoom sem cortar tempo."""
    out: list[Segment] = []
    for s in segs:
        start, bucket = s.start, []
        for w in s.words:
            bucket.append(w)
            if SENTENCE_END.search(w.text) and w.end - start >= max_len * 0.5 and w is not s.words[-1]:
                out.append(Segment(start, w.end, words=bucket))
                start, bucket = w.end, []
        out.append(Segment(start, s.end, words=bucket))
    return [s for s in out if s.dur > 0.05]


def assign_zoom_and_timeline(segs: list[Segment], zoom: float) -> None:
    t = 0.0
    for i, s in enumerate(segs):
        s.zoom = zoom if (zoom > 1 and i % 2 == 1) else 1.0
        s.out_start = t
        shift = t - s.start
        s.words = [Word(w.text, max(t, w.start + shift), w.end + shift, w.emphasis) for w in s.words]
        t += s.dur


def mark_emphasis(segs: list[Segment], keywords: set[str]) -> None:
    for s in segs:
        for w in s.words:
            clean = w.text.lower().strip(".,!?…\"'")
            w.emphasis = clean in keywords or bool(NUMBER.search(w.text))


# ---------------------------------------------------------------- legenda (ASS)
def ass_color(hex_rgb: str, alpha: str = "00") -> str:
    h = hex_rgb.lstrip("#")
    return f"&H{alpha}{h[4:6]}{h[2:4]}{h[0:2]}".upper()


def ts(sec: float) -> str:
    sec = max(0.0, sec)
    return f"{int(sec // 3600)}:{int(sec % 3600 // 60):02d}:{sec % 60:05.2f}"


def chunk_words(words: list[Word], per_chunk: int, max_chars: int) -> list[list[Word]]:
    chunks, cur = [], []
    for w in words:
        if cur and (len(cur) >= per_chunk or len(" ".join(x.text for x in cur + [w])) > max_chars):
            chunks.append(cur)
            cur = []
        cur.append(w)
        if SENTENCE_END.search(w.text):
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    return chunks


def fmt(text: str, p: dict) -> str:
    text = text.replace("{", "(").replace("}", ")").replace("\\", "")
    if p.get("strip_punctuation", True):
        text = text.strip(",.;:")
    return text.upper() if p.get("uppercase") else text


def build_ass(words: list[Word], p: dict, hook: str | None, title: str | None, total: float) -> str:
    align = 5 if p.get("position") == "center" else 2
    style = (f"Style: Cap,{p['font']},{p['size']},{ass_color(p['color'])},&H000000FF,"
             f"{ass_color(p.get('outline_color', '#000000'))},{ass_color('#000000', p.get('shadow_alpha', '60'))},"
             f"0,0,0,0,100,100,{p.get('spacing', 0)},0,1,{p['outline']},{p.get('shadow', 0)},{align},60,60,{p['margin_v']},1")
    head = ("[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 0\n\n"
            "[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
            "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
            f"Alignment, MarginL, MarginR, MarginV, Encoding\n{style}\n"
            f"Style: Box,{p['font']},{max(64, int(p['size'] * 0.8))},&H00000000,&H000000FF,&H00FFFFFF,&H00FFFFFF,"
            "0,0,0,0,100,100,0,0,3,18,0,8,80,80,260,1\n\n"
            "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
    ev: list[str] = []
    if hook:
        ev.append(f"Dialogue: 1,{ts(0)},{ts(min(3.0, total))},Box,,0,0,0,,{{\\fad(120,200)}}{fmt(hook, {'uppercase': True})}")
    if title:
        ev.append(f"Dialogue: 1,{ts(0)},{ts(total)},Box,,0,0,0,,{fmt(title, {'uppercase': True})}")

    hi, emph = ass_color(p.get("highlight", p["color"])), ass_color(p.get("emphasis", p.get("highlight", p["color"])))
    cycle = [ass_color(c) for c in p.get("color_cycle", [])]
    anim = p.get("animation", "pop")
    for chunk in chunk_words(words, p["words_per_chunk"], p["max_chars"]):
        chunk_end = chunk[-1].end
        for i, w in enumerate(chunk):
            start = w.start
            end = chunk[i + 1].start if i + 1 < len(chunk) else chunk_end + p.get("hold", 0.15)
            parts = []
            for j, x in enumerate(chunk):
                txt = fmt(x.text, p)
                if j == i and p["words_per_chunk"] > 1:
                    color = emph if x.emphasis else hi
                    grow = p.get("active_scale", 100)
                    parts.append(f"{{\\c{color}\\fscx{grow}\\fscy{grow}}}{txt}{{\\r}}")
                elif j > i and p.get("reveal", False):
                    parts.append(f"{{\\alpha&HFF&}}{txt}{{\\r}}")
                else:
                    c = f"{{\\c{emph}}}" if (x.emphasis and p.get("persist_emphasis", True)) else ""
                    parts.append(f"{c}{txt}{{\\r}}" if c else txt)
            prefix = ""
            if p["words_per_chunk"] == 1:
                color = emph if w.emphasis else (cycle[len(ev) % len(cycle)] if cycle else "")
                prefix = f"{{\\c{color}}}" if color else ""
            if anim == "pop" and (i == 0 or p["words_per_chunk"] == 1):
                prefix += "{\\fscx70\\fscy70\\t(0,90,\\fscx112\\fscy112)\\t(90,160,\\fscx100\\fscy100)}"
            elif anim == "fade" and i == 0:
                prefix += "{\\fad(120,0)}"
            ev.append(f"Dialogue: 0,{ts(start)},{ts(end)},Cap,,0,0,0,,{prefix}{' '.join(parts)}")
    return head + "\n".join(ev) + "\n"


# ---------------------------------------------------------------- efeitos sonoros
def make_sfx(tmp: Path) -> dict[str, Path]:
    whoosh, pop = tmp / "whoosh.wav", tmp / "pop.wav"
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anoisesrc=c=pink:d=0.35:a=0.6",
         "-af", "highpass=f=400,lowpass=f=6000,afade=t=in:d=0.18,afade=t=out:st=0.18:d=0.17", str(whoosh)])
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "sine=f=880:d=0.09",
         "-af", "afade=t=out:st=0.01:d=0.08,volume=0.6", str(pop)])
    return {"whoosh": whoosh, "pop": pop}


# ---------------------------------------------------------------- B-roll
def resolve_broll(items: list[dict], segs: list[Segment]) -> list[dict]:
    """Aceita {"at": seg_saida} ou {"word": "palavra", "occurrence": 1}. Retorna com 'at' resolvido."""
    flat = [w for s in segs for w in s.words]
    out = []
    for it in items:
        at = it.get("at")
        if at is None and "word" in it:
            hits = [w for w in flat if w.text.lower().strip(".,!?…") == it["word"].lower()]
            n = it.get("occurrence", 1) - 1
            if n >= len(hits):
                print(f"aviso: palavra de B-roll não encontrada: {it['word']}")
                continue
            at = hits[n].start
        out.append({**it, "at": float(at), "dur": float(it.get("dur", 2.0))})
    return out


# ---------------------------------------------------------------- render
def build_graph(segs, src_has_audio, cut_y, broll, sfx_events, music, music_db, ass_path, n_inputs_before):
    g, vlabels = [], []
    n = len(segs)
    g.append(f"[0:v]split={n}" + "".join(f"[vs{i}]" for i in range(n)))
    asrc = "0:a" if src_has_audio else "1:a"
    g.append(f"[{asrc}]asplit={n}" + "".join(f"[as{i}]" for i in range(n)))
    for i, s in enumerate(segs):
        zw, zh = int(W * s.zoom) // 2 * 2, int(H * s.zoom) // 2 * 2
        g.append(f"[vs{i}]trim={s.start:.3f}:{s.end:.3f},setpts=PTS-STARTPTS,"
                 f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}:(iw-{W})/2:(ih-{H})*{cut_y},"
                 f"scale={zw}:{zh},crop={W}:{H}:(iw-{W})/2:(ih-{H})*{cut_y},setsar=1,fps={FPS}[v{i}]")
        fade = min(0.015, s.dur / 4)
        g.append(f"[as{i}]atrim={s.start:.3f}:{s.end:.3f},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:d={fade:.3f},afade=t=out:st={max(0, s.dur - fade):.3f}:d={fade:.3f}[a{i}]")
        vlabels.append(f"[v{i}][a{i}]")
    g.append("".join(vlabels) + f"concat=n={n}:v=1:a=1[vc][ac]")

    v, idx = "vc", n_inputs_before
    for k, b in enumerate(broll):
        g.append(f"[{idx}:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS},"
                 f"setpts=PTS-STARTPTS+{b['at']:.3f}/TB[br{k}]")
        g.append(f"[{v}][br{k}]overlay=eof_action=pass:enable='between(t,{b['at']:.3f},{b['at'] + b['dur']:.3f})'[vb{k}]")
        v, idx = f"vb{k}", idx + 1
    ass = str(ass_path).replace("\\", "/").replace(":", "\\:")
    g.append(f"[{v}]ass='{ass}':fontsdir='{FONTS_DIR}'[vout]")

    a, mix = "ac", ["[ac]"]
    for kind, times, vol in sfx_events:
        if not times:
            continue
        g.append(f"[{idx}:a]asplit={len(times)}" + "".join(f"[{kind}{j}]" for j in range(len(times))))
        for j, t in enumerate(times):
            ms = int(t * 1000)
            g.append(f"[{kind}{j}]adelay={ms}|{ms},volume={vol}[{kind}d{j}]")
            mix.append(f"[{kind}d{j}]")
        idx += 1
    if len(mix) > 1:
        g.append("".join(mix) + f"amix=inputs={len(mix)}:duration=first:normalize=0[amx]")
        a = "amx"
    if music:
        g.append(f"[{a}]asplit=2[vox][key]")
        g.append(f"[{idx}:a]volume={music_db}dB[mus]")
        g.append("[mus][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck]")
        g.append("[vox][duck]amix=inputs=2:duration=first:normalize=0[amus]")
        a = "amus"
    g.append(f"[{a}]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")
    return ";\n".join(g)


def cmd_edit(a: argparse.Namespace) -> None:
    src, out = Path(a.input), Path(a.output)
    info = probe(src)
    preset = load_preset(a.preset)
    words_path = Path(a.words) if a.words else src.with_suffix(".words.json")
    if not words_path.exists():
        words_path = transcribe(src, a.model, a.lang)
    words = load_words(words_path)

    max_gap = None if a.no_cut else a.cut_silence
    segs = plan_segments(words, info["duration"], max_gap, a.remove_fillers)
    segs = split_long(segs, a.zoom_every)
    assign_zoom_and_timeline(segs, 1.0 if a.no_zoom else a.zoom)
    mark_emphasis(segs, {k.strip().lower() for k in a.keywords.split(",") if k.strip()})
    total = sum(s.dur for s in segs)
    out_words = [w for s in segs for w in s.words]
    broll = resolve_broll(json.loads(Path(a.broll).read_text(encoding="utf-8")), segs) if a.broll else []

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        ass_path = tmp / "captions.ass"
        ass_path.write_text(build_ass(out_words, preset, a.hook, a.title, total), encoding="utf-8")
        inputs = ["-i", str(src)]
        if not info["has_audio"]:
            inputs += ["-f", "lavfi", "-t", f"{info['duration']}", "-i", "anullsrc=r=48000:cl=stereo"]
        n_before = 2 if not info["has_audio"] else 1
        for b in broll:
            is_img = Path(b["file"]).suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
            inputs += (["-loop", "1", "-t", f"{b['dur']}"] if is_img else []) + ["-i", b["file"]]
        sfx_events = []
        if a.sfx:
            fx = make_sfx(tmp)
            zoom_cuts = [s.out_start for s in segs[1:]][::2]
            pops = [w.start for w in out_words if w.emphasis]
            for kind, times, vol in (("whoosh", zoom_cuts, 0.35), ("pop", pops, 0.5)):
                if times:
                    inputs += ["-i", str(fx[kind])]
                    sfx_events.append((kind, times, vol))
        if a.music:
            inputs += ["-stream_loop", "-1", "-i", a.music]
        graph = build_graph(segs, info["has_audio"], preset.get("crop_y", 0.35), broll, sfx_events,
                            a.music, a.music_db, ass_path, n_before)
        gfile = tmp / "graph.txt"
        gfile.write_text(graph, encoding="utf-8")
        if a.debug:
            print(graph)
        run(["ffmpeg", "-y", *inputs, "-filter_complex_script", str(gfile), "-map", "[vout]", "-map", "[aout]",
             "-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)])

    report = {"saida": str(out), "duracao_original": round(info["duration"], 2), "duracao_final": round(total, 2),
              "cortado_s": round(info["duration"] - total, 2),
              "cortes": sum(1 for x, y in zip(segs, segs[1:]) if y.start - x.end > 0.01), "trocas_de_plano": len(segs) - 1,
              "palavras": len(out_words), "broll": len(broll), "preset": a.preset}
    out.with_suffix(".timeline.json").write_text(json.dumps(
        {"report": report, "words": [w.__dict__ for w in out_words]}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    t = sub.add_parser("transcribe")
    t.add_argument("input")
    t.add_argument("--model", default="small")
    t.add_argument("--lang", default="pt")
    sub.add_parser("presets")
    e = sub.add_parser("edit")
    e.add_argument("input")
    e.add_argument("output")
    e.add_argument("--preset", default="impacto")
    e.add_argument("--words", help="JSON [{text,start,end}] já transcrito")
    e.add_argument("--model", default="small")
    e.add_argument("--lang", default="pt")
    e.add_argument("--cut-silence", type=float, default=0.35, help="pausa máxima mantida (s)")
    e.add_argument("--no-cut", action="store_true")
    e.add_argument("--remove-fillers", action="store_true")
    e.add_argument("--zoom", type=float, default=1.15)
    e.add_argument("--zoom-every", type=float, default=4.0, help="troca de zoom em frases longas (s)")
    e.add_argument("--no-zoom", action="store_true")
    e.add_argument("--keywords", default="", help="palavras destacadas, separadas por vírgula")
    e.add_argument("--hook", help="texto de gancho nos 3 primeiros segundos")
    e.add_argument("--title", help="título fixo no topo (estilo podcast)")
    e.add_argument("--broll", help='JSON [{"file":..., "word":... | "at":..., "dur":2}]')
    e.add_argument("--sfx", action="store_true", help="whoosh nos cortes e pop nas palavras destacadas")
    e.add_argument("--music")
    e.add_argument("--music-db", type=float, default=-20)
    e.add_argument("--debug", action="store_true")
    a = ap.parse_args()
    if a.cmd == "transcribe":
        transcribe(Path(a.input), a.model, a.lang)
    elif a.cmd == "presets":
        for name in list_presets():
            print(f"{name:12} {load_preset(name).get('descricao', '')}")
    else:
        cmd_edit(a)


if __name__ == "__main__":
    main()
