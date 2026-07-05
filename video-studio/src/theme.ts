// Tokens centrais de identidade visual.
// Trocar a paleta aqui reflete em todos os templates (Pedra Engenharia / Tech / Infra,
// ou o estilo do canal dark). NUNCA hardcodar cor espalhada pelos componentes.

export const theme = {
  colors: {
    textBase: "#F5F1E8", // branco quente, mais cinematografico que branco puro
    highlight: "#E8B44C", // dourado da marca - palavra-chave
    hook: "#FFFFFF",
    shadow: "rgba(0,0,0,0.6)",
    // Fundos por cena (gradientes cinematograficos, sem precisar de imagem externa)
    scenesBg: [
      ["#1a1207", "#0a0704"], // deserto/noite quente
      ["#0d1b2a", "#050a12"], // azul profundo / tensao
      ["#2a1a0d", "#0f0803"], // fogo/altar
      ["#14210f", "#060a04"], // esperanca/verde escuro
    ] as [string, string][],
  },
  fonts: {
    // Em producao: instalar Bebas Neue / Anton / Inter via @remotion/google-fonts.
    // Fallbacks robustos que renderizam offline no Chromium do ambiente:
    hook: '"Bebas Neue", "Arial Narrow", "Arial Black", Impact, sans-serif',
    body: 'Inter, "Helvetica Neue", Arial, sans-serif',
    number: '"Montserrat", Inter, Arial, sans-serif',
  },
  // Zona segura 9:16: texto entre 10% e 85% vertical.
  safe: { top: 0.1, bottom: 0.85 },
} as const;
