import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Pattern interrupt — flash branco no reveal. Ver PEDRA MOTION OS → 06/03.
export const Flash: React.FC<{ at: number; len?: number; color?: string }> = ({
  at,
  len = 8,
  color = "#ffffff",
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + len * 0.35, at + len], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ background: color, opacity: o, pointerEvents: "none" }}
    />
  );
};
