import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING } from "../../theme/motion";

// Entrada com peso (assenta, não pisca). Ver PEDRA MOTION OS → 03_Motion_Design.
export const EnterUp: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 44, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.settle });
  const y = interpolate(p, [0, 1], [distance, 0]);
  return (
    <div style={{ transform: `translateY(${y}px)`, opacity: p }}>{children}</div>
  );
};
