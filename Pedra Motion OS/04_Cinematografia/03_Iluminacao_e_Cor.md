---
titulo: Iluminação e Cor
tipo: conceito
tags: [pedra-motion-os, cinematografia, biblioteca-visual, conceito]
---

# Iluminação e Cor

> **Objetivo:** usar luz e cor como linguagem emocional e unificar visualmente materiais de fontes diferentes.

## Psicologia das cores (aplicada ao Grupo Pedra)
| Cor | Sensação | Uso |
|---|---|---|
| Grafite/preto | solidez, luxo, seriedade | base cinematográfica |
| Branco/off-white | limpeza, precisão, respiro | fundos claros, dados |
| Laranja/âmbar (`signal`) | energia, calor humano, destaque | acento, CTA, dado-chave |
| Azul-aço (`steel`) | confiança, tecnologia, frieza | infográficos, dados |
| Verde | progresso, positivo | indicadores de crescimento |
| Vermelho | urgência, alerta | usar com parcimônia (queda, risco) |

## Temperatura de cor e narrativa
- **Quente (golden hour):** humano, conquista, orgulho, payoff.
- **Frio (azulado):** técnico, planejamento, desafio, noite/tensão.
- **Contraste teal-orange:** o look cinematográfico clássico — pele quente, sombras frias.

## Color grading (grade)
Aplique **um look único** ao vídeo inteiro para unificar drone + render + foto:
- Contraste em S-curve (pretos densos, brancos controlados).
- Saturação global baixa, **exceto** o acento.
- Sombras levemente frias, luzes levemente quentes.

```tsx
// Overlay de grade simples por cima de uma sequência
export const GradeOverlay: React.FC = () => (
  <>
    <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.35) 100%)' }} /> {/* vinheta */}
    <div style={{ position:'absolute', inset:0, background:'rgba(20,30,40,0.06)', mixBlendMode:'multiply' }} /> {/* sombra fria */}
    <div style={{ position:'absolute', inset:0, background:'rgba(255,180,120,0.05)', mixBlendMode:'screen' }} /> {/* luz quente */}
  </>
);
```

## Iluminação (para material captado / renders)
- **Contraluz (rim light):** separa o sujeito do fundo, dá premium.
- **Luz difusa:** institucional limpo (Apple/Volvo).
- **Chiaroscuro (claro-escuro):** drama, tensão, lançamento.
- **Golden hour:** obras e aéreas ganham emoção e escala.

Ver: [[09_Biblioteca_Visual/03_Paleta_e_Cor]] · [[01_Direcao_Criativa/03_Direcao_de_Arte]]
