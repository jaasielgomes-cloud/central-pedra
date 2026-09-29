---
titulo: Exemplo Completo — Case de Obra
tipo: exemplo
tags: [pedra-motion-os, exemplo, engenharia, codigo]
---

# Exemplo Completo — Case de Obra

> **Objetivo:** um percurso ponta a ponta usando o [[19_Workflows/00_Workflow_Mestre|Workflow Mestre]] com dados fictícios (Residencial Horizonte). Serve de gabarito.

## 1. Brief (7 inputs)
```yaml
tema:       Entrega do Residencial Horizonte (torre de 32 andares em terreno complexo)
objetivo:   informar + emocionar (mostrar competência de engenharia)
publico:    investidores e futuros compradores
arquivos:   drone (aéreas), timelapse da obra, renders, fotos de detalhe, dados (unidades, prazo, m²)
duracao:    75s
tom:        épico / técnico
plataforma: instagram (Reels) + youtube (16:9)
```

## 2. Estratégia
- **Grande ideia:** _"Em terreno onde diziam ser impossível, 32 andares em 20 meses."_
- **Estrutura:** Case de Sucesso + Documentário. **Blueprint:** [[11_Blueprints/01_Blueprint_Case_de_Obra]].
- **Hook:** aérea + texto _"Diziam que era impossível."_ (open loop).
- **Loop pago em:** beat de execução/resultado.

## 3. Look
- Modo escuro (`graphite`), acento `signal` no dado-chave. Grade de cor teal-orange sutil. Câmera: push-in/pull-out lento.

## 4. Storyboard (preenchido)
| # | Tempo | Cena | Mídia | Componente | Transição | Som |
|---|---|---|---|---|---|---|
| 1 | 0–4s | Hook aéreo + "Diziam que era impossível." | drone | `KenBurns`+`KineticTitle` | — | riser+bass hit |
| 2 | 4–14s | O desafio: terreno em declive | foto+CAD | `LowerThird` | fade | tensão |
| 3 | 14–26s | Solução: fundação especial (corte técnico) | CAD | `RevealLayers` | mask | tech+swell |
| 4 | 26–45s | Execução: timelapse com rótulos de mês | timelapse | `TimelapseLabel` | whip | construção FX |
| 5 | 45–60s | Resultado: 480 unidades · 20 meses · 42.000 m² | dados | `StatCard`×3 | slide | impact/dado |
| 6 | 60–70s | Humano: morador recebendo a chave | foto | `QuoteCard` | blur | música quente |
| 7 | 70–75s | Aérea final + logo + "Grupo Pedra. Construindo o impossível." | drone | `EndCard` | fade | impact final |

## 5. Prompt de Produção (trecho)
> Gerado via [[14_Prompts/02_Template_de_Prompt]]. Big idea, storyboard acima, tokens do sistema, specs 1080×1920@30 (2250 frames) + versão 1920×1080.

## 6. Código (recorte da composição)
```tsx
// src/data/horizonte.ts
export const horizonte = {
  empreendimento: 'Residencial Horizonte',
  desafio: 'Terreno em declive de 18°',
  kpis: [
    { value: 480, label: 'unidades entregues' },
    { value: 20,  label: 'meses de obra', suffix: '' },
    { value: 42000, label: 'm² construídos', suffix: ' m²' },
  ],
  cta: 'Grupo Pedra · Construindo o impossível',
  media: { hero: 'media/aerea01.jpg', timelapse: 'media/timelapse.mp4', final: 'media/aerea-final.jpg' },
};
```
A composição usa o [[13_Templates/02_Template_Composicao|template `CaseObra`]] com esses dados.

## 7. Auditoria (resultado esperado)
| Critério | Nota |
|---|---|
| Hook | 9 |
| Retenção | 8.5 |
| Storytelling | 9 |
| Branding | 9 |
| Motion | 8 |
| Cinematografia | 9 |
| Áudio | 8 |
| Clareza | 9 |
| Emoção | 9 |
| Conversão | 8 |
| **Final** | **8.7 → APROVADO** |

Melhoria sugerida: reforçar pattern interrupt entre beats 4 e 5 (variar ritmo do timelapse).

Ver: [[19_Workflows/00_Workflow_Mestre]] · [[11_Blueprints/01_Blueprint_Case_de_Obra]]
