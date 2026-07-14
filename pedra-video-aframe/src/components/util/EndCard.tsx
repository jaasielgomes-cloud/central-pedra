import {
  AbsoluteFill,
  Img,
  staticFile,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, TYPO, SPACE, RADIUS } from "../../theme/tokens";
import { SPRING } from "../../theme/motion";

// Cartão final com logo oficial + assinatura. Ver PEDRA MOTION OS → 12/04.
export const EndCard: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pCard = spring({ frame, fps, config: SPRING.reveal });
  const pCta = spring({ frame: frame - 18, fps, config: SPRING.settle });
  const scale = interpolate(pCard, [0, 1], [0.86, 1]);
  const ctaY = interpolate(pCta, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: SPACE.xl,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: pCard,
          background: COLORS.limestone,
          borderRadius: RADIUS.lg,
          padding: `${SPACE.xxl}px ${SPACE.xxl}px`,
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        }}
      >
        <Img src={staticFile("media/logo_pedra.png")} style={{ width: 460 }} />
      </div>
      <div
        style={{
          transform: `translateY(${ctaY}px)`,
          opacity: pCta,
          fontFamily: TYPO.family.display,
          fontWeight: TYPO.weight.bold,
          fontSize: TYPO.size.h3,
          letterSpacing: TYPO.tracking.snug,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
