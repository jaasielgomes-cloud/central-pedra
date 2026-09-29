---
titulo: Timing e Ritmo
tipo: conceito
tags: [pedra-motion-os, motion, codigo, conceito]
---

# Timing e Ritmo

> **Objetivo:** dar números concretos de duração. "Quantos frames?" é a pergunta que trava iniciantes — aqui estão as respostas-padrão (base 30fps).

## Durações-padrão (em frames @ 30fps)
| Ação | Frames | Segundos |
|---|---|---|
| Entrada de card/título | 12–18 | 0.4–0.6s |
| Micro-interação (highlight) | 6–10 | 0.2–0.3s |
| Transição rápida (whip/flash) | 6–12 | 0.2–0.4s |
| Transição suave (blur/luma) | 15–24 | 0.5–0.8s |
| Contador de número | 30–60 | 1–2s |
| Push-in de câmera (plano) | 90–150 | 3–5s |
| Reveal com pausa/silêncio | 24–36 | 0.8–1.2s |

## Stagger (cascata)
Itens de uma lista/grid entram com defasagem de **3–5 frames** entre si. Fórmula: `delay = index * 4`.

## A pausa é uma ferramenta
Antes de um payoff, **1 segundo de quase-imobilidade** (câmera lenta + silêncio) amplifica o impacto. O olho descansa para o próximo golpe.

## Beatmatching (sincronia com a música)
1. Localize o BPM da trilha.
2. `framesPorBeat = (60 / bpm) * fps`.
3. Faça cortes e entradas caírem em múltiplos de `framesPorBeat`.

```ts
const bpm = 120;
const fps = 30;
const framesPerBeat = (60 / bpm) * fps; // 15 frames por beat
// corte a cada 1, 2 ou 4 beats conforme a energia
```

## Regra dos 3 andamentos
Não use uma velocidade só. Ver [[02_Storytelling/04_Beats_e_Ritmo_Narrativo]].

Ver: [[07_Sound_Design/02_Musica_e_Beatmatching]] · [[08_Transicoes/00_Index]]
