---
name: captions-studio
description: Edição automática estilo app Captions ("AI Edit"). Recebe um vídeo cru de fala e entrega pronto com corte de silêncios e vícios, zoom em cada corte, legenda animada palavra a palavra, B-roll, efeitos sonoros, trilha com ducking e áudio normalizado, em 1080x1920. Use para "edita esse vídeo", "coloca legenda", "estilo Captions", "legenda animada", "corta os silêncios", "deixa pronto pro Reels", ou na etapa de montagem/legenda de qualquer skill formato-*.
---

# Captions Studio

Motor local e gratuito (sem créditos): `scripts/captions_engine.py`. Requisitos: `ffmpeg` com libass e `pip install faster-whisper`. As fontes (OFL) estão em `assets/fonts/`.

## Divisão de trabalho

O script faz a parte mecânica. **Claude faz o que o Captions faz com IA**: lê a transcrição e decide o gancho, as palavras de destaque, os momentos de B-roll e o template.

## Fluxo

1. **Transcrever**: `python3 scripts/captions_engine.py transcribe VIDEO.mp4` gera `VIDEO.words.json`. Use `--model medium` se o áudio for ruim.
2. **Ler a transcrição** e decidir:
   - **Correções**: ajuste no JSON nomes próprios e marcas que o Whisper errou (ex.: "Grupo Pedra").
   - **Gancho** (`--hook`): até 6 palavras, a promessa ou o conflito do vídeo.
   - **Destaques** (`--keywords`): 3–8 palavras de valor (dinheiro, erro, grátis, nome do produto). Números já são destacados sozinhos.
   - **B-roll** (`--broll broll.json`): a cada 4–7s de fala contínua, ilustrar o substantivo concreto citado. `[{"file": "carro.mp4", "word": "carro", "occurrence": 1, "dur": 2}]` ou `{"at": 3.5}` no tempo final. Para gerar B-roll, use o Higgsfield (pago, confirmar o custo antes) ou prints/fotos do usuário.
   - **Template** (`--preset`): ver tabela abaixo.
3. **Editar**:
```bash
python3 scripts/captions_engine.py edit cru.mp4 final.mp4 --preset impacto \
  --remove-fillers --keywords "dinheiro,erro" --hook "O erro que custa caro" \
  --broll broll.json --sfx --music trilha.mp3
```
4. **Revisar**: extrair 4 quadros (`ffmpeg -ss T -i final.mp4 -frames:v 1 q.png`) e olhar legenda, enquadramento do rosto e B-roll. Ler `final.timeline.json` (relatório + palavras no tempo final). Ajustar e renderizar de novo.
5. Entregar o vídeo e a legenda do post (pipeline em `../viral-video-studio/references/pipeline.md`).

## Templates (`presets/`)

| Preset | Visual | Bom para |
|---|---|---|
| `impacto` | 2–3 palavras em CAIXA ALTA, palavra atual amarela, destaques verdes, pop | Negócios, autoridade, vendas |
| `palavra` | Uma palavra gigante por vez, cores alternadas, bounce | React, entretenimento, ritmo rápido |
| `karaoke` | Frase revelada conforme a fala, palavra atual ciano | Educativo, tutorial |
| `minimal` | Minúsculas brancas, sem destaque | Lifestyle, marca premium |
| `podcast` | Centro da tela + `--title` fixo no topo | `formato-podcast-fake`, entrevistas |

**Criar um template** (ex.: copiado de um viral via `clonar-viral-captions`): copie um JSON de `presets/` com outro nome e ajuste `font`, `size`, cores (`color`, `highlight`, `emphasis`), `words_per_chunk`, `uppercase`, `position` (bottom|center), `margin_v`, `animation` (pop|fade|none), `reveal`, `color_cycle`. A fonte precisa estar em `assets/fonts/` (somente licença livre, ex.: Google Fonts).

## Opções úteis

| Opção | Efeito |
|---|---|
| `--cut-silence 0.35` | Pausa máxima mantida. 0.25 = ritmo frenético; 0.5 = natural |
| `--no-cut` | Mantém o tempo original (diálogos já montados, podcast) |
| `--remove-fillers` | Remove "é", "hã", "tipo", "né"... Revise depois: pode cortar um "né" que tinha sentido |
| `--zoom 1.15` / `--no-zoom` | Punch-in alternado a cada corte, que esconde o jump cut |
| `--zoom-every 4` | Troca o zoom em frases longas sem corte |
| `--sfx` | Whoosh nas trocas de zoom e pop nos destaques (sons gerados, sem direitos) |
| `--music X --music-db -20` | Trilha com ducking automático sob a voz |
| `--words X.json` | Usa uma transcrição pronta (pula o Whisper) |

## Limites

- Vídeo horizontal é recortado no centro (`crop_y` no preset ajusta a altura do corte). Não há rastreamento de rosto: se a pessoa não estiver centralizada, recorte antes.
- O libass não desenha emoji colorido. Para emojis e legenda 3D, use o HyperFrames (`heygen-com/hyperframes`, Apache 2.0) como etapa extra.
- Contato visual ("eye contact" do Captions), tradução e dublagem não estão aqui. Para dublagem, use o Higgsfield `dubbing` (pago).
