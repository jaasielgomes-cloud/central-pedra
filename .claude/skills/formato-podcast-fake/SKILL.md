---
name: formato-podcast-fake
description: Formato "corte de podcast" encenado, com dois microfones, plano e contraplano, legendas grandes e uma frase de impacto, sem precisar de podcast real. Use para "podcast fake", "corte de podcast", "parecer podcast", "estilo podcast", "entrevista em estúdio".
---

# Podcast fake

Pipeline: `../viral-video-studio/references/pipeline.md`. Regras: nunca usar o nome ou o rosto de convidado real que não participou. Os "convidados" são o próprio usuário, a equipe ou personagens.

## Estrutura do corte (30–60s)

- 0–3s: a **frase mais forte** (opinião polêmica ou número), dita pelo "convidado" em close.
- 3–10s: o host faz a pergunta que leva à frase (contraplano).
- 10–50s: o convidado desenvolve; o host interrompe 1–2 vezes ("mas espera...") para manter o ritmo.
- Final: punchline + host reagindo. Título na tela no topo durante todo o vídeo (ex.: "O erro que quebra 90% das lojas").

## Visual

- Cenário escuro, luz lateral quente, microfone de podcast em quadro, fone de ouvido.
- 3 planos: close do convidado, close do host, plano aberto dos dois. Trocar a cada 3–6s.
- Legenda grande, palavra a palavra, com destaque amarelo.

## Produção

Gravada: 1 pessoa faz host e convidado (ver `formato-dois-papeis`) ou 2 pessoas da equipe. Duas câmeras/celulares, ou um celular regravando as falas com o ângulo trocado.

IA:
1. `generate_image` com a foto do usuário: "estúdio de podcast, microfone, fone, luz âmbar, close" (gerar o close do host e o do convidado).
2. Áudios com vozes clonadas (`avatar-foto-falante`).
3. `intone` por fala. Plano aberto com `kling3_0` (sem fala, só os dois ouvindo) para usar como B-roll de transição.
4. `compose.sh concat` alternando planos + `captions` + título fixo (desenhar no .ass ou no app Captions).
