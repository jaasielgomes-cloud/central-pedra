---
titulo: Mixagem e Camadas de Áudio
tipo: receita
tags: [pedra-motion-os, sound-design, exportacao, receita]
---

# Mixagem e Camadas de Áudio

> **Objetivo:** equilibrar as camadas para um som limpo, alto e claro — que funcione no celular no volume médio.

## Hierarquia de volume (referência)
| Camada | Nível relativo |
|---|---|
| Voz / narração | mais alta (referência) |
| SFX de impacto | pontualmente alto |
| Música | de fundo, sobe nos instrumentais |
| Ambiência | sutil, quase subliminar |

## Ducking (a técnica essencial)
Quando entra a voz, **abaixe a música** ~6–10 dB automaticamente; ao terminar a fala, ela volta. Sem ducking, a narração some.

Em Remotion, module o `volume` da música por frame conforme os trechos de voz:
```tsx
<Audio src={music} volume={(f) => (isNarrando(f) ? 0.25 : 0.7)} />
```

## Níveis de saída (loudness)
- Alvo: **-14 LUFS** aprox. para redes sociais (padrão de streaming).
- **True peak** ≤ -1 dBTP para não clipar em nenhum device.
- Evite áudio que "estoura" — reduz clareza e cansa.

## Transições de áudio
- **Fade in/out** de 6–12 frames em cortes de música evita "clicks".
- **Crossfade** entre trilhas diferentes.
- **Silêncio intencional** é uma escolha de mix, não um erro.

## Checklist rápido
- [ ] Voz sempre inteligível?
- [ ] Ducking aplicado?
- [ ] SFX sincronizados ao frame?
- [ ] Sem clipping (picos < -1 dBTP)?
- [ ] Testado no autofalante do celular?

Ver: [[15_Exportacao/00_Index]] · [[16_Checklists/04_Checklist_Audio]]
