import { Composition } from "remotion";
import { VIDEO } from "./theme/tokens";
import { AFrameCase, AFRAME_DURATION } from "./compositions/AFrameCase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
};
