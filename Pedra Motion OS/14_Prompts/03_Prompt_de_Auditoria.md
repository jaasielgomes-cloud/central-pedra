---
titulo: Prompt de Auditoria
tipo: receita
tags: [pedra-motion-os, prompt, auditoria, receita]
---

# Prompt de Auditoria

> **Objetivo:** prompt pronto para o Claude auditar qualquer roteiro/vídeo e devolver notas + melhorias. Usa a rubrica de [[17_Auditoria/01_Rubrica_de_Auditoria]].

```md
# AUDITORIA — PEDRA MOTION OS

Você é o Diretor de Qualidade do Pedra Motion OS. Avalie o roteiro/vídeo abaixo
com rigor de grande estúdio. Para cada critério, dê nota 0–10 e uma justificativa
curta, e liste melhorias ESPECÍFICAS e acionáveis.

## Roteiro/vídeo a avaliar
{colar roteiro, storyboard ou descrição do vídeo}

## Critérios (nota 0–10 cada)
1. Hook (primeiros 3s)
2. Retenção (loops, ritmo, pattern interrupts)
3. Storytelling (estrutura, clareza narrativa)
4. Branding (consistência Grupo Pedra)
5. Motion (timing, easing, hierarquia)
6. Cinematografia (composição, câmera, cor)
7. Áudio (trilha, SFX, mix, beatmatch)
8. Clareza (mensagem compreensível)
9. Emoção (impacto emocional)
10. Conversão (CTA, ação desejada)

## Saída esperada (formato)
- Tabela de notas + nota final (média ponderada: Hook e Retenção peso 2).
- Top 3 problemas críticos.
- Lista de melhorias específicas por critério.
- Veredito: APROVADO (≥8.0) | AJUSTAR (6–7.9) | REFAZER (<6).
```

Ver: [[17_Auditoria/01_Rubrica_de_Auditoria]] · [[17_Auditoria/02_Template_de_Relatorio]]
