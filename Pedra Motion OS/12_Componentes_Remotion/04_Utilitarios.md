---
titulo: Componentes — Utilitários
tipo: codigo
tags: [pedra-motion-os, componente, codigo]
---

# Componentes — Utilitários

> Peças de apoio: movimento de câmera em stills, comparações, overlays, orquestração.

---

## `KenBurns`
Ver implementação completa em [[04_Cinematografia/02_Movimento_de_Camera]]. Dá vida a fotos/renders com push-in lento. **Sempre** aplicado a imagens estáticas.

---

## `Stagger` / `EnterUp`
- **Objetivo:** orquestrar entradas em cascata.
- **Quando usar:** listas, grids, qualquer conjunto de elementos.

```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SPRING } from '../theme/motion';

export const EnterUp: React.FC<{delay?:number; distance?:number; children:React.ReactNode}> =
({ delay=0, distance=40, children }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.settle });
  const y = interpolate(p, [0,1], [distance, 0]);
  return <div style={{ transform:`translateY(${y}px)`, opacity: p }}>{children}</div>;
};

// Uso em lista:
export const StaggerList: React.FC<{items:React.ReactNode[]; step?:number}> = ({items, step=4}) => (
  <>{items.map((it, i) => <EnterUp key={i} delay={i*step}>{it}</EnterUp>)}</>
);
```

---

## `BeforeAfterSlider`
- **Objetivo:** revelar transformação antes→depois no mesmo enquadramento.
- **Quando usar:** [[11_Blueprints/04_Blueprint_Before_After|Before/After]].
- **Animação:** clip-path/máscara varre a tela; sincronize com whoosh + beat.

```tsx
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
export const BeforeAfterSlider: React.FC<{before:string; after:string; start?:number; dur?:number}> =
({ before, after, start=0, dur=30 }) => {
  const f = useCurrentFrame();
  const pct = interpolate(f, [start, start+dur], [0, 100], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
  return (
    <AbsoluteFill>
      <Img src={before} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      <AbsoluteFill style={{ clipPath:`inset(0 0 0 ${pct}%)` }}>
        <Img src={after} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </AbsoluteFill>
      <div style={{ position:'absolute', top:0, bottom:0, left:`${pct}%`, width:3, background:'#fff' }} />
    </AbsoluteFill>
  );
};
```
- **Boas práticas:** mesmo ângulo/enquadramento nas duas imagens.

---

## `GradeOverlay`
Ver [[04_Cinematografia/03_Iluminacao_e_Cor]]. Vinheta + sombra fria + luz quente para unificar a grade de cor.

---

## `EndCard`
- **Objetivo:** cartão final com logo, CTA e assinatura.
- **Quando usar:** encerramento de todo vídeo.
- **Animação:** logo assenta (spring), CTA entra depois, opcional loop de volta ao início.
- **Boas práticas:** CTA claro e único; posição de logo consistente; deixe 1–2s de leitura.

---

## `CaptionTrack` (legendas)
- **Objetivo:** legendas sincronizadas (85% assiste sem som).
- **Boas práticas:** palavra-chave destacada; fundo de contraste; dentro da safe area; ver [[15_Exportacao/02_Zonas_Seguras]].

Ver: [[12_Componentes_Remotion/00_Index]] · [[13_Templates/01_Estrutura_de_Projeto]]
