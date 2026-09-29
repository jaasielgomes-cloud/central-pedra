import { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, type CalculateMetadataFunction } from "remotion";
import { loadFonts } from "../theme/fonts";
import { KineticTitle } from "../components/text/KineticTitle";
import { GradeOverlay } from "../components/util/GradeOverlay";
import { FilmGrain } from "../components/util/FilmGrain";
import { Flash } from "../components/util/Flash";
import { Watermark } from "../components/util/Watermark";
import { EndCard } from "../components/util/EndCard";
import { Captions } from "../reel/Captions";
import { Inserts, PunchZoomVideo, ProgressBar, keyHitTimes } from "../reel/Layers";
import { buildChunks, buildZoomPlan } from "../reel/plan";
import type { ReelData } from "../reel/types";

// REEL DE RETENÇÃO — dinâmicas de edição "estilo Nicolas":
// gancho em 0s · punch zoom a cada frase · legenda palavra-a-palavra · B-roll/PIP
// · tremida + SFX nas palavras-chave · barra de progresso · CTA final.
// Dois modos: FALA (data.video) ou NARRAÇÃO IA (data.audio + data.bg).
loadFonts();

export const CTA_SECONDS = 2.5;
const HOOK_SECONDS = 2.4;
const sfx = (n: string) => staticFile(`audio/${n}.wav`);

export const ReelRetencao: React.FC<{ data: ReelData }> = ({ data }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const chunks = useMemo(() => buildChunks(data.words), [data.words]);
  const plan = useMemo(() => buildZoomPlan(chunks), [chunks]);
  const hits = useMemo(() => keyHitTimes(data.words, data.keywords), [data.words, data.keywords]);
  const main = data.video ?? data.bg;
  if (!main) throw new Error("ReelData precisa de 'video' (modo fala) ou 'bg' (modo narração).");
  const content = f(data.duration);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={content}>
        <PunchZoomVideo src={main} plan={plan} keyHits={hits} muted={!data.video} />
        <Inserts items={data.inserts} />
        {data.look === "estudio" && (
          <AbsoluteFill style={{ background: "radial-gradient(70% 55% at 50% 38%, transparent 30%, rgba(0,0,0,0.78) 100%)" }} />
        )}
        <GradeOverlay vignette={data.look === "estudio" ? 0.55 : 0.35} />
        <FilmGrain opacity={0.05} />

        <Sequence durationInFrames={f(HOOK_SECONDS)}>
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 45%)" }} />
          <div style={{ position: "absolute", top: 230, left: 80, right: 80 }}>
            <KineticTitle text={data.hook.text} highlight={data.hook.highlight} size="h1" align="center" step={3} />
          </div>
        </Sequence>

        <Captions chunks={chunks} keywords={data.keywords} />
        <ProgressBar total={content} />
        <Watermark />
        <Flash at={0} len={6} />

        {/* ÁUDIO: voz → música baixa → SFX sincronizados */}
        {data.audio && <Audio src={staticFile(data.audio)} />}
        {data.music && <Audio src={staticFile(data.music)} volume={(fr) => musicVol(fr / fps, data)} />}
        {data.drop !== undefined && (
          <Sequence from={f(data.drop)} durationInFrames={f(1.5)}>
            <Audio src={sfx("boom")} volume={0.8} />
          </Sequence>
        )}
        <Audio src={sfx("boom")} volume={0.7} />
        {plan.slice(1).map((p, i) => (
          <Sequence key={`z${i}`} from={f(p.s)} durationInFrames={10}>
            <Audio src={sfx("click")} volume={0.25} />
          </Sequence>
        ))}
        {data.inserts.map((it, i) => (
          <Sequence key={`w${i}`} from={Math.max(0, f(it.s) - 4)} durationInFrames={20}>
            <Audio src={sfx("whoosh")} volume={0.5} />
          </Sequence>
        ))}
        {hits.map((h, i) => (
          <Sequence key={`k${i}`} from={f(h)} durationInFrames={30}>
            <Audio src={sfx("impact")} volume={0.45} />
          </Sequence>
        ))}
        <Sequence from={Math.max(0, content - f(1.2))} durationInFrames={f(1.4)}>
          <Audio src={sfx("riser")} volume={0.45} />
        </Sequence>
      </Sequence>

      <Sequence from={content} durationInFrames={f(CTA_SECONDS)}>
        <AbsoluteFill style={{ background: "#08090B" }} />
        <EndCard cta={data.cta.text} />
        <Audio src={sfx("boom")} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Trilha cresce ao longo do vídeo (tensão) e some antes do clímax ("drop").
const musicVol = (t: number, d: ReelData) => {
  const base = (d.musicVolume ?? 0.12) * (0.8 + 0.5 * Math.min(1, t / d.duration));
  if (d.drop !== undefined && t > d.drop - 0.6 && t < d.drop) return 0;
  return base;
};

export const calcReelMetadata: CalculateMetadataFunction<{ data: ReelData }> = ({ props }) => ({
  durationInFrames: Math.ceil((props.data.duration + CTA_SECONDS) * 30),
});
