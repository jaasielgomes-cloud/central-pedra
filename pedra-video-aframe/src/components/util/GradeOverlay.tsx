import { AbsoluteFill } from "remotion";

// Grade de cor cinematográfica: vinheta + sombra fria + luz quente.
// Ver PEDRA MOTION OS → 04_Cinematografia/03_Iluminacao_e_Cor
export const GradeOverlay: React.FC<{ vignette?: number }> = ({ vignette = 0.42 }) => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 42%, transparent 46%, rgba(0,0,0,${vignette}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{ background: "rgba(18,28,40,0.10)", mixBlendMode: "multiply" }}
    />
    <AbsoluteFill
      style={{ background: "rgba(255,178,120,0.06)", mixBlendMode: "screen" }}
    />
  </>
);
