import { COLORS, TYPO, SPACE, RADIUS } from "../../theme/tokens";
import { EnterUp } from "../util/Stagger";

// Tag/chip de sistema construtivo, entra em cascata. Ver PEDRA MOTION OS → 12/03.
export const Chip: React.FC<{ text: string; delay?: number; active?: boolean }> = ({
  text,
  delay = 0,
  active = false,
}) => (
  <EnterUp delay={delay} distance={26}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: SPACE.sm,
        padding: `${SPACE.sm}px ${SPACE.md}px`,
        borderRadius: RADIUS.pill,
        background: active ? COLORS.signal : "rgba(245,244,240,0.10)",
        border: `1.5px solid ${active ? COLORS.signal : "rgba(245,244,240,0.28)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: active ? COLORS.white : COLORS.signal,
        }}
      />
      <span
        style={{
          fontFamily: TYPO.family.body,
          fontWeight: TYPO.weight.semibold,
          fontSize: TYPO.size.caption,
          color: COLORS.white,
        }}
      >
        {text}
      </span>
    </div>
  </EnterUp>
);
