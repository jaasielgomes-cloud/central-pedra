// Contrato de dados do Reel. O pipeline (pipeline/montar.py) gera este JSON;
// a composição só lê. Tempos sempre em SEGUNDOS.
export type Word = { t: string; s: number; e: number };

type Janela = { s: number; e: number };

// Camadas visuais sobre a fala (pattern interrupts). Referências:
// full/pip = B-roll (Nikolas/Penin) · manchete = print de notícia com marca-texto (Penin)
// numero = dado que conta na tela · titulo = cartela de capítulo (documentário/Abraham)
export type Insert =
  | (Janela & { mode: "full" | "pip"; src: string; from?: number }) // from = segundo inicial no B-roll
  | (Janela & { mode: "manchete"; fonte: string; texto: string; destaque: string })
  | (Janela & { mode: "numero"; valor: number; rotulo: string; prefixo?: string; sufixo?: string })
  | (Janela & { mode: "titulo"; texto: string; kicker?: string });

export type ReelData = {
  duration: number; // duração do conteúdo (sem o CTA)
  video?: string; // modo FALA: vídeo da pessoa falando (já sem silêncios)
  audio?: string; // modo NARRAÇÃO: voz gerada (Chatterbox) sobre B-roll
  bg?: string; // fundo do modo NARRAÇÃO
  words: Word[];
  hook: { text: string; highlight?: string };
  keywords: string[]; // palavras de impacto: vermelho + tremida + SFX
  inserts: Insert[];
  cta: { text: string };
  look?: "obra" | "estudio"; // estudio = fundo escuro + luz dramática (monólogo estilo Nikolas)
  drop?: number; // (s) música some 0,6 s antes e volta com impacto: marca o clímax
  music?: string;
  musicVolume?: number;
};
