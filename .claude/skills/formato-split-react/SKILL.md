---
name: formato-split-react
description: Formato viral de tela dividida, com um vídeo em cima e a pessoa reagindo ou comentando embaixo. Use para "react", "tela dividida", "vídeo cortado no meio", "eu reagindo a um vídeo", "comentando vídeo".
---

# Split react

Pipeline: `../viral-video-studio/references/pipeline.md`. Regras: `../viral-video-studio/references/regras.md` (direitos do vídeo reagido).

## Estrutura

| Tempo | Topo (55%) | Base (45%) |
|---|---|---|
| 0–2s | Momento mais chocante do vídeo original | Reação forte e silenciosa (expressão) ou uma frase-gancho |
| 2–8s | Contexto do vídeo | "Olha o que ele fez aqui..." |
| 8–30s | Trechos curtos, pausados nos pontos-chave | Comentário com opinião/autoridade. **É aqui que se gera valor** |
| final | Congelar o quadro | Conclusão + CTA |

## Regras do formato

- A reação precisa **acrescentar** (opinião, correção, ensino). Só rir não viraliza e corre risco de direitos autorais.
- Use trechos de no máximo 3–5s do original por vez, intercalados com comentário.
- Olhe para cima (para o vídeo) ao reagir e para a câmera ao comentar.

## Produção

1. Usuário grava a reação vendo o vídeo (fone de ouvido para não captar o áudio original).
2. Cortar os trechos do original: `ffmpeg -ss INI -to FIM -i original.mp4 -c copy trecho.mp4`.
3. Montar: `../viral-video-studio/scripts/compose.sh split topo.mp4 reacao.mp4 saida.mp4 0.55 mix`.
   - `mix`: original baixo + voz. Use `bottom` se o original não tiver áudio relevante.
4. Legenda só na fala de quem reage, posicionada na faixa entre as duas metades.

Sem gravação: a reação pode ser feita com `avatar-foto-falante`. Rende menos, porque a expressão espontânea é o que vende o formato.
