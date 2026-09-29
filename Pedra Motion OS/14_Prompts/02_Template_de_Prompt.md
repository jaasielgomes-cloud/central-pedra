---
titulo: Template de Prompt de Produção
tipo: receita
tags: [pedra-motion-os, prompt, template, receita]
---

# Template de Prompt de Produção

> **Objetivo:** o artefato que o [[14_Prompts/01_Prompt_Engine|Prompt Engine]] gera. Copie, preencha os `{ }` e entregue ao Claude Code para produzir o vídeo em Remotion.

```md
# BRIEFING DE PRODUÇÃO — PEDRA MOTION OS

## 1. Identidade do projeto
- Projeto: {nome}
- Objetivo: {objetivo}
- Público-alvo: {publico}
- Plataforma: {plataforma}  → specs: {dimensao}, {fps}, {duracao_frames} frames
- Tom: {tom}
- Referência estética: {estudio_referencia}

## 2. Estratégia narrativa
- Estrutura: {estrutura}  (ver 02_Storytelling)
- Blueprint base: {blueprint}
- Grande ideia (1 frase): {big_idea}
- Hook (0–3s): {descricao_hook}
- Loop(s) aberto(s): {loops}  → pagos em: {onde_paga}
- Payoff / clímax: {payoff}
- CTA: {cta}

## 3. Look & feel
- Modo: {escuro|claro}
- Paleta: base {base}, acento signal em {onde}
- Tipografia: display {display}, mono para dados
- Grade de cor: {look}  (aplicar GradeOverlay em tudo)
- Movimento de câmera padrão: {push-in|parallax|...}

## 4. Storyboard (beats)
| # | Tempo | Cena | Mídia | Componente | Transição | Som |
|---|-------|------|-------|------------|-----------|-----|
| 1 | {t}   | {cena} | {arquivo} | {componente} | {transicao} | {sfx/musica} |
| … |       |        |       |            |           |     |

## 5. Áudio
- Trilha: {estilo}, BPM {bpm} (beatmatch cortes)
- SFX por beat: {lista}
- Ducking na narração: sim
- Legendas: sim (85% assiste sem som)

## 6. Mídias disponíveis
{lista de arquivos e a que beat cada um serve}

## 7. Requisitos técnicos
- Usar tokens de src/theme (nada hardcoded)
- Usar componentes da biblioteca 12_Componentes_Remotion
- Respeitar zonas seguras da plataforma (15_Exportacao)
- Separar dados (src/data) do layout

## 8. Definição de pronto
- [ ] Passa no checklist 16_Checklists
- [ ] Nota de auditoria ≥ 8.0 em 17_Auditoria
- [ ] Exporta conforme specs da plataforma

> INSTRUÇÃO AO CLAUDE: gere o projeto Remotion completo (Root.tsx, composição, cenas e quaisquer componentes novos), pronto para `npx remotion render`. Comente cada cena referenciando o beat correspondente.
```

Ver: [[14_Prompts/03_Prompt_de_Auditoria]] · [[13_Templates/02_Template_Composicao]]
