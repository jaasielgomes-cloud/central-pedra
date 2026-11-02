---
name: formato-pov-conversa
description: Formato POV em que a pessoa fala com a câmera como se o espectador fosse o outro lado da conversa (cliente perguntando, amigo pedindo conselho), com a fala do outro em texto na tela. Use para "POV", "como se estivesse conversando com alguém", "falando com o cliente", "respondendo pergunta".
---

# POV conversa

Pipeline: `../viral-video-studio/references/pipeline.md`.

## Mecânica

O espectador **é** o outro personagem. As falas dele aparecem só como texto na tela (ou em voz off curta); a pessoa responde olhando para a lente.

## Estrutura

- 0–2s: texto "POV: você chegou na loja e perguntou X" + reação da pessoa.
- Turnos: texto do espectador (1–1,5s na tela) → resposta curta da pessoa.
- Virada: o espectador muda de ideia, ou a pessoa revela algo inesperado.
- CTA dentro do personagem ("então vem cá que eu te mostro... link na bio").

## Regras

- O olhar sempre na lente. É isso que dá a sensação de conversa.
- Câmera na altura dos olhos e a ~1m. Pequenos movimentos de mão (handheld leve) aumentam o realismo.
- Perguntas do espectador = as objeções reais do cliente (preço, prazo, confiança).

## Produção

Gravada: gravar as respostas em sequência, deixando 1s de pausa antes de cada uma para o texto. Inserir as perguntas como texto (.ass ou app Captions) nas pausas.
IA: `avatar-foto-falante` com uma foto olhando para a lente, um bloco `intone` por resposta, cartões de pergunta via `compose.sh still` (imagem com o texto) ou sobrepostos na legenda.
