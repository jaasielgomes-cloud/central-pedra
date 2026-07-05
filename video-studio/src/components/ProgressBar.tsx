import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";

// Barra de progresso no topo: truque de retencao ("falta pouco, continua vendo").
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames], [0, 100]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start" }}>
      <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.12)" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: theme.colors.highlight,
            boxShadow: `0 0 12px ${theme.colors.highlight}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
