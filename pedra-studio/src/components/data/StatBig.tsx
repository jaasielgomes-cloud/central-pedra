import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, TYPO, SPACE } from "../../theme/tokens";
import { EASE } from "../../theme/motion";
import { EnterUp } from "../util/Stagger";

// Número-chave que conta + rótulo. Ver PEDRA MOTION OS → 12/03 + 10/03.
export const StatBig: React.FC<{
  to: number;
  label: string;
  suffix?: string;
  prefix?: string;
  dur?: number;
  delay?: number;
}> = ({ to, label, suffix = "", prefix = "", dur = 42, delay = 0 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame - delay, [0, dur], [0, to], {
    easing: EASE.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <EnterUp delay={delay}>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs }}>
        <span
          style={{
            fontFamily: TYPO.family.mono,
            fontVariantNumeric: "tabular-nums",
            fontWeight: TYPO.weight.bold,
            fontSize: TYPO.size.hero,
            lineHeight: 0.95,
            color: COLORS.white,
            textShadow: "0 6px 40px rgba(0,0,0,0.5)",
          }}
        >
          {prefix}
          {Math.round(v)}
          <span style={{ color: COLORS.signal }}>{suffix}</span>
        </span>
        <span
          style={{
            fontFamily: TYPO.family.body,
            fontWeight: TYPO.weight.medium,
            fontSize: TYPO.size.caption,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: COLORS.concrete,
          }}
        >
          {label}
        </span>
      </div>
    </EnterUp>
  );
};
