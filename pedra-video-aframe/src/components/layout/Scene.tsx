import { AbsoluteFill } from "remotion";
import { SPACE } from "../../theme/tokens";

// Wrapper de cena. A grade de cor e o grão vivem no BackgroundVideo (abaixo do texto).
export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);

export const SafeArea: React.FC<{
  children: React.ReactNode;
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "flex-start" | "center" | "flex-end";
  bottomInset?: number;
}> = ({ children, justify = "flex-end", align = "flex-start", bottomInset = 360 }) => (
  <AbsoluteFill
    style={{
      padding: SPACE.safe,
      paddingBottom: bottomInset, // zona segura de UI da plataforma (Reels/TikTok)
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: align,
    }}
  >
    {children}
  </AbsoluteFill>
);
