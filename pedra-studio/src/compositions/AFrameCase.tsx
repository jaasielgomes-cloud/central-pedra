import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  interpolate,
} from "remotion";
import {
  TransitionSeries,
  springTiming,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { COLORS, SPACE } from "../theme/tokens";
import { loadFonts } from "../theme/fonts";
import { Scene, SafeArea } from "../components/layout/Scene";
import { BackgroundVideo } from "../components/layout/BackgroundVideo";
import { KineticTitle } from "../components/text/KineticTitle";
import { Kicker } from "../components/text/Kicker";
import { LowerThird } from "../components/text/LowerThird";
import { StatBig } from "../components/data/StatBig";
import { Chip } from "../components/data/Chip";
import { EndCard } from "../components/util/EndCard";
import { Watermark } from "../components/util/Watermark";
import { Flash } from "../components/util/Flash";
import { aframe } from "../data/aframe";

loadFonts();

// —— duração das cenas e transições (frames @30) ——
const S = { hook: 120, desafio: 240, sistema: 250, exec: 250, luz: 230, fim: 210 };
const T = { a: 14, b: 12, c: 14, d: 12, e: 16 };

// starts absolutos na timeline (para posicionar áudio) — ver PEDRA MOTION OS 03/03
const START = {
  hook: 0,
  desafio: 106, // 120 - 14
  sistema: 334,
  exec: 570,
  luz: 808,
  fim: 1022,
};
export const AFRAME_DURATION = 1232;

const sfx = (name: string) => staticFile(`audio/${name}.wav`);

export const AFrameCase: React.FC = () => {
  const m = aframe.media;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ————— CAMADAS DE ÁUDIO (PEDRA MOTION OS → 07 Sound Design) ————— */}
      <Audio
        src={sfx("ambient")}
        volume={(f) =>
          interpolate(
            f,
            [0, 40, AFRAME_DURATION - 60, AFRAME_DURATION],
            [0, 0.7, 0.7, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />
      <Sequence from={0}>
        <Audio src={sfx("riser")} volume={0.5} />
      </Sequence>
      <Sequence from={16}>
        <Audio src={sfx("boom")} volume={0.9} />
      </Sequence>
      {/* whooshes nas transições */}
      {[113, 340, 577, 814].map((f, i) => (
        <Sequence key={i} from={f - 4}>
          <Audio src={sfx("whoosh")} volume={0.7} />
        </Sequence>
      ))}
      {/* clicks dos chips (cena Sistema) */}
      {[358, 372, 386].map((f, i) => (
        <Sequence key={`c${i}`} from={f}>
          <Audio src={sfx("click")} volume={0.6} />
        </Sequence>
      ))}
      {/* booms nos KPIs (cena Execução) */}
      {[600, 664].map((f, i) => (
        <Sequence key={`k${i}`} from={f}>
          <Audio src={sfx("boom")} volume={0.55} />
        </Sequence>
      ))}
      {/* riser + impact no reveal final */}
      <Sequence from={980}>
        <Audio src={sfx("riser")} volume={0.6} />
      </Sequence>
      <Sequence from={START.fim + 2}>
        <Audio src={sfx("impact")} volume={1} />
      </Sequence>

      {/* ————— VÍDEO (PEDRA MOTION OS → 11 Blueprint Case de Obra) ————— */}
      <TransitionSeries>
        {/* 1 · HOOK */}
        <TransitionSeries.Sequence durationInFrames={S.hook}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.hookUp}
              span={S.hook}
              from={1.05}
              to={1.16}
              panY={-3}
              scrim="full"
            />
            <SafeArea justify="space-between">
              <Kicker text={`Grupo Pedra · ${aframe.local}`} delay={6} />
              <div>
                <KineticTitle
                  text="Uma casa em forma de A"
                  highlight="A"
                  size="h1"
                  delay={10}
                />
                <KineticTitle
                  text="no coração da mata."
                  highlight="mata."
                  size="h1"
                  delay={24}
                />
              </div>
            </SafeArea>
            <Watermark />
          </Scene>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T.a })}
        />

        {/* 2 · DESAFIO */}
        <TransitionSeries.Sequence durationInFrames={S.desafio}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.presenter}
              span={S.desafio}
              from={1.06}
              to={1.14}
              scrim="bottom"
            />
            <SafeArea>
              <LowerThird
                label="O desafio"
                title="Erguer um triângulo perfeito em terreno de floresta."
                delay={14}
              />
            </SafeArea>
            <Watermark />
          </Scene>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T.b })}
        />

        {/* 3 · SISTEMA CONSTRUTIVO */}
        <TransitionSeries.Sequence durationInFrames={S.sistema}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.formwork}
              span={S.sistema}
              from={1.05}
              to={1.15}
              panX={-2}
              scrim="full"
            />
            <SafeArea justify="space-between">
              <div style={{ paddingTop: SPACE.xl }}>
                <Kicker text="A engenharia" delay={8} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md, alignItems: "flex-start" }}>
                {aframe.chips.map((c, i) => (
                  <Chip key={c} text={c} delay={20 + i * 14} />
                ))}
              </div>
            </SafeArea>
            <Watermark />
          </Scene>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T.c })}
        />

        {/* 4 · EXECUÇÃO / DADOS */}
        <TransitionSeries.Sequence durationInFrames={S.exec}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.structure}
              span={S.exec}
              from={1.08}
              to={1.18}
              scrim="full"
            />
            <SafeArea>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xl }}>
                {aframe.stats.map((s, i) => (
                  <StatBig
                    key={s.label}
                    to={s.to}
                    suffix={s.suffix}
                    label={s.label}
                    delay={30 + i * 64}
                  />
                ))}
              </div>
            </SafeArea>
            <Watermark />
          </Scene>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T.d })}
        />

        {/* 5 · LUZ / DETALHE */}
        <TransitionSeries.Sequence durationInFrames={S.luz}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.lightInterior}
              span={S.luz}
              from={1.04}
              to={1.14}
              panY={2}
              scrim="bottom"
            />
            <SafeArea>
              <KineticTitle
                text="A luz entra por cada vão."
                highlight="vão."
                size="h2"
                delay={16}
              />
            </SafeArea>
            <Watermark />
          </Scene>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T.e })}
        />

        {/* 6 · GRANDIOSIDADE + LOGO */}
        <TransitionSeries.Sequence durationInFrames={S.fim}>
          <Scene>
            <BackgroundVideo
              src={m.src}
              startFrom={m.wide}
              span={S.fim}
              from={1.14}
              to={1.02}
              scrim="full"
              grain={false}
            />
            <AbsoluteFill
              style={{
                background: interpolateFadeToDark(),
              }}
            />
            <EndCard cta={aframe.cta} />
          </Scene>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* pattern interrupt: flash no reveal do logo */}
      <Flash at={START.fim + 2} len={10} />
    </AbsoluteFill>
  );
};

// escurece o plano final para destacar o cartão do logo
function interpolateFadeToDark() {
  return "linear-gradient(rgba(6,8,10,0.35), rgba(6,8,10,0.72))";
}
