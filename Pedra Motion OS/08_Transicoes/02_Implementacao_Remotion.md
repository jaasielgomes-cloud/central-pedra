---
titulo: Implementação de Transições em Remotion
tipo: codigo
tags: [pedra-motion-os, transicoes, componente, codigo]
---

# Implementação de Transições em Remotion

> **Objetivo:** código reutilizável para as transições da biblioteca. Base: `@remotion/transitions` quando possível + implementações customizadas.

## Com `@remotion/transitions` (recomendado)
```tsx
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

export const Sequencia = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={90}><CenaA /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 } })} />
    <TransitionSeries.Sequence durationInFrames={90}><CenaB /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: 12 })} />
    <TransitionSeries.Sequence durationInFrames={90}><CenaC /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

## Whip Pan customizado
```tsx
import { interpolate, useCurrentFrame } from 'remotion';
// aplique no wrapper da cena que sai/entra; sincronize com whoosh
export const WhipOut: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [0, -120], { extrapolateRight: 'clamp' });
  const blur = interpolate(f, [0, dur*0.5, dur], [0, 20, 40], { extrapolateRight: 'clamp' });
  return <div style={{ transform: `translateX(${x}%)`, filter: `blur(${blur}px)` }}>{children}</div>;
};
```

## Flash (branco) — pattern interrupt
```tsx
export const Flash: React.FC<{at: number; len?: number}> = ({at, len = 6}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + len/2, at + len], [0, 1, 0], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  return <div style={{ position:'absolute', inset:0, background:'#fff', opacity:o, pointerEvents:'none' }} />;
};
```

## Parallax (dar vida a still)
```tsx
export const ParallaxLayers: React.FC<{bg:string; mid:string; fg:string}> = ({bg, mid, fg}) => {
  const f = useCurrentFrame();
  const move = (mult:number) => interpolate(f, [0, 120], [0, 30*mult]);
  return (
    <>
      <img src={bg}  style={{ position:'absolute', inset:0, transform:`translateX(${move(0.3)}px) scale(1.1)` }} />
      <img src={mid} style={{ position:'absolute', inset:0, transform:`translateX(${move(0.6)}px) scale(1.1)` }} />
      <img src={fg}  style={{ position:'absolute', inset:0, transform:`translateX(${move(1.0)}px) scale(1.1)` }} />
    </>
  );
};
```

## Boas práticas de performance
- Prefira `transform` e `opacity` (aceleração por GPU); evite animar `width`/`height`/`filter` pesado em muitos elementos.
- `filter: blur()` é caro — limite duração e área.
- Reutilize componentes de transição; não recrie inline.

Ver: [[08_Transicoes/01_Biblioteca_de_Transicoes]] · [[12_Componentes_Remotion/00_Index]]
