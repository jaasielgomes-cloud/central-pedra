import { Composition } from "remotion";
import { VIDEO } from "./theme/tokens";
import { AFrameCase, AFRAME_DURATION } from "./compositions/AFrameCase";
import { ReelRetencao, calcReelMetadata } from "./compositions/ReelRetencao";
import type { ReelData } from "./reel/types";
import exemplo from "./data/reel-exemplo.json";

// Cada vídeo novo = um JSON em src/data (gerado pelo pipeline) passado via --props.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ReelRetencao"
      component={ReelRetencao}
      defaultProps={{ data: exemplo as ReelData }}
      calculateMetadata={calcReelMetadata}
      durationInFrames={300}
      fps={VIDEO.fps}
      width={VIDEO.w}
      height={VIDEO.h}
    />
    <Composition
      id="AFrameCase"
      component={AFrameCase}
      durationInFrames={AFRAME_DURATION}
      fps={VIDEO.fps}
      width={VIDEO.w}
      height={VIDEO.h}
    />
  </>
);
