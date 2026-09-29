import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// Grão de filme sutil que unifica o material e adiciona textura cinema.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(`grain-${frame}`) * 1000);
  const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  )}`;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${svg}")`,
        backgroundSize: "cover",
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
