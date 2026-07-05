import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Background } from "./Background";
import { Hook } from "./Hook";
import { CaptionLine } from "./CaptionLine";
import { theme } from "../theme";
import type { Scene as SceneData } from "../data/roteiro";

// Um bloco de 30s: fundo + gancho (0-3.5s) + legendas palavra a palavra.
export const Scene: React.FC<{ scene: SceneData; bg: [string, string] }> = ({
  scene,
  bg,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const HOOK_FRAMES = Math.round(3.5 * fps);

  // Wipe de entrada do bloco (clip-path reveal sincronizado com o corte).
  const reveal = interpolate(frame, [0, 12], [0, 100], { extrapolateRight: "clamp" });

  // Exit fade do hook nos ultimos frames antes das legendas.
  const hookExit = interpolate(
    frame,
    [HOOK_FRAMES - 12, HOOK_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
      <Background from={bg[0]} to={bg[1]} />

      {/* HOOK - primeiros 3.5s, centralizado */}
      {frame < HOOK_FRAMES && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: hookExit,
            padding: "0 60px",
          }}
        >
          <Hook text={scene.hook} highlightIndex={scene.hookHighlight} />
        </AbsoluteFill>
      )}

      {/* LEGENDAS da narracao - zona segura (10%-85%), centro-baixo */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: `${(1 - theme.safe.bottom) * 100 + 6}%`,
        }}
      >
        {scene.lines.map((line, i) => {
          const startFrame = Math.round(line.startSec * fps);
          const next = scene.lines[i + 1];
          const endFrame = next
            ? Math.round(next.startSec * fps)
            : durationInFrames;
          return (
            <Sequence
              key={i}
              from={startFrame}
              durationInFrames={endFrame - startFrame}
              layout="none"
            >
              <AbsoluteFill
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              >
                <div style={{ paddingBottom: 0 }}>
                  <CaptionLine words={line.words} startFrame={0} />
                </div>
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
