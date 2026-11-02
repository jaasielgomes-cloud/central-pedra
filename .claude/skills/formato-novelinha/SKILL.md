---
name: formato-novelinha
description: Minissérie dramatizada em episódios curtos (novelinha), com personagens fixos, conflito e gancho de "parte 2" para criar audiência recorrente. Use para "novelinha", "série", "drama em partes", "história em episódios", "parte 1 parte 2".
---

# Novelinha

Pipeline: `../viral-video-studio/references/pipeline.md`. Pode usar `formato-dois-papeis` (uma pessoa, vários personagens) ou atores reais.

## Bíblia da série (criar uma vez, salvar em `series/<nome>/biblia.md`)

- Premissa em 1 frase (ex.: "vendedor novato tenta bater a meta numa concessionária caótica").
- 2 a 4 personagens: nome, desejo, defeito, bordão, figurino fixo.
- Cenário fixo (reduz custo e cria reconhecimento).
- Arco de 5–10 episódios com a mensagem da marca embutida, sem virar anúncio.

## Episódio (30–60s)

| Bloco | Função |
|---|---|
| 0–2s | "Parte N" + o momento mais tenso do episódio (flash-forward) |
| 2–5s | Recapitulação em 1 frase (texto na tela) |
| 5–45s | Uma cena, um conflito, uma escalada |
| final | Cliffhanger: corte no pico + "Parte N+1 amanhã". CTA: "segue pra não perder" |

## Regras

- Postar em sequência e fixar a Parte 1 no perfil. Usar a mesma capa/título com numeração.
- Fazer pelo menos 3 episódios antes de publicar o primeiro, para manter a cadência.
- Personagens consistentes: se for IA, guardar os `media_id` das fotos de cada personagem e reutilizá-los.

## Produção

Gravada: igual à de `formato-dois-papeis`, com plano/contraplano e um B-roll do cenário.
IA: fotos dos personagens com `generate_image` (consistentes), falas com `intone`, planos de ambiente com `kling3_0` ou `seedance_2_5`. Avise que cada episódio consome várias gerações e estime o custo por episódio antes.
