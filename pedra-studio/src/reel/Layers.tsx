import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, RADIUS } from "../theme/tokens";
import { SPRING } from "../theme/motion";
import { stepAt, clean, type ZoomStep } from "./plan";
import type { Insert, Word } from "./types";
import { Manchete, Numero, Titulo } from "./Graphics";

const isImage = (src: string) => /\.(png|jpe?g|webp)$/i.test(src);

const Media: React.FC<{ src: string; muted?: boolean; from?: number }> = ({ src, muted = true, from = 0 }) =>
  isImage(src) ? (
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  ) : (
    <OffthreadVideo src={staticFile(src)} muted={muted} startFrom={Math.round(from * 30)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );

// Vídeo principal com punch zoom a cada frase + deriva lenta + tremida nas palavras-chave.
export const PunchZoomVideo: React.FC<{
  src: string;
  plan: ZoomStep[];
  keyHits: number[]; // segundos em que uma palavra-chave é dita
  muted?: boolean;
}> = ({ src, plan, keyHits, muted }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const step = stepAt(plan, t);
  const drift = 1 + ((t - step.s) / 8) * 0.03; // "respira" entre os saltos
  const hit = keyHits.find((h) => t >= h && t < h + 0.25);
  const shake = hit !== undefined ? Math.sin((t - hit) * 90) * 10 * (1 - (t - hit) / 0.25) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: COLORS.ink }}>
      <AbsoluteFill
        style={{ transform: `scale(${step.scale * drift}) translate(calc(${step.shiftX}% + ${shake / 4}px), ${step.shiftY}%) rotate(${shake / 20}deg)` }}
      >
        <Media src={src} muted={muted} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// B-roll: tela cheia (corta a fala visualmente, voz continua = J/L-cut) ou PIP.
export const InsertLayer: React.FC<{ item: Insert }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: SPRING.settle });
  if (item.mode === "manchete") return <Manchete {...item} />;
  if (item.mode === "numero") return <Numero {...item} />;
  if (item.mode === "titulo") return <Titulo {...item} />;
  if (item.mode === "full") {
    const scale = interpolate(p, [0, 1], [1.25, 1.05]) + (frame / fps) * 0.02;
    const blur = interpolate(frame, [0, 6], [18, 0], { extrapolateRight: "clamp" }); // whip de entrada
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, overflow: "hidden" }}>
        <Media src={item.src} from={item.from} />
      </AbsoluteFill>
    );
  }
  const y = interpolate(p, [0, 1], [-120, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 110,
        right: 110,
        height: 620,
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        border: `6px solid ${COLORS.white}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        transform: `translateY(${y}px) rotate(${interpolate(p, [0, 1], [-4, -1.5])}deg)`,
        opacity: p,
        background: COLORS.ink,
      }}
    >
      <Media src={item.src} from={item.from} />
    </div>
  );
};

export const Inserts: React.FC<{ items: Insert[] }> = ({ items }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {items.map((it, i) => (
        <Sequence key={i} from={Math.round(it.s * fps)} durationInFrames={Math.max(1, Math.round((it.e - it.s) * fps))}>
          <InsertLayer item={it} />
        </Sequence>
      ))}
    </>
  );
};

// Barra de progresso no topo: o espectador vê que "falta pouco" e fica.
export const ProgressBar: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const w = Math.min(1, frame / total) * 100;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${w}%`, background: COLORS.signal, boxShadow: `0 0 20px ${COLORS.signal}` }} />
  );
};

export const keyHitTimes = (words: Word[], keywords: string[]) => {
  const keys = new Set(keywords.map(clean));
  return words.filter((w) => keys.has(clean(w.t))).map((w) => w.s);
};
