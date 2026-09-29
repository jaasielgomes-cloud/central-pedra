// Contrato de dados do Reel. O pipeline (pipeline/montar.py) gera este JSON;
// a composição só lê. Tempos sempre em SEGUNDOS.
export type Word = { t: string; s: number; e: number };

export type Insert = {
  s: number;
  e: number;
  src: string; // arquivo em public/ (vídeo .mp4 ou imagem .jpg/.png)
  mode: "full" | "pip"; // tela cheia ou janela sobre a fala
  from?: number; // (s) ponto de início dentro do arquivo de B-roll
};

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
  music?: string;
  musicVolume?: number;
};
