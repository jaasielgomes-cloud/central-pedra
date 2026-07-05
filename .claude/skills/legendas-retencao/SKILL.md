---
name: legendas-retencao
description: "Especialista em tipografia cinematográfica, legendas dinâmicas e ganchos visuais para maximizar retenção em vídeos do Grupo Pedra. Define fontes, cores, timing, animações e efeitos de texto (palavra a palavra, highlight, kinetic typography) priorizando implementação em Remotion (código), com equivalentes para CapCut, Premiere e DaVinci Resolve. Use esta Skill sempre que o usuário mencionar legendas, captions, texto na tela, tipografia, ganchos textuais, hook visual, retenção de vídeo, ou pedir para estilizar/animar texto em Reels, Stories ou vídeos institucionais — mesmo que a palavra 'legenda' não seja usada explicitamente (ex: 'deixa esse vídeo mais viral', 'quero que o texto chame mais atenção')."
---

# Legendas de Retenção Cinematográfica

## Objetivo

Transformar texto na tela em uma ferramenta de retenção: cada legenda deve prender o olho, reforçar a fala e manter a identidade profissional do Grupo Pedra (Engenharia, Tech, Infra). Estilo-alvo: **híbrido** — ritmo e impacto de conteúdo viral, com sobriedade visual de marca corporativa. Nunca vira "meme" nem perde credibilidade institucional.

Prioridade de implementação: **Remotion** (código, controle total de frame). CapCut/Premiere/DaVinci são fallback manual — ver `references/ferramentas-manuais.md`.

---

## 1. Princípios de retenção (aplicar sempre)

- **Regra dos 3 segundos**: o hook textual do primeiro corte decide se a pessoa continua. Deve ser uma frase de impacto ≤6 palavras, sem verbo de ligação fraco.
- **Uma ideia por legenda.** Nunca mais de 5-6 palavras visíveis simultaneamente em 9:16.
- **Palavra-chave em destaque**, não a frase toda em caps ou cor — isso cansa e reduz contraste semântico.
- **Sincronismo audio-texto**: legenda entra no exato frame em que a palavra é dita (±2 frames a 30fps). Timing solto é o erro nº1 de retenção.
- **Silêncio visual entre cortes**: 1-2 frames sem texto entre blocos evita poluição e dá "respiro" cinematográfico.
- **Zona segura 9:16**: texto sempre entre 10%-85% vertical, nunca sob a UI do Instagram/TikTok (últimos ~12% inferiores).

---

## 2. Tipografia Grupo Pedra (híbrido)

| Uso | Fonte | Peso | Racional |
|---|---|---|---|
| Hook / palavra de impacto | Bebas Neue ou Anton | Bold/Black | Alto contraste, leitura instantânea |
| Legenda corrida (fala) | Inter ou Montserrat | SemiBold | Legibilidade + identidade institucional já usada no Grupo Pedra |
| Dados/números/KPIs | Montserrat | Bold, tabular nums | Precisão técnica, reforça autoridade de engenharia |

Regras:
- Nunca usar mais de 2 famílias tipográficas por vídeo.
- Highlight de palavra-chave: mudança de **cor** (paleta da marca) OU **peso**, nunca as duas + itálico juntas (poluição visual).
- Contraste mínimo: stroke/shadow sutil (2-4px, opacidade 60-80%) para legibilidade sobre qualquer fundo — nunca caixa sólida colorida cobrindo a imagem (quebra o "cinematográfico").

---

## 3. Ganchos textuais (primeiros 3s)

Estruturas testadas, adaptar ao conteúdo técnico/institucional:
- **Contraste**: "Isso custaria 3x mais sem [método]"
- **Pergunta direta**: "Por que essa obra terminou 40% mais rápido?"
- **Número + promessa**: "180 dias. 1 galpão. Zero atraso."
- **Negação de expectativa**: "Não é sobre economia. É sobre isso."

Regra de marca: o gancho pode ser ousado no ritmo, mas o conteúdo prometido tem que ser real e verificável — Grupo Pedra não usa clickbait vazio.

---

## 4. Efeitos por função (mapa de decisão)

| Função da legenda | Efeito recomendado | Evitar |
|---|---|---|
| Hook inicial | Pop/scale-in com spring (overshoot leve) | Fade simples (fraco demais para reter) |
| Palavra-chave em frase corrida | Highlight de cor entrando com leve delay (~2-3 frames após a palavra) | Piscar/flash |
| Dado técnico/KPI | Count-up numérico ou slide-in lateral | Glitch (quebra seriedade institucional) |
| Transição de bloco/cena | Wipe ou clip-path reveal sincronizado com o corte | Zoom exagerado |
| CTA final | Slide-up + leve bounce, permanece estático 1-2s | Qualquer animação contínua (dificulta leitura do CTA) |

Glitch, shake e chromatic aberration ficam reservados para BTS/bastidores informais — nunca em conteúdo institucional ou comercial B2B.

---

## 5. Implementação em Remotion

Padrão recomendado: `@remotion/captions` para parsing de timing + componente próprio de estilo para manter a identidade visual.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

type Word = { text: string; startFrame: number; endFrame: number; highlight?: boolean };

export const CaptionLine = ({ words }: { words: Word[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {words.map((w, i) => {
        const entrance = spring({
          frame: frame - w.startFrame,
          fps,
          config: { damping: 12, stiffness: 180 },
        });
        const opacity = interpolate(entrance, [0, 1], [0, 1]);
        const scale = interpolate(entrance, [0, 1], [0.85, 1]);

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `scale(${scale})`,
              fontFamily: w.highlight ? "Bebas Neue" : "Inter",
              fontWeight: w.highlight ? 900 : 600,
              color: w.highlight ? "#E8B44C" : "#FFFFFF", // ajustar à paleta oficial
              textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              fontSize: w.highlight ? 64 : 52,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
```

Checklist técnico Remotion:
- Gerar `startFrame`/`endFrame` a partir de transcrição com timestamps (Whisper ou similar) — nunca estimar timing manualmente.
- Usar `spring()` para toda entrada de texto (nunca CSS transition estático — não renderiza corretamente frame a frame).
- Testar em 9:16 e 16:9 — o tamanho de fonte deve escalar por composição, não fixo em px absoluto.
- Cor de highlight vem de um token central (`theme.ts`), nunca hardcoded espalhado pelos componentes — facilita trocar paleta por empresa (Pedra Engenharia / Tech / Infra).

---

## 6. Ferramentas manuais (fallback)

Instruções detalhadas por ferramenta (posicionamento, keyframes, plugins) estão em `references/ferramentas-manuais.md` — carregar apenas se o usuário confirmar que não vai usar Remotion.

---

## 7. Checklist final antes de entregar

- [ ] Hook dos primeiros 3s tem ≤6 palavras e gancho real (não vazio)?
- [ ] No máximo 2 fontes usadas?
- [ ] Timing sincronizado com a fala (não estimado)?
- [ ] Highlight aplicado só na palavra-chave, não na frase toda?
- [ ] Nenhum efeito "viral genérico" incompatível com identidade institucional (glitch, meme, emoji piscando)?
- [ ] Texto respeita zona segura 9:16?
- [ ] CTA final legível e estático por 1-2s?

Se qualquer item falhar, ajustar antes de considerar pronto.
