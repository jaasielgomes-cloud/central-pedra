---
titulo: Música e Beatmatching
tipo: receita
tags: [pedra-motion-os, sound-design, motion, receita]
---

# Música e Beatmatching

> **Objetivo:** escolher trilha e sincronizar a edição com ela. Beatmatching é o truque #1 de percepção de qualidade.

## Escolha da trilha por tom
| Tom | Música |
|---|---|
| Épico / obra | orquestral cinematográfico, percussão, crescendo |
| Institucional | ambient elegante, piano minimal, sound design |
| Técnico / dados | eletrônico contido, pulso constante |
| Humano / depoimento | piano/violão quente, orgânico |
| Lançamento / hype | trap/eletrônico com drops, energia |

## Estrutura musical = estrutura do vídeo
Mapeie a música: **intro → build → drop/clímax → outro**. Alinhe com a narrativa: hook na intro, desenvolvimento no build, payoff no drop.

## Beatmatching (passo a passo)
1. Identifique o **BPM** da trilha.
2. `framesPorBeat = (60 / BPM) × fps` (ex.: 120 BPM @30fps = 15 frames).
3. Coloque **cortes e entradas de texto** nos beats (múltiplos de `framesPorBeat`).
4. O **drop** da música = o **reveal** do vídeo.

```ts
const BPM = 120, fps = 30;
const beat = (60 / BPM) * fps;            // 15
const cortes = [0, beat*2, beat*4, beat*8]; // cortes em beats musicais
```

## Técnicas
- **Build-up + drop:** sincronize o riser com o build musical e o impacto com o drop.
- **Silêncio antes do drop:** cortar a música por 0.5–1s antes do clímax multiplica o impacto.
- **Ducking:** abaixe a música quando entra narração (ver [[07_Sound_Design/03_Mixagem_e_Camadas]]).

## Cuidados legais
Use apenas trilhas licenciadas/royalty-free ou da biblioteca do Grupo Pedra. Áudio com copyright derruba alcance e pode remover o vídeo.

Ver: [[03_Motion_Design/03_Timing_e_Ritmo]] · [[02_Storytelling/04_Beats_e_Ritmo_Narrativo]]
