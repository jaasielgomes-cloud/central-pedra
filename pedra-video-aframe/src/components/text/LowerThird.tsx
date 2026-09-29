import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TYPO, SPACE } from "../../theme/tokens";
import { SPRING } from "../../theme/motion";

// Rótulo contextual (fase da obra / identificação). Ver PEDRA MOTION OS → 12/01.
export const LowerThird: React.FC<{
  title: string;
  label?: string;
  delay?: number;
}> = ({ title, label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.reveal });
  const x = interpolate(p, [0, 1], [-46, 0]);
  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity: p,
        borderLeft: `5px solid ${COLORS.signal}`,
        paddingLeft: SPACE.md,
        display: "flex",
        flexDirection: "column",
        gap: SPACE.xs,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: TYPO.family.body,
            fontWeight: TYPO.weight.bold,
            fontSize: TYPO.size.micro,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: COLORS.signal,
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontFamily: TYPO.family.display,
          fontWeight: TYPO.weight.bold,
          fontSize: TYPO.size.h3,
          lineHeight: TYPO.line.normal,
          color: COLORS.white,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {title}
      </span>
    </div>
  );
};
