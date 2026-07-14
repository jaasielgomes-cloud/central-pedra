---
titulo: Easing e Springs
tipo: codigo
tags: [pedra-motion-os, motion, codigo]
---

# Easing e Springs

> **Objetivo:** padronizar as curvas de animação do sistema. Curva errada = sensação errada. Este é o segredo técnico #1 do "parece profissional".

## As curvas do sistema (tokens de motion)
```ts
// src/theme/motion.ts
import { Easing } from 'remotion';

export const EASE = {
  // Entradas: rápido no início, assenta no fim (padrão do sistema)
  out:      Easing.bezier(0.16, 1, 0.3, 1),      // "expo-out", elegante
  outSoft:  Easing.bezier(0.25, 1, 0.5, 1),
  // Saídas
  in:       Easing.bezier(0.7, 0, 0.84, 0),
  // Transições de câmera/planos
  inOut:    Easing.bezier(0.65, 0, 0.35, 1),
  // Linear só para loops contínuos (rotação infinita, marquee)
  linear:   Easing.linear,
} as const;

export const SPRING = {
  // assenta firme, micro-overshoot (identidade Pedra: peso)
  settle:  { damping: 18, mass: 0.9, stiffness: 120 },
  // reveal com presença
  reveal:  { damping: 14, mass: 1,   stiffness: 90 },
  // pop de destaque (dado-chave)
  pop:     { damping: 12, mass: 0.6, stiffness: 200 },
} as const;
```

## Quando usar `interpolate` vs `spring`
- **`spring`** → entradas de elementos, pop de destaque, qualquer coisa que precise de "peso" orgânico.
- **`interpolate` + Easing** → transições controladas por tempo exato (fade de plano, movimento de câmera sincronizado com beat).

## Padrão de entrada de elemento
```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SPRING } from '../theme/motion';

export const EnterUp: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.settle });
  const y = interpolate(p, [0, 1], [40, 0]);   // sobe 40px e assenta
  const opacity = interpolate(p, [0, 1], [0, 1]);
  return <div style={{ transform: `translateY(${y}px)`, opacity }}>{children}</div>;
};
```

## Regras
- **Nunca** `Easing.linear` para entradas.
- **Sempre** `extrapolateLeft: 'clamp'` e `extrapolateRight: 'clamp'` em `interpolate` de opacidade/escala, para não estourar.
- Overshoot é bom (peso), mas amortecido: `damping ≥ 12`.

Ver: [[03_Motion_Design/01_Principios_da_Animacao]] · [[12_Componentes_Remotion/00_Index]]
