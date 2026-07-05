import React from "react";
import { AbsoluteFill, Audio, Series, staticFile, useVideoConfig } from "remotion";
import { scenes, SCENE_SECONDS } from "./data/roteiro";
import { theme } from "./theme";
import { Scene } from "./components/Scene";
import { ProgressBar } from "./components/ProgressBar";

// Composicao principal: historia com um GANCHO a cada 30s.
// Cada bloco de 30s abre com um hook e emenda no proximo com um wipe.
export const HistoriaComGanchos: React.FC = () => {
  const { fps } = useVideoConfig();
  const sceneFrames = SCENE_SECONDS * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* TRILHA sonora cinematografica (regenerar com assets-gen/gen_trilha.py).
          volume baixo para nao competir com a narracao quando ela existir. */}
      <Audio src={staticFile("trilha.wav")} volume={0.5} />

      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence key={scene.id} durationInFrames={sceneFrames}>
            <Scene scene={scene} bg={theme.colors.scenesBg[i % theme.colors.scenesBg.length]} />
          </Series.Sequence>
        ))}
      </Series>
      <ProgressBar />
    </AbsoluteFill>
  );
};
