import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { SceneArt, ArtKind } from "./SceneArt";

// Fundo cinematografico com zoom lento (Ken Burns).
// Prioridade de b-roll: video > imagem > arte procedural > gradiente.
// `video`/`image` = nome do arquivo em public/ (ex: "cena1.mp4" / "cena1.jpg").
export const Background: React.FC<{
  from: string;
  to: string;
  image?: string;
  video?: string;
  art?: ArtKind;
}> = ({ from, to, image, video, art }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);
  const shift = interpolate(frame, [0, durationInFrames], [-20, 20]);

  return (
    <AbsoluteFill style={{ backgroundColor: to, overflow: "hidden" }}>
      {video ? (
        <AbsoluteFill
          style={{ transform: `scale(${scale}) translateY(${shift}px)` }}
        >
          <OffthreadVideo
            src={staticFile(video)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : image ? (
        <AbsoluteFill
          style={{ transform: `scale(${scale}) translateY(${shift}px)` }}
        >
          <Img
            src={staticFile(image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : art ? (
        <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${shift}px)` }}>
          <SceneArt kind={art} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translateY(${shift}px)`,
            background: `radial-gradient(120% 80% at 50% 35%, ${from} 0%, ${to} 70%)`,
          }}
        />
      )}
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
