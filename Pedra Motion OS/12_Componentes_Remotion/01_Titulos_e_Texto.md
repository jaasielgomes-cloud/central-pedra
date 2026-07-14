---
titulo: Componentes — Títulos e Texto
tipo: codigo
tags: [pedra-motion-os, componente, codigo]
---

# Componentes — Títulos e Texto

> Componentes de tipografia animada. Todos usam [[09_Biblioteca_Visual/01_Design_Tokens|tokens]] e [[03_Motion_Design/02_Easing_e_Springs|SPRING/EASE]].

---

## `KineticTitle`
- **Objetivo:** título de impacto que entra palavra a palavra com destaque na palavra-chave.
- **Quando usar:** hooks, aberturas, manchetes, reveals.
- **Quando NÃO usar:** blocos longos de texto (use `LowerThird`/legenda).
- **Animação:** stagger por palavra (spring `settle`), palavra-chave com pop + cor `signal`.
- **Performance:** anima `transform`/`opacity`; ok para dezenas de palavras.

```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, TYPO, SPACE } from '../theme/tokens';
import { SPRING } from '../theme/motion';

type Props = { text: string; highlight?: string; delay?: number; size?: keyof typeof TYPO.size };

export const KineticTitle: React.FC<Props> = ({ text, highlight, delay = 0, size = 'h1' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap: SPACE.sm, fontFamily: TYPO.family.display,
                  fontSize: TYPO.size[size], fontWeight: TYPO.weight.black, letterSpacing: TYPO.tracking.tight,
                  color: COLORS.limestone, lineHeight: TYPO.lineHeight.tight }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * 4, fps, config: SPRING.settle });
        const y = interpolate(p, [0, 1], [30, 0]);
        const isKey = highlight && w.toLowerCase().includes(highlight.toLowerCase());
        return (
          <span key={i} style={{ display:'inline-block', transform:`translateY(${y}px)`, opacity: p,
                                 color: isKey ? COLORS.signal : undefined }}>{w}</span>
        );
      })}
    </div>
  );
};
```
- **Boas práticas:** ≤ 6 palavras; uma palavra-chave por título; combine com bass hit no frame `delay`.

---

## `LowerThird` (legenda/rótulo inferior)
- **Objetivo:** rótulo contextual (nome, cargo, fase da obra, local).
- **Quando usar:** identificar depoente, marcar fase de timelapse, dar contexto.
- **Quando NÃO usar:** como título principal.
- **Animação:** barra desliza + texto em fade/stagger.

```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, TYPO, SPACE, RADIUS } from '../theme/tokens';
import { SPRING } from '../theme/motion';

export const LowerThird: React.FC<{title: string; subtitle?: string; delay?: number}> = ({title, subtitle, delay=0}) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.reveal });
  const x = interpolate(p, [0,1], [-40, 0]);
  return (
    <div style={{ position:'absolute', left: SPACE.safe, bottom: SPACE.safe, transform:`translateX(${x}px)`, opacity:p }}>
      <div style={{ display:'inline-flex', flexDirection:'column', gap: SPACE.xs,
                    borderLeft:`4px solid ${COLORS.signal}`, paddingLeft: SPACE.sm }}>
        <span style={{ fontFamily:TYPO.family.display, fontWeight:TYPO.weight.bold, fontSize:TYPO.size.h3, color:COLORS.white }}>{title}</span>
        {subtitle && <span style={{ fontFamily:TYPO.family.body, fontSize:TYPO.size.caption, color:COLORS.concrete }}>{subtitle}</span>}
      </div>
    </div>
  );
};
```
- **Boas práticas:** posição fixa e consistente; dentro da margem segura.

---

## `QuoteCard` / `FullQuote`
- **Objetivo:** depoimento ou frase-manifesto em destaque.
- **Quando usar:** prova social, beat emocional, institucional.
- **Quando NÃO usar:** dados numéricos (use infográficos).
- **Animação:** aspas entram primeiro; texto em linhas com stagger.
- **Boas práticas:** atribuição discreta; fundo de contraste; ritmo lento para leitura.

## `Kicker`
- **Objetivo:** micro-label em caixa alta acima do título (ex.: "ENGENHARIA PEDRA").
- **Animação:** fade + tracking animado (de wide para normal).
- **Boas práticas:** sempre em `TYPO.tracking.wide`, cor `concrete` ou `signal`.

Ver: [[12_Componentes_Remotion/02_Layout_e_Cenas]] · [[09_Biblioteca_Visual/02_Tipografia]]
