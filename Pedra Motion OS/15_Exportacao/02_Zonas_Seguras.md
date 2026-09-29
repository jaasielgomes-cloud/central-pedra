---
titulo: Zonas Seguras (UI das plataformas)
tipo: conceito
tags: [pedra-motion-os, exportacao, biblioteca-visual, conceito]
---

# Zonas Seguras

> **Objetivo:** manter conteúdo essencial longe da UI que cada plataforma sobrepõe ao vídeo (perfil, legenda, botões).

## Vertical 9:16 (1080×1920) — zonas de perigo
```
┌───────────────┐
│  ~120px topo  │  ← relógio/status (stories), evitar texto crítico
│               │
│   ZONA SEGURA │  ← todo conteúdo essencial aqui
│    central    │
│               │
│               │→ ~180px direita: ícones (curtir, comentar, perfil)
│  ~420px base  │  ← legenda, @usuário, música, CTA da plataforma
└───────────────┘
```

## Regras
- **Base:** deixe ~400–450px livres na parte inferior para a UI (legenda/CTA da plataforma). Não coloque CTA ali.
- **Direita:** ~180px para a coluna de ícones (Reels/TikTok/Shorts).
- **Topo:** ~120–250px em Stories (barra de progresso e status).
- CTA e informação-chave: **terço central-inferior**, acima da zona de UI. Ver [[09_Biblioteca_Visual/04_Grid_e_Layout]].

## Implementação
Use o componente `SafeArea` com padding = `GRID.margin` e, para plataformas com UI agressiva, aumente a margem inferior. Ver [[12_Componentes_Remotion/02_Layout_e_Cenas]].

## Teste final
Exporte, poste como rascunho/privado e **veja no app real** com a UI sobreposta antes de publicar.

Ver: [[15_Exportacao/01_Specs_por_Plataforma]] · [[16_Checklists/06_Checklist_Plataformas]]
