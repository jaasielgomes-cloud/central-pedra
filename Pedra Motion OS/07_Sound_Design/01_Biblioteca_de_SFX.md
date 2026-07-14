---
titulo: Biblioteca de SFX
tipo: receita
tags: [pedra-motion-os, sound-design, receita]
---

# Biblioteca de SFX

> **Objetivo:** catálogo de efeitos sonoros com **quando usar cada um**. O SFX certo no frame certo é o que transforma motion em cinema.

## Catálogo
| SFX | Descrição | Quando usar | Quando NÃO usar |
|---|---|---|---|
| **Bass Hit** | grave curto e seco | entrada de título/dado-chave, batida de impacto, corte forte | em cada corte (satura) |
| **Impact / Boom** | impacto cinematográfico grande | reveal, logo final, clímax | momentos calmos/humanos |
| **Whoosh** | passagem de ar | transições (whip, slide), movimento de câmera rápido | telas estáticas |
| **Riser / Swell** | crescendo de tensão | build-up antes de um reveal | depois do clímax |
| **Downer / Reverse** | descida/sucção | antes de um corte para preto, "puxar" atenção | uso repetido |
| **Click / Tick** | clique curto | UI, contadores, itens de lista aparecendo | narração emocional |
| **Sub Drop** | queda de grave profundo | fim de build-up, "peso" do impacto | conteúdo leve |
| **Glitch / Digital** | ruído digital | transição tech, dado/tecnologia | institucional sóbrio |
| **Construction FX** | marreta, concreto, serra, guindaste | vídeos de obra, realismo, texturizar timelapse | depoimento íntimo |
| **Drone FX** | zumbido de drone, decolagem | abertura aérea, transição para plano aéreo | interiores |
| **Industrial FX** | metal, maquinário, hidráulica | engenharia pesada, força, escala | vídeos delicados |
| **Ambiente (room tone)** | ruído ambiente sutil | preencher silêncios "mortos", realismo | sobre música densa |

## Regras de uso
- **SFX sincroniza com o visual:** o bass hit cai no frame exato da entrada. Ver [[03_Motion_Design/03_Timing_e_Ritmo]].
- **Menos é mais:** pontue os momentos importantes, não todos.
- **Whoosh + corte** = transição percebida como profissional.
- **Silêncio é SFX:** cortar todo o som por 0.5s antes de um impacto amplifica o golpe.

## Em Remotion
Use `<Audio>` com `startFrom`/`volume` e sincronize pelo frame:
```tsx
import { Audio, useCurrentFrame } from 'remotion';
// bass hit no frame 24
<Sequence from={24}><Audio src={sfxBassHit} volume={0.8} /></Sequence>
```

Ver: [[07_Sound_Design/03_Mixagem_e_Camadas]] · [[16_Checklists/04_Checklist_Audio]]
