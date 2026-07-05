import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";

// Hook grande dos primeiros 3s do bloco. Pop/scale-in com overshoot (nunca fade fraco).
// Palavra-chave (highlightIndex) em destaque dourado + maior.
export const Hook: React.FC<{ text: string; highlightIndex?: number }> = ({
  text,
  highlightIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 170 } });
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const words = text.split(" ");

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "90%",
      }}
    >
      {words.map((word, i) => {
        const isKey = i === highlightIndex;
        return (
          <span
            key={i}
            style={{
              fontFamily: theme.fonts.hook,
              fontWeight: 900,
              fontSize: isKey ? 132 : 108,
              lineHeight: 0.95,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: isKey ? theme.colors.highlight : theme.colors.hook,
              textShadow: `0 4px 16px ${theme.colors.shadow}`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
