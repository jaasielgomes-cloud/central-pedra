import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

// Grao de filme animado (feTurbulence com seed mudando por frame).
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 100;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Poeira/particulas subindo devagar (profundidade cinematografica).
const Dust: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();
  const { height, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`x-${i}`) * 100;
        const size = 1.5 + random(`s-${i}`) * 4;
        const speed = 0.3 + random(`v-${i}`) * 0.7;
        const startY = random(`y-${i}`) * height;
        const y = (startY - frame * speed) % height;
        const yy = y < 0 ? y + height : y;
        const drift = Math.sin((frame + i * 30) / 40) * 12;
        const op = 0.15 + 0.35 * random(`o-${i}`);
        const twinkle = 0.6 + 0.4 * Math.sin((frame + i * 20) / 15);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${x}% + ${drift}px)`,
              top: yy,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(232,180,76,0.9)",
              opacity: op * twinkle,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px rgba(232,180,76,0.6)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Raio de luz volumetrica descendo do topo (God rays), bem sutil.
const LightRays: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 90) * 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: 0.35 }}>
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          width: "70%",
          height: "120%",
          transform: `translateX(-50%) rotate(${8 + sway}deg)`,
          background:
            "linear-gradient(180deg, rgba(255,230,170,0.5) 0%, rgba(255,220,150,0.12) 40%, rgba(255,220,150,0) 75%)",
          filter: "blur(30px)",
        }}
      />
    </AbsoluteFill>
  );
};

// Barras cinematograficas suaves + flicker de exposicao filmica.
const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 1 + 0.02 * Math.sin(frame / 3) + 0.015 * random(`f-${frame}`);
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* color grade teal/orange muito sutil */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "soft-light",
          opacity: 0.25,
          background:
            "linear-gradient(180deg, rgba(70,130,180,0.6) 0%, rgba(0,0,0,0) 50%, rgba(232,140,60,0.5) 100%)",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", background: "#fff", opacity: (flicker - 1) * 0.4, mixBlendMode: "overlay" }} />
    </>
  );
};

// Camada mestre de efeitos (por cima do fundo, por baixo do texto).
export const Effects: React.FC = () => (
  <>
    <LightRays />
    <Dust />
    <FilmLook />
    <FilmGrain />
  </>
);
