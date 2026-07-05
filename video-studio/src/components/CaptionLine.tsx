import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";
import type { CaptionWord } from "../data/roteiro";

const FRAMES_PER_WORD = 6; // ritmo de entrada palavra a palavra

// Legenda corrida: cada palavra entra com pop/spring, palavra-chave em destaque.
// startFrame = frame (relativo ao Sequence) em que a 1a palavra aparece.
export const CaptionLine: React.FC<{
  words: CaptionWord[];
  startFrame: number;
}> = ({ words, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "88%",
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * FRAMES_PER_WORD;
        const entrance = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 14, stiffness: 200 },
        });
        const opacity = interpolate(entrance, [0, 1], [0, 1]);
        const scale = interpolate(entrance, [0, 1], [0.8, 1]);
        const y = interpolate(entrance, [0, 1], [18, 0]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 1.1,
              letterSpacing: -0.5,
              color: word.highlight ? theme.colors.highlight : theme.colors.textBase,
              textShadow: `0 3px 10px ${theme.colors.shadow}`,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
