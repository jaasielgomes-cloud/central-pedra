import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TYPO, SPACE } from "../../theme/tokens";
import { SPRING } from "../../theme/motion";

// Micro-label em caixa alta com tracking largo. Ver PEDRA MOTION OS → 12/01.
export const Kicker: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text,
  delay = 0,
  color = COLORS.signal,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.reveal });
  const w = interpolate(p, [0, 1], [140, 0]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: SPACE.sm,
        opacity: p,
      }}
    >
      <div style={{ width: 46, height: 4, background: color, borderRadius: 2 }} />
      <span
        style={{
          fontFamily: TYPO.family.body,
          fontWeight: TYPO.weight.bold,
          fontSize: TYPO.size.micro,
          letterSpacing: w,
          color: COLORS.white,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};
