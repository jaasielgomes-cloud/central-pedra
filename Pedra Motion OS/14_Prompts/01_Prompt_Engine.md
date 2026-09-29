---
titulo: Prompt Engine
tipo: receita
tags: [pedra-motion-os, prompt, workflow, receita]
---

# Prompt Engine

> **Objetivo:** o usuário informa apenas 7 dados; o sistema monta automaticamente um prompt de produção completo. Este é o coração operacional do Pedra Motion OS.

## Os 7 inputs
```yaml
tema:        # sobre o que é o vídeo (ex.: "entrega do empreendimento X")
objetivo:    # o que queremos (vender / informar / emocionar / recrutar)
publico:     # para quem (investidor / comprador / comunidade / talento)
arquivos:    # mídias disponíveis (drone, renders, timelapse, fotos, dados)
duracao:     # 15s / 30s / 60s / 90s
tom:         # épico / institucional / técnico / humano / hype
plataforma:  # instagram / tiktok / youtube-shorts / youtube / linkedin
```

## O algoritmo de montagem (o que o Claude faz)
1. **Escolher estrutura** narrativa a partir de `objetivo` + `duracao`. → [[02_Storytelling/01_Estruturas_Narrativas]]
2. **Escolher blueprint** correspondente. → [[11_Blueprints/00_Index]]
3. **Definir look** a partir de `tom`. → [[01_Direcao_Criativa/03_Direcao_de_Arte]] + [[09_Biblioteca_Visual/00_Index]]
4. **Mapear arquivos** aos beats (drone→hook, timelapse→execução…). → [[10_Biblioteca_Engenharia/01_Quando_Usar_Cada_Recurso]]
5. **Selecionar componentes** e transições. → [[12_Componentes_Remotion/00_Index]] + [[08_Transicoes/00_Index]]
6. **Definir hook + loops** a partir de `publico`. → [[06_Retencao/00_Index]]
7. **Definir som** (trilha por tom + SFX por beat). → [[07_Sound_Design/00_Index]]
8. **Aplicar specs** de `plataforma`. → [[15_Exportacao/01_Specs_por_Plataforma]]
9. **Gerar** o prompt de produção usando o [[14_Prompts/02_Template_de_Prompt|template]].
10. **Anexar** checklist e auditoria. → [[16_Checklists/00_Index]] + [[17_Auditoria/00_Index]]

## Mapa de decisão rápido
| Se… | Então estrutura | Blueprint |
|---|---|---|
| objetivo=vender + duracao≤60 | AIDA / Apple Reveal | [[11_Blueprints/03_Blueprint_Lancamento]] |
| objetivo=informar + obra | Case / Documentário | [[11_Blueprints/01_Blueprint_Case_de_Obra]] |
| objetivo=emocionar / marca | Golden Circle / Manifesto | [[11_Blueprints/02_Blueprint_Reel_Institucional]] |
| tema=transformação / obra curta | Before/After | [[11_Blueprints/04_Blueprint_Before_After]] |

## Como acionar (no Claude Code)
> "Rode o Prompt Engine do Pedra Motion OS. Meus inputs: tema=…, objetivo=…, publico=…, arquivos=…, duracao=…, tom=…, plataforma=…"

O Claude responde com o **Prompt de Produção** preenchido ([[14_Prompts/02_Template_de_Prompt]]) e, na sequência, com o código Remotion.

Ver: [[14_Prompts/02_Template_de_Prompt]] · [[19_Workflows/00_Workflow_Mestre]]
