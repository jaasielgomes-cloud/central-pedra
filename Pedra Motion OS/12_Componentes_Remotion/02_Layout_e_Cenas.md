---
titulo: Componentes — Layout e Cenas
tipo: codigo
tags: [pedra-motion-os, componente, codigo]
---

# Componentes — Layout e Cenas

> Estruturas de composição e mídia de fundo.

---

## `Scene`
- **Objetivo:** wrapper padrão de uma cena (fundo, grade de cor, safe area).
- **Quando usar:** todo bloco/sequência.
- **Animação:** opcional fade-in/out de borda para transições suaves.

```tsx
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme/tokens';
import { GradeOverlay } from './GradeOverlay';

export const Scene: React.FC<{bg?: string; children: React.ReactNode; grade?: boolean}> =
({ bg = COLORS.graphite, children, grade = true }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    {children}
    {grade && <GradeOverlay />}
  </AbsoluteFill>
);
```

---

## `BackgroundMedia`
- **Objetivo:** vídeo/imagem de fundo com movimento e overlay de contraste.
- **Quando usar:** planos com texto por cima (drone, render, obra).
- **Quando NÃO usar:** quando o fundo compete com o texto sem overlay.
- **Animação:** Ken Burns embutido + gradiente de legibilidade.

```tsx
import { AbsoluteFill, Video, Img } from 'remotion';
import { KenBurns } from './KenBurns';

export const BackgroundMedia: React.FC<{src:string; type?:'image'|'video'; scrim?:boolean}> =
({ src, type='image', scrim=true }) => (
  <AbsoluteFill>
    {type === 'image' ? <KenBurns src={src} /> : <Video src={src} style={{width:'100%',height:'100%',objectFit:'cover'}} muted />}
    {scrim && <AbsoluteFill style={{ background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.3) 100%)' }} />}
  </AbsoluteFill>
);
```
- **Boas práticas:** sempre um scrim/gradiente sob texto; `objectFit: cover`; mudo se for `Video` (a trilha vem da mix).

---

## `MontageGrid`
- **Objetivo:** montagem rápida de várias mídias (obras, pessoas) em ritmo.
- **Quando usar:** provas visuais, "o que fazemos", energia.
- **Animação:** itens entram em stagger; opcional troca rítmica sincronizada ao beat.
- **Performance:** limite o nº de vídeos simultâneos (custo de decode); prefira imagens ou 1–2 vídeos por vez.

---

## `HeroReveal`
- **Objetivo:** o "grande reveal" de um empreendimento/produto.
- **Quando usar:** clímax de lançamento (ver [[11_Blueprints/03_Blueprint_Lancamento]]).
- **Animação:** build (escuro/blur) → flash/silêncio → hero shot nítido + nome escalando.
- **Boas práticas:** sincronize com silêncio→sub drop; não revele antes da hora.

---

## `SafeArea`
- **Objetivo:** container que respeita margens e zonas de UI da plataforma.
- **Quando usar:** todo conteúdo textual/CTA.

```tsx
import { AbsoluteFill } from 'remotion';
import { GRID } from '../theme/tokens';
export const SafeArea: React.FC<{children:React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{ padding: GRID.margin, display:'flex' }}>{children}</AbsoluteFill>
);
```
- Ver [[15_Exportacao/02_Zonas_Seguras]].

Ver: [[12_Componentes_Remotion/04_Utilitarios]] · [[13_Templates/01_Estrutura_de_Projeto]]
