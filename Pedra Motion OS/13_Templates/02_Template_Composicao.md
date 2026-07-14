---
titulo: Template de Composição
tipo: codigo
tags: [pedra-motion-os, template, codigo]
---

# Template de Composição

> **Objetivo:** esqueleto de uma composição completa orquestrando cenas com `TransitionSeries`, dados via props e som sincronizado. Base para qualquer blueprint.

```tsx
// src/compositions/CaseObra.tsx
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

import { Scene } from '../components/layout/Scene';
import { BackgroundMedia } from '../components/layout/BackgroundMedia';
import { SafeArea } from '../components/layout/SafeArea';
import { KineticTitle } from '../components/text/KineticTitle';
import { LowerThird } from '../components/text/LowerThird';
import { StatCard } from '../components/data/StatCard';
import { EndCard } from '../components/util/EndCard';
import { Flash } from '../components/transitions/Flash';

export type CaseObraProps = {
  empreendimento: string;
  desafio: string;
  kpis: { value: number; label: string; suffix?: string }[];
  cta: string;
  media: { hero: string; timelapse: string; final: string };
};

export const CaseObra: React.FC<CaseObraProps> = ({ empreendimento, desafio, kpis, cta, media }) => (
  <AbsoluteFill>
    {/* ---- Trilha e camadas de áudio (ver [[07_Sound_Design/03_Mixagem_e_Camadas]]) ---- */}
    <Audio src={staticFile('audio/music/epic.mp3')} volume={(f) => (f < 30 ? f / 30 * 0.6 : 0.6)} />
    <Sequence from={0}><Audio src={staticFile('audio/sfx/riser.wav')} /></Sequence>
    <Sequence from={120}><Audio src={staticFile('audio/sfx/impact.wav')} volume={0.8} /></Sequence>

    {/* ---- Vídeo ---- */}
    <TransitionSeries>
      {/* 1. Hook */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene>
          <BackgroundMedia src={staticFile(media.hero)} />
          <SafeArea><KineticTitle text={empreendimento} highlight="Pedra" size="hero" /></SafeArea>
        </Scene>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 } })} />

      {/* 2. Desafio */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Scene>
          <BackgroundMedia src={staticFile(media.timelapse)} type="video" />
          <LowerThird title={desafio} subtitle="O desafio" delay={12} />
        </Scene>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: 12 })} />

      {/* 3. Resultado (KPIs) */}
      <TransitionSeries.Sequence durationInFrames={450}>
        <Scene bg="#0A0C0F">
          <SafeArea>
            <div style={{ display:'flex', gap: 24, alignItems:'center', flexWrap:'wrap' }}>
              {kpis.map((k, i) => <StatCard key={i} {...k} delay={i * 8} />)}
            </div>
          </SafeArea>
        </Scene>
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 } })} />

      {/* 4. Grandiosidade + CTA */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene>
          <BackgroundMedia src={staticFile(media.final)} />
          <EndCard cta={cta} />
        </Scene>
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {/* Pattern interrupt: flash no reveal */}
    <Flash at={120} />
  </AbsoluteFill>
);
```

## Notas
- Durações e som seguem o [[11_Blueprints/01_Blueprint_Case_de_Obra|blueprint]].
- Props vêm de `src/data/caseObra.ts` — separe **dado** de **layout**.
- Para outros formatos, reutilize `CaseObra` em composições com `width/height` diferentes e ajuste a `SafeArea`.

Ver: [[13_Templates/01_Estrutura_de_Projeto]] · [[20_Exemplos/01_Exemplo_Case_Obra]]
