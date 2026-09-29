---
titulo: Estrutura de Projeto Remotion
tipo: codigo
tags: [pedra-motion-os, template, codigo]
---

# Estrutura de Projeto Remotion

> **Objetivo:** organização de pastas padrão do Grupo Pedra para todo projeto de vídeo. Escalável e mantível.

## Árvore de arquivos
```
pedra-video/
├── package.json
├── remotion.config.ts
├── public/                      # mídias (drone, renders, sfx, música)
│   ├── media/
│   ├── audio/sfx/
│   └── audio/music/
├── src/
│   ├── Root.tsx                 # registro de composições
│   ├── theme/
│   │   ├── tokens.ts            # cores, tipo, espaço, grid  → [[09_Biblioteca_Visual/01_Design_Tokens]]
│   │   └── motion.ts            # EASE, SPRING               → [[03_Motion_Design/02_Easing_e_Springs]]
│   ├── components/              # biblioteca → [[12_Componentes_Remotion/00_Index]]
│   │   ├── text/                # KineticTitle, LowerThird...
│   │   ├── layout/              # Scene, SafeArea, BackgroundMedia...
│   │   ├── data/                # NumberCounter, BarChart...
│   │   ├── util/                # KenBurns, Stagger, GradeOverlay...
│   │   └── transitions/         # WhipOut, Flash, Parallax...
│   ├── scenes/                  # cenas específicas do vídeo
│   ├── compositions/            # composições completas (1 por vídeo)
│   └── data/                    # roteiro/props em JSON tipado
└── out/                         # renders exportados
```

## `Root.tsx` (registro)
```tsx
import { Composition } from 'remotion';
import { CaseObra } from './compositions/CaseObra';
import { GRID } from './theme/tokens';
import { caseObraData } from './data/caseObra';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CaseObra"
      component={CaseObra}
      durationInFrames={2250}      // 75s @30fps
      fps={GRID.vertical.fps}
      width={GRID.vertical.w}
      height={GRID.vertical.h}
      defaultProps={caseObraData}
    />
    {/* registre versões 1:1 e 16:9 reaproveitando o mesmo componente */}
  </>
);
```

## `remotion.config.ts` (essencial)
```ts
import { Config } from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(null);        // auto
Config.setChromiumOpenGlRenderer('angle');
```

## Princípios
- **Dados fora do layout:** roteiro/props em `src/data/*.ts` (JSON tipado). O componente só renderiza.
- **Tokens fonte única:** nada hardcoded.
- **Um componente por arquivo**, reutilizável entre vídeos.
- **Multi-formato:** mesmo componente, composições diferentes por dimensão. Ver [[15_Exportacao/01_Specs_por_Plataforma]].

Ver: [[13_Templates/02_Template_Composicao]] · [[19_Workflows/00_Workflow_Mestre]]
