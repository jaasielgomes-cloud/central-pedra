---
titulo: Curva de Retenção e Diagnóstico
tipo: conceito
tags: [pedra-motion-os, retencao, auditoria, conceito]
---

# Curva de Retenção e Diagnóstico

> **Objetivo:** ler a curva de audiência para diagnosticar e consertar vídeos. O que não se mede não melhora.

## Anatomia da curva
```
% audiência
100 |█▉
 80 |  ▜▄▄___          ← queda inicial (hook fraco?)
 60 |        ▀▀▄▄▄▄
 40 |               ▀▀▄▄___  ← platô = bom sinal
 20 |                       ▀▀
    +--------------------------------→ tempo
     0s   3s        meio        fim
```

## Pontos críticos
- **Queda dos 0–3s:** hook fraco ou promessa pouco clara. → Refazer abertura.
- **Queda no meio:** ritmo caiu, faltou pattern interrupt ou o loop demorou a pagar.
- **Rebote (subida):** algo muito bom ali — replicar o padrão.
- **Retenção > 100% em trechos:** rewatch/loop — sinal excelente (algoritmo adora).

## Sinais que os algoritmos leem
| Sinal | O que otimizar |
|---|---|
| Retenção média | ritmo, loops, valor contínuo |
| Rewatches / loops | vídeo circular, final que reinicia |
| Replays de trechos | momento marcante (satisfação) |
| Tempo até o scroll | hook |
| Compartilhamento/salvamento | valor + emoção + utilidade |

## Ciclo de melhoria
1. Publique.
2. Leia a curva após 24–48h.
3. Identifique a maior queda.
4. Ligue a queda a uma causa (hook, ritmo, loop, clareza).
5. Corrija no próximo vídeo (ou reedite).

Ver: [[17_Auditoria/00_Index]] · [[06_Retencao/03_Pattern_Interrupts_e_Curiosidade]]
