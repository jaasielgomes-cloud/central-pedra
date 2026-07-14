---
titulo: Specs por Plataforma
tipo: receita
tags: [pedra-motion-os, exportacao, instagram, tiktok, youtube-shorts, receita]
---

# Specs por Plataforma

> **Objetivo:** referência única de dimensão, duração e formato por plataforma. Sempre confirmar limites atuais na plataforma (mudam com o tempo).

| Plataforma | Formato | Dimensão | fps | Duração ideal | Máx |
|---|---|---|---|---|---|
| **Instagram Reels** | 9:16 | 1080×1920 | 30 | 7–30s (sweet spot) | 90s |
| **Instagram Feed** | 4:5 ou 1:1 | 1080×1350 / 1080×1080 | 30 | 15–30s | 60s |
| **Instagram Stories** | 9:16 | 1080×1920 | 30 | ≤15s por card | 60s |
| **TikTok** | 9:16 | 1080×1920 | 30–60 | 15–34s | 10min |
| **YouTube Shorts** | 9:16 | 1080×1920 | 30–60 | 15–60s | 60s |
| **YouTube (horizontal)** | 16:9 | 1920×1080 | 30–60 | 1–3min+ | — |
| **LinkedIn** | 1:1 ou 9:16 | 1080×1080 / 1080×1920 | 30 | 30–90s | 10min |

## Codec / arquivo
- **Container:** MP4 (H.264) para máxima compatibilidade; H.265 se plataforma aceitar (melhor qualidade/tamanho).
- **Bitrate:** alto o suficiente para não "quebrar" em movimento (ex.: 10–16 Mbps para 1080p vertical).
- **Áudio:** AAC, -14 LUFS, true peak ≤ -1 dBTP. Ver [[07_Sound_Design/03_Mixagem_e_Camadas]].
- **Cor:** Rec.709.

## Estratégia multi-formato
Produza o master em 9:16 e derive 1:1 e 16:9 **recompondo** (não apenas cortando). Ver [[09_Biblioteca_Visual/04_Grid_e_Layout]] e [[13_Templates/01_Estrutura_de_Projeto]] (múltiplas composições reaproveitando componentes).

## Boas práticas por algoritmo
- **Reels/TikTok/Shorts:** hook em 3s, retenção alta, loop, legendas, som em alta. Ver [[06_Retencao/00_Index]].
- **Feed/LinkedIn:** funciona mudo com legenda; primeiro frame forte (é a "capa").
- **Capa/thumbnail:** escolha um frame que pare o scroll; texto legível.

Ver: [[15_Exportacao/02_Zonas_Seguras]] · [[16_Checklists/06_Checklist_Plataformas]]
