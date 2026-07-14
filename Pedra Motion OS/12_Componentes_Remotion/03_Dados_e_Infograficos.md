---
titulo: Componentes — Dados e Infográficos
tipo: codigo
tags: [pedra-motion-os, componente, engenharia, codigo]
---

# Componentes — Dados e Infográficos

> Motion graphics de dados. Regra: **um dado por tela, animado, com contexto**. Ver [[10_Biblioteca_Engenharia/03_Infograficos_Tecnicos]].

---

## `NumberCounter`
- **Objetivo:** contar um KPI de impacto de 0 (ou base) até o valor final.
- **Quando usar:** unidades entregues, m², prazo, valorização.
- **Quando NÃO usar:** vários números ao mesmo tempo (um por vez).
- **Animação:** valor conta com ease-out; leve pop no fim.
- **Performance:** trivial.

```tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, TYPO } from '../theme/tokens';
import { EASE } from '../theme/motion';

type Props = { to: number; from?: number; dur?: number; prefix?: string; suffix?: string; decimals?: number };

export const NumberCounter: React.FC<Props> = ({ to, from=0, dur=45, prefix='', suffix='', decimals=0 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [0, dur], [from, to], { easing: EASE.out, extrapolateRight: 'clamp' });
  return (
    <span style={{ fontFamily: TYPO.family.mono, fontVariantNumeric:'tabular-nums',
                   fontSize: TYPO.size.hero, fontWeight: TYPO.weight.black, color: COLORS.signal }}>
      {prefix}{v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};
```
- **Boas práticas:** dígitos tabulares (mono) para não "dançar"; sempre um label/contexto ao lado.

---

## `StatCard`
- **Objetivo:** cartão com número + label + micro-descrição.
- **Quando usar:** blocos de resultado (grid de 2–3 KPIs).
- **Animação:** card entra (spring), número conta com delay.

```tsx
import { SPACE, RADIUS, COLORS, TYPO } from '../theme/tokens';
import { NumberCounter } from './NumberCounter';
import { EnterUp } from './Stagger';

export const StatCard: React.FC<{value:number; label:string; suffix?:string; delay?:number}> =
({ value, label, suffix, delay=0 }) => (
  <EnterUp delay={delay}>
    <div style={{ background: COLORS.ink, borderRadius: RADIUS.lg, padding: SPACE.lg, minWidth: 320 }}>
      <NumberCounter to={value} suffix={suffix} />
      <div style={{ marginTop: SPACE.sm, fontFamily: TYPO.family.body, fontSize: TYPO.size.caption, color: COLORS.concrete }}>{label}</div>
    </div>
  </EnterUp>
);
```

---

## `BarChart`
- **Objetivo:** comparar poucos itens (Pedra vs mercado, opção A vs B).
- **Animação:** barras crescem de baixo com stagger; destaque no vencedor (`signal`).
- **Boas práticas:** máx. 4–5 barras; rótulo de valor no topo; eixo honesto.

## `ProgressRing` / `ProgressBar`
- **Objetivo:** % de conclusão de obra.
- **Animação:** arco/preenchimento anima até o %; número acompanha.

## `Timeline`
- **Objetivo:** cronograma/fases da obra.
- **Animação:** linha desenha; marcos entram em stagger; marco atual em `signal`.

## `LineChart`
- **Objetivo:** tendência no tempo (valorização, velocidade de vendas).
- **Animação:** o traçado "desenha" (stroke-dashoffset); ponto-chave pulsa no fim.
- **Boas práticas:** anime `stroke-dashoffset` (barato); destaque só o ponto que importa.

Ver: [[12_Componentes_Remotion/04_Utilitarios]] · [[10_Biblioteca_Engenharia/03_Infograficos_Tecnicos]]
