---
titulo: Grid e Layout
tipo: conceito
tags: [pedra-motion-os, biblioteca-visual, exportacao, conceito]
---

# Grid e Layout

> **Objetivo:** posicionamento consistente de elementos. Grid é o que faz o layout parecer "projetado", não "montado".

## Sistema de grid
- **Margem segura:** `GRID.margin` (96px @1080). Nada essencial fora dela.
- **Colunas:** 6 colunas com gutter de 24px para alinhar elementos.
- **Baseline:** alinhe texto e blocos a uma grade de 8px (`SPACE`).

## Zonas do frame vertical (9:16)
```
┌───────────────┐  ← topo: kicker/label, logo (opcional)
│    contexto   │
├───────────────┤
│               │
│    SUJEITO    │  ← centro seguro: foco principal
│               │
├───────────────┤
│  título/dado  │  ← terço inferior: mensagem
│   legenda     │
└───────────────┘  ← evitar: UI da plataforma
```

## Posições seguras
- **Logo/selo:** sempre no mesmo canto (defina um por padrão de marca).
- **Legendas:** terço inferior, acima da zona de UI. Ver [[15_Exportacao/02_Zonas_Seguras]].
- **CTA:** central-inferior, dentro da margem.

## Alinhamento e ritmo espacial
- Escolha **um** eixo de alinhamento por composição.
- Espaçamento consistente (`SPACE` tokens) entre blocos.
- Respeite o **espaço negativo** — não encoste tudo nas bordas.

## Composição multi-formato
Ao adaptar 9:16 → 1:1 → 16:9, reposicione o conteúdo para cada grid; não apenas "corte". Ver [[15_Exportacao/01_Specs_por_Plataforma]].

Ver: [[09_Biblioteca_Visual/01_Design_Tokens]] · [[04_Cinematografia/01_Composicao]]
