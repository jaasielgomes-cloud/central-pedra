---
titulo: 12 Princípios da Animação (aplicados a Remotion)
tipo: conceito
tags: [pedra-motion-os, motion, codigo, conceito]
---

# 12 Princípios da Animação → Remotion

> **Objetivo:** traduzir os princípios clássicos da Disney para o contexto de motion graphics em Remotion, com a variante do que **fazer** e **evitar**.

| # | Princípio | Aplicação em motion/Remotion |
|---|---|---|
| 1 | **Squash & Stretch** | Sutil: um contador que "estica" ao mudar de dígito. Nunca deformar logotipos. |
| 2 | **Antecipação** | Um micro-recuo antes de um card entrar; um leve escurecer antes de um reveal. |
| 3 | **Encenação (Staging)** | Um ponto de foco por vez. Ver [[03_Motion_Design/04_Hierarquia_e_Foco]]. |
| 4 | **Straight-ahead vs Pose-to-pose** | Em Remotion, quase tudo é pose-to-pose via `interpolate`/`spring` entre estados. |
| 5 | **Follow-through & overlap** | Elementos secundários (sombra, sublinhado) chegam alguns frames depois do principal. |
| 6 | **Slow-in / Slow-out (easing)** | Nunca linear. Use `ease-out` para entradas. Ver [[03_Motion_Design/02_Easing_e_Springs]]. |
| 7 | **Arcos** | Movimentos que percorrem curvas, não linhas retas — mais orgânico. |
| 8 | **Ação secundária** | Partículas de poeira, brilho no dado-chave — reforçam sem roubar cena. |
| 9 | **Timing** | O DNA do ritmo. Ver [[03_Motion_Design/03_Timing_e_Ritmo]]. |
| 10 | **Exagero** | Controlado: um dado importante escala 1.0→1.08, não 1.0→2.0. |
| 11 | **Desenho sólido** | Grid, alinhamento, profundidade por camadas/parallax. |
| 12 | **Apelo (Appeal)** | Elegância. Se parece "template", refaça. |

## Aplicação prática no Grupo Pedra
- **Peso primeiro:** tudo tem massa. Entradas com `spring` de amortecimento alto (assenta, não quica).
- **Overlap obrigatório:** título entra no frame 0, sublinhado no frame 6, legenda no frame 10. Nunca tudo junto.
- **Stagger em listas:** itens entram em cascata de 3–5 frames de diferença.

## Erros que denunciam amadorismo
- ❌ Tudo aparecendo junto no mesmo frame.
- ❌ Movimento linear (sem easing).
- ❌ Bounce exagerado ("gelatina").
- ❌ Fade-in genérico em tudo, sem hierarquia.

Ver: [[03_Motion_Design/02_Easing_e_Springs]] · [[12_Componentes_Remotion/00_Index]]
