import type { Word } from "./types";

// Lógica pura (sem React): transforma palavras em blocos de legenda e plano de zoom.

export type Chunk = { words: Word[]; s: number; e: number };

const MAX_WORDS = 3; // legenda curta = leitura instantânea no celular
const PAUSE = 0.3; // pausa (s) que quebra bloco / indica corte
const PUNCT = /[.,!?;:]$/;

export const clean = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]/g, "");

export const buildChunks = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.s - w.e : 0;
    if (cur.length >= MAX_WORDS || PUNCT.test(w.t) || gap > PAUSE) flush();
  });
  flush();
  return out;
};

// "Punch zoom" estilo Nicolas: a cada frase nova o enquadramento salta
// (esconde o jump cut e reseta a atenção). Alterna níveis sem repetir.
const LEVELS = [1.0, 1.14, 1.06, 1.2];

export type ZoomStep = { s: number; scale: number; shiftY: number };

export const buildZoomPlan = (chunks: Chunk[]): ZoomStep[] => {
  const steps: ZoomStep[] = [{ s: 0, scale: LEVELS[0], shiftY: 0 }];
  let i = 0;
  chunks.forEach((c, idx) => {
    const prev = chunks[idx - 1];
    const sentenceStart = !prev || PUNCT.test(prev.words[prev.words.length - 1].t) || c.s - prev.e > PAUSE;
    if (idx > 0 && sentenceStart) {
      i = (i + 1) % LEVELS.length;
      steps.push({ s: c.s, scale: LEVELS[i], shiftY: LEVELS[i] > 1.1 ? -3 : 0 });
    }
  });
  return steps;
};

export const stepAt = (plan: ZoomStep[], t: number) => {
  let cur = plan[0];
  for (const p of plan) if (p.s <= t) cur = p;
  return cur;
};
