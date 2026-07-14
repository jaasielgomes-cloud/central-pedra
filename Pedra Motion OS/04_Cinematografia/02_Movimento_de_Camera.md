---
titulo: Movimento de Câmera
tipo: conceito
tags: [pedra-motion-os, cinematografia, motion, conceito]
---

# Movimento de Câmera

> **Objetivo:** cada movimento de câmera carrega emoção. Escolha o movimento pela intenção, não por default. Em Remotion, "câmera" = transform (scale/translate) das camadas, muitas vezes com parallax.

## Vocabulário e emoção
| Movimento | Como faz | Emoção / uso |
|---|---|---|
| **Push-in (dolly in)** | scale 1.0→1.08 lento | intimidade, importância, "preste atenção" |
| **Pull-out (dolly out)** | scale 1.1→1.0 | revelação de contexto/escala, conclusão |
| **Pan / tilt** | translate X/Y | apresentar espaço, seguir linha |
| **Whip pan** | translate rápido + blur | transição energética ([[08_Transicoes/01_Biblioteca_de_Transicoes|Whip]]) |
| **Parallax drift** | camadas em velocidades diferentes | profundidade, "vida" em still |
| **Crane / aérea** | movimento vertical amplo | grandiosidade (obras, cidade) |
| **Orbit** | rotação ao redor do sujeito | produto, maquete, render 3D |
| **Handheld sutil** | ruído leve na posição | realismo, tensão documental |

## Regras do sistema
- **Sempre em movimento (sutil).** Um still 100% parado parece morto. Aplique push-in ou drift lento em quase todo plano estático (aéreas, renders, fotos).
- **Movimento lento e contínuo** para institucional (identidade Pedra = solidez).
- **Um movimento por plano.** Não combine push-in + pan + rotate ao mesmo tempo (a menos que seja intencional e coreografado).
- **Ease-in-out** em movimentos de câmera (começa e termina suave). Ver [[03_Motion_Design/02_Easing_e_Springs]].

## Ken Burns premium (para fotos/renders)
```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE } from '../theme/motion';

export const KenBurns: React.FC<{src: string; from?: number; to?: number}> = ({src, from = 1.0, to = 1.08}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    easing: EASE.inOut, extrapolateRight: 'clamp',
  });
  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} />
    </div>
  );
};
```

Ver: [[12_Componentes_Remotion/00_Index]] · [[10_Biblioteca_Engenharia/00_Index]]
