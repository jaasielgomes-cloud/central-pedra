import { Img, staticFile, interpolate, useCurrentFrame } from "remotion";
import { SPACE } from "../../theme/tokens";

// Marca d'água discreta (logo variante clara). Posição consistente e segura.
export const Watermark: React.FC<{ delay?: number }> = ({ delay = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 14], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Img
      src={staticFile("media/logo_pedra_light.png")}
      style={{
        position: "absolute",
        top: SPACE.safe,
        right: SPACE.safe,
        width: 128,
        opacity: o,
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
      }}
    />
  );
};
