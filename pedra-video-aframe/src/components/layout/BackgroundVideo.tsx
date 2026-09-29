import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { EASE } from "../../theme/motion";
import { GradeOverlay } from "../util/GradeOverlay";
import { FilmGrain } from "../util/FilmGrain";

// Fundo em vídeo com movimento de câmera (Ken Burns) + scrim de legibilidade.
// Ver PEDRA MOTION OS → 04_Cinematografia/02_Movimento_de_Camera + 12/02.
type Props = {
  src: string;
  startFrom: number; // frame do vídeo-fonte (na fps da composição)
  span: number; // duração da cena em frames (para o Ken Burns)
  from?: number; // escala inicial
  to?: number; // escala final
  panX?: number; // deslocamento horizontal em %
  panY?: number;
  scrim?: "bottom" | "full" | "top" | "none";
  grade?: boolean;
  grain?: boolean;
};

export const BackgroundVideo: React.FC<Props> = ({
  src,
  startFrom,
  span,
  from = 1.08,
  to = 1.18,
  panX = 0,
  panY = 0,
  scrim = "bottom",
  grade = true,
  grain = true,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, span], [from, to], {
    easing: EASE.inOut,
    extrapolateRight: "clamp",
  });
  const tx = interpolate(frame, [0, span], [0, panX], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, span], [0, panY], {
    extrapolateRight: "clamp",
  });

  const scrimBg =
    scrim === "bottom"
      ? "linear-gradient(to top, rgba(6,8,10,0.82) 0%, rgba(6,8,10,0.15) 42%, rgba(6,8,10,0.35) 100%)"
      : scrim === "full"
      ? "linear-gradient(to top, rgba(6,8,10,0.9) 0%, rgba(6,8,10,0.5) 55%, rgba(6,8,10,0.7) 100%)"
      : scrim === "top"
      ? "linear-gradient(to bottom, rgba(6,8,10,0.8) 0%, rgba(6,8,10,0.1) 45%)"
      : "transparent";

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080a", overflow: "hidden" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale}) translate(${tx}%, ${ty}%)` }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {scrim !== "none" && <AbsoluteFill style={{ background: scrimBg }} />}
      {grade && <GradeOverlay />}
      {grain && <FilmGrain />}
    </AbsoluteFill>
  );
};
