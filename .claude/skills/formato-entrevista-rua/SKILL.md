---
name: formato-entrevista-rua
description: Formato de entrevista de rua, com o microfone na mão, uma pergunta rápida e respostas cortadas de várias pessoas ou de um personagem, terminando em punchline ou dado surpreendente. Use para "entrevista de rua", "perguntei para as pessoas", "pergunta na rua", "enquete com microfone".
---

# Entrevista de rua

Pipeline: `../viral-video-studio/references/pipeline.md`. Regras: com pessoas reais, pedir autorização de imagem (termo assinado ou gravado). Encenação com equipe ou atores não pode ser vendida como pesquisa real, nem usada como "prova" de oferta.

## Estrutura (20–45s)

- 0–2s: pergunta na tela + entrevistador com o microfone ("Quanto você acha que custa X?").
- 2–30s: 4–8 respostas de 2–4s cada, da mais errada para a mais certa (ou da mais engraçada para a melhor).
- Final: a resposta certa / o dado real + CTA ("comenta quanto você chutou").

## Visual

- Microfone de lapela grande ou microfone de mão com cubo da marca (branding sem anúncio).
- Câmera na mão, plano médio, cenário de rua/loja reconhecível.
- Legenda grande e a pergunta fixa no topo.

## Produção

Real: gravar 15–20 abordagens, escolher as 6 melhores, cortar respostas secas (`ffmpeg -ss/-to`), `compose.sh concat`, `captions`.
Equipe/atores: roteirizar as respostas, gravar no mesmo local trocando as pessoas.
IA (último recurso): personagens fictícios com `generate_image` + `intone`. Fica evidente que é IA, então rotule e use para humor, não como prova social.
