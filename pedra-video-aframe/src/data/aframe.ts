// DADOS DO VÍDEO — separados do layout (PEDRA MOTION OS → 13/01).
// ⚠️ Os números em `stats` são PLACEHOLDERS de demonstração.
//    Substitua pelos dados reais confirmados da obra antes de publicar.
export const aframe = {
  projeto: "Casa em A",
  local: "Reserva de mata nativa",
  cta: "Construindo o extraordinário.",

  // segmentos do vídeo-fonte (frame inicial, na fps da composição = 30)
  media: {
    src: "media/aframe.mp4",
    hookUp: 175, // pan de baixo pra cima na estrutura em A
    presenter: 8, // engenheiro apresentando
    formwork: 360, // fôrmas de madeira + armadura
    structure: 540, // ângulos da estrutura
    lightInterior: 1170, // interior com raios de luz
    wide: 300, // plano aberto da casa
  },

  chips: ["Fôrmas de madeira", "Armadura de aço", "Concreto moldado in loco"],

  // PLACEHOLDERS — confirmar com o engenheiro responsável
  stats: [
    { to: 45, suffix: "°", label: "inclinação da estrutura" },
    { to: 100, suffix: "%", label: "concreto moldado in loco" },
  ],
} as const;
