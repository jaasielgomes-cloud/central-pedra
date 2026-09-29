---
titulo: Design Tokens
tipo: codigo
tags: [pedra-motion-os, biblioteca-visual, componente, codigo]
---

# Design Tokens

> **Objetivo:** centralizar todos os valores de estilo em um único arquivo `theme`. Nenhum componente usa cor/tamanho "na mão" — tudo vem daqui.

> ⚠️ Estes são valores **padrão do sistema**. Ao receber o manual oficial do Grupo Pedra, ajuste apenas este arquivo e todo o sistema segue.

```ts
// src/theme/tokens.ts

export const COLORS = {
  graphite:  '#111418',  // base escura / cinema
  ink:       '#0A0C0F',  // preto verdadeiro
  concrete:  '#C7C9CC',  // neutro / texto secundário
  limestone: '#F4F2ED',  // claro / fundo
  white:     '#FFFFFF',
  signal:    '#E8613C',  // acento / CTA / dado-chave
  steel:     '#3A6B8C',  // dados frios
  success:   '#3FA66A',  // indicadores positivos
  alert:     '#D24B3E',  // alerta / risco (uso raro)
} as const;

export const TYPO = {
  family: {
    display: '"Archivo", "Inter Tight", system-ui, sans-serif',
    body:    '"Inter", system-ui, sans-serif',
    mono:    '"IBM Plex Mono", monospace', // números/dados
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 800 },
  // escala em px para composição 1080x1920 (vertical)
  size: { hero: 128, h1: 96, h2: 72, h3: 54, body: 40, caption: 30, micro: 24 },
  tracking: { tight: '-0.02em', normal: '0', wide: '0.08em' },
  lineHeight: { tight: 1.02, normal: 1.2, relaxed: 1.4 },
} as const;

export const SPACE = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 96, safe: 120 } as const;

export const RADIUS = { sm: 8, md: 16, lg: 28, pill: 999 } as const;

export const GRID = {
  vertical:   { w: 1080, h: 1920, fps: 30 },
  square:     { w: 1080, h: 1080, fps: 30 },
  horizontal: { w: 1920, h: 1080, fps: 30 },
  margin: 96, // margem segura
  columns: 6,
  gutter: 24,
} as const;

export const SHADOW = {
  soft:  '0 8px 30px rgba(0,0,0,0.25)',
  hard:  '0 2px 0 rgba(0,0,0,0.4)',
} as const;
```

## Regras de uso
- Cores: sempre `COLORS.signal`, nunca `'#E8613C'` no componente.
- A regra **60-30-10** (ver [[09_Biblioteca_Visual/03_Paleta_e_Cor]]) governa a proporção.
- Escala tipográfica: nunca inventar tamanho fora de `TYPO.size`.

Ver: [[03_Motion_Design/02_Easing_e_Springs]] (tokens de motion) · [[13_Templates/01_Estrutura_de_Projeto]]
