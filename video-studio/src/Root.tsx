import React from "react";
import { Composition } from "remotion";
import { HistoriaComGanchos } from "./HistoriaComGanchos";
import { scenes, SCENE_SECONDS } from "./data/roteiro";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HistoriaComGanchos"
        component={HistoriaComGanchos}
        durationInFrames={scenes.length * SCENE_SECONDS * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
