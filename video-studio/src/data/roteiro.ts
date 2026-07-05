// ROTEIRO: historia com um GANCHO a cada 30 segundos (estrutura de retencao).
//
// Regra da skill legendas-retencao:
//  - Hook de cada bloco: <= 6 palavras, gancho real (nao vazio).
//  - Uma ideia por legenda (5-6 palavras visiveis).
//  - Highlight so na palavra-chave.
//
// IMPORTANTE sobre timing: aqui os tempos sao distribuidos por codigo (placeholder)
// so para o template renderizar sem audio. EM PRODUCAO, gere startSec de cada linha
// a partir da transcricao com timestamps (Whisper) da narracao real - nunca no olho.

export type CaptionWord = { text: string; highlight?: boolean };
export type CaptionLine = { words: CaptionWord[]; startSec: number };

export type Scene = {
  id: string;
  hook: string; // frase-gancho grande no inicio do bloco (<= 6 palavras)
  hookHighlight?: number; // indice da palavra do hook em destaque
  image?: string; // b-roll estatico: arquivo em public/ (ex: "cena1.jpg")
  video?: string; // b-roll em video: arquivo em public/ (ex: "cena1.mp4"). Tem prioridade sobre image.
  art?: "stars" | "desert" | "mountain" | "dawn"; // cenario procedural (sem asset externo)
  lines: CaptionLine[]; // legendas da narracao (startSec relativo AO BLOCO)
};

const w = (text: string, highlight = false): CaptionWord => ({ text, highlight });

// Cada bloco dura 30s. 4 blocos = 120s (2 min). Um gancho novo a cada 30s.
export const SCENE_SECONDS = 30;

export const scenes: Scene[] = [
  {
    id: "bloco-1",
    hook: "Deus pediu o IMPOSSÍVEL",
    hookHighlight: 3,
    art: "stars",
    lines: [
      { startSec: 4, words: [w("Ele era"), w("só"), w("um homem")] },
      { startSec: 7, words: [w("comum,"), w("sem"), w("nada de"), w("especial.")] },
      { startSec: 11, words: [w("Mas recebeu"), w("uma"), w("promessa", true)] },
      { startSec: 15, words: [w("que"), w("desafiava"), w("a"), w("lógica.")] },
      { startSec: 19, words: [w("Um"), w("filho", true), w("na"), w("velhice.")] },
      { startSec: 24, words: [w("E ele"), w("acreditou.")] },
    ],
  },
  {
    id: "bloco-2",
    hook: "A promessa parecia MORTA",
    hookHighlight: 3,
    art: "desert",
    lines: [
      { startSec: 4, words: [w("Os anos"), w("passaram.")] },
      { startSec: 7, words: [w("Nada", true), w("aconteceu.")] },
      { startSec: 10, words: [w("Sara"), w("já"), w("tinha"), w("desistido.")] },
      { startSec: 14, words: [w("Ela"), w("riu"), w("da"), w("promessa.")] },
      { startSec: 18, words: [w("Toda"), w("esperança", true), w("acabou.")] },
      { startSec: 23, words: [w("E foi"), w("aí"), w("que...")] },
    ],
  },
  {
    id: "bloco-3",
    hook: "No terceiro dia, tudo MUDOU",
    hookHighlight: 4,
    art: "mountain",
    lines: [
      { startSec: 4, words: [w("O impossível"), w("virou"), w("real", true)] },
      { startSec: 8, words: [w("Isaque"), w("nasceu.")] },
      { startSec: 11, words: [w("Mas veio"), w("o"), w("teste", true)] },
      { startSec: 15, words: [w("mais duro"), w("de"), w("todos.")] },
      { startSec: 19, words: [w("E a"), w("fé"), w("dele")] },
      { startSec: 23, words: [w("não"), w("tremeu.", true)] },
    ],
  },
  {
    id: "bloco-4",
    hook: "A fé dele te ENSINA isso",
    hookHighlight: 4,
    art: "dawn",
    lines: [
      { startSec: 4, words: [w("Promessa"), w("adiada"), w("não é")] },
      { startSec: 8, words: [w("promessa"), w("negada.", true)] },
      { startSec: 12, words: [w("O que"), w("parece"), w("morto")] },
      { startSec: 16, words: [w("pode"), w("renascer.", true)] },
      { startSec: 21, words: [w("SEGUE"), w("pra"), w("parte 2.")] },
    ],
  },
];
