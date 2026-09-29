// Design Tokens — Grupo Pedra (cores reais amostradas da logo oficial)
// Ver PEDRA MOTION OS → 09_Biblioteca_Visual/01_Design_Tokens
export const COLORS = {
  ink: "#08090B", // preto verdadeiro (fundo cinema)
  graphite: "#111418", // base escura
  concrete: "#C7C9CC", // neutro / texto secundário
  limestone: "#F5F4F0", // claro / card
  white: "#FFFFFF",
  signal: "#F0291B", // VERMELHO oficial Grupo Pedra (amostrado)
  signalDeep: "#C21A10",
  steel: "#3A6B8C",
} as const;

export const TYPO = {
  family: {
    display: "Archivo, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: "'Space Grotesk', monospace",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
  // escala px para composição 1080x1920
  size: { hero: 138, h1: 104, h2: 78, h3: 56, body: 42, caption: 32, micro: 26 },
  tracking: { tight: "-0.03em", snug: "-0.01em", normal: "0", wide: "0.28em" },
  line: { tight: 1.0, normal: 1.15, relaxed: 1.4 },
} as const;

export const SPACE = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 100, safe: 96 } as const;
export const RADIUS = { sm: 10, md: 18, lg: 30, pill: 999 } as const;

export const VIDEO = { w: 1080, h: 1920, fps: 30 } as const;
