import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

// Fundo cinematografico gerado por codigo (sem imagem externa):
// gradiente escuro + zoom lento (Ken Burns) + vinheta. Da sensacao de movimento
// mesmo sem b-roll. Em producao, troque por <Img>/<Video> com o mesmo zoom.
export const Background: React.FC<{ from: string; to: string }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);
  const shift = interpolate(frame, [0, durationInFrames], [-20, 20]);

  return (
    <AbsoluteFill style={{ backgroundColor: to, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${shift}px)`,
          background: `radial-gradient(120% 80% at 50% 35%, ${from} 0%, ${to} 70%)`,
        }}
      />
      {/* vinheta cinematografica */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
