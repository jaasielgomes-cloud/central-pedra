import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TYPO } from "../theme/tokens";
import { SPRING } from "../theme/motion";
import { clean, type Chunk } from "./plan";

// Legenda dinâmica palavra-a-palavra (estilo karaokê): bloco entra com "pop",
// a palavra falada acende em amarelo; palavras-chave ficam no vermelho da marca.
const ACTIVE = "#FFD60A";

export const Captions: React.FC<{ chunks: Chunk[]; keywords: string[] }> = ({ chunks, keywords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = chunks.find((c) => t >= c.s && t < c.e + 0.15);
  if (!chunk) return null;

  const keys = new Set(keywords.map(clean));
  const pop = spring({ frame: frame - Math.round(chunk.s * fps), fps, config: SPRING.pop });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: "63%", // acima da zona da legenda/botões do Instagram
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.3em",
        transform: `scale(${scale})`,
        fontFamily: TYPO.family.display,
        fontWeight: TYPO.weight.black,
        fontSize: 92,
        lineHeight: 1.05,
        textTransform: "uppercase",
        letterSpacing: TYPO.tracking.snug,
        textAlign: "center",
      }}
    >
      {chunk.words.map((w, i) => {
        const spoken = t >= w.s;
        const isKey = keys.has(clean(w.t));
        const color = isKey ? COLORS.signal : spoken ? ACTIVE : COLORS.white;
        return (
          <span
            key={i}
            style={{
              color,
              WebkitTextStroke: "3px #000",
              paintOrder: "stroke fill",
              textShadow: "0 8px 30px rgba(0,0,0,0.7)",
              // salto + inclinação (sem escala: não invade a palavra vizinha)
              transform: isKey && spoken ? "translateY(-8px) rotate(-3deg)" : undefined,
              display: "inline-block",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
