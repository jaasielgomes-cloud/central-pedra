import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TYPO } from "../../theme/tokens";
import { SPRING } from "../../theme/motion";

// Título cinético: entra palavra a palavra, com destaque na palavra-chave.
// Ver PEDRA MOTION OS → 12_Componentes_Remotion/01_Titulos_e_Texto.
type Props = {
  text: string;
  highlight?: string;
  delay?: number;
  size?: keyof typeof TYPO.size;
  align?: "left" | "center";
  step?: number;
};

export const KineticTitle: React.FC<Props> = ({
  text,
  highlight,
  delay = 0,
  size = "h1",
  align = "left",
  step = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const hlClean = highlight?.replace(/[.,!?]/g, "").toLowerCase();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.05em 0.28em",
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: TYPO.family.display,
        fontSize: TYPO.size[size],
        fontWeight: TYPO.weight.black,
        letterSpacing: TYPO.tracking.tight,
        lineHeight: TYPO.line.tight,
        color: COLORS.white,
        textShadow: "0 6px 40px rgba(0,0,0,0.55)",
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const p = spring({
          frame: frame - delay - i * step,
          fps,
          config: SPRING.settle,
        });
        const y = interpolate(p, [0, 1], [34, 0]);
        const clean = w.replace(/[.,!?]/g, "").toLowerCase();
        const isKey = hlClean ? clean === hlClean : false;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity: p,
              color: isKey ? COLORS.signal : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
