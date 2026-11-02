---
name: formato-greenscreen
description: Formato viral de green screen, com a pessoa recortada na frente de um print, notícia, post, site, gráfico ou vídeo, comentando. Use para "greenscreen", "comentar notícia", "eu na frente do print", "reagir a post/tweet", "explicar gráfico".
---

# Green screen

Pipeline: `../viral-video-studio/references/pipeline.md`.

## Estrutura

- 0–3s: fundo = manchete/print mais polêmico; fala-gancho apontando para ele.
- 3–25s: troca de fundo a cada ideia (2–5 prints). A pessoa aponta e destaca.
- Final: opinião + CTA ("comenta X que te mando o material").

## Produção

1. **Fundos**: prints em 1080×1920 ou com espaço vazio embaixo. Converter cada print: `compose.sh still print.png 5 fundo1.mp4` (zoom lento automático).
2. **Pessoa**:
   - Gravar na frente de um fundo verde liso (ou parede lisa clara), do peito para cima.
   - Sem fundo verde: remover o fundo do vídeo com Higgsfield `remove_background` (pago) e exportar com fundo verde.
3. Montar: `compose.sh pip fundo1.mp4 pessoa.mp4 parte1.mp4 bottom 0.6 0x00FF00`. Repetir por fundo e juntar com `compose.sh concat`.
4. Destaques no print (círculo, seta, marca-texto) entram antes, editando a imagem.

Variações: pessoa em `bl`/`br` menor (0.4) quando o fundo for um vídeo que precisa de espaço.
