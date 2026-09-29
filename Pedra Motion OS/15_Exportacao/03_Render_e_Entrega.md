---
titulo: Render e Entrega (Remotion)
tipo: codigo
tags: [pedra-motion-os, exportacao, codigo]
---

# Render e Entrega (Remotion)

> **Objetivo:** comandos e boas práticas para renderizar e exportar com qualidade máxima.

## Render básico
```bash
# render de uma composição
npx remotion render CaseObra out/case-obra-9x16.mp4

# com codec e qualidade
npx remotion render CaseObra out/case-obra.mp4 \
  --codec=h264 --crf=18 --image-format=jpeg --concurrency=8
```

## Multi-formato
```bash
npx remotion render CaseObra_9x16 out/reels.mp4
npx remotion render CaseObra_1x1  out/feed.mp4
npx remotion render CaseObra_16x9 out/youtube.mp4
```

## Parâmetros-chave
| Flag | Uso |
|---|---|
| `--crf` | qualidade (18 ótimo, menor = melhor/maior) |
| `--codec` | `h264` (compat.) / `h265` (eficiência) |
| `--concurrency` | paralelismo (mais rápido; limite pela RAM) |
| `--scale` | supersampling (2x para nitidez extra) |
| `--muted` | render sem áudio (para versões alternativas) |

## Áudio na entrega
- Confirme a mix (-14 LUFS, pico ≤ -1 dBTP). Ver [[07_Sound_Design/03_Mixagem_e_Camadas]].
- Se a trilha for adicionada na plataforma (música do app), exporte também uma versão sem música mas com SFX/VO.

## Pré-entrega
1. Rode o [[16_Checklists/05_Checklist_Exportacao|checklist de exportação]].
2. Revise nas [[15_Exportacao/02_Zonas_Seguras|zonas seguras]] no app real.
3. Gere a **capa** (frame de scroll-stop).
4. Arquive o projeto (`src/` + `public/`) versionado.

## Performance de render
- Prefira imagens a muitos vídeos simultâneos.
- `--image-format=jpeg` acelera; `png` só se precisar de alpha.
- Cache de assets em `public/`; evite fetch remoto durante render.

Ver: [[13_Templates/01_Estrutura_de_Projeto]] · [[16_Checklists/05_Checklist_Exportacao]]
