---
name: safe-zone-video
description: Regra obrigatória de posicionamento (safe zone) para TODA edição de vídeo vertical 9:16 — Reels, Stories, anúncios Meta/Instagram, TikTok, Shorts. Define onde vai a headline, onde vai a legenda e qual é a área proibida. Use sempre que editar, legendar, gerar, revisar ou exportar vídeo, ou ao posicionar texto, logo, CTA ou elementos gráficos em vídeo.
---

# Safe zone — vídeo vertical 9:16 (1080×1920)

Regra fixa. Aplicar em toda edição de vídeo, sem exceção, antes de exportar.

## Mapa (coordenadas em px, base 1080×1920)

```
y=0    ┌──────────────────────────────┐
       │  ÁREA PROIBIDA (perfil, X,    │  topo: 0–250
       │  "Continuar assistindo")      │
y=250  │ ┌──────────────────────────┐ │
       │ │ HEADLINE   y≈260–380     │ │
       │ │                          │ │
       │ │                          │ │
       │ │ LEGENDA    y≈900–1050    │ │  centro vertical
       │ │                          │ │
       │ │                          │ │
       │ └──────────────────────────┘ │
y=1520 │  ÁREA PROIBIDA (CTA "Saiba   │  base: 1520–1920
       │  mais", botões, mensagem)    │
y=1920 └──────────────────────────────┘
        x: 0–100 e 980–1080 proibidos (setas/ícones laterais)
```

| Zona | Posição | Uso |
|---|---|---|
| **Área segura** | x 100–980, y 250–1520 | Tudo que é importante: rosto, texto, logo, produto |
| **Headline** | topo da área segura, y ≈ 260–380, centralizada | Gancho/título curto, 1–2 linhas |
| **Legenda** | centro vertical, y ≈ 900–1050, centralizada | Legenda falada, 1–2 linhas, máx. ~880px de largura |
| **Proibida — topo** | y 0–250 | Nada de texto/logo (nome do perfil, fechar) |
| **Proibida — base** | y 1520–1920 | Nada de texto/CTA próprio (botão "Saiba mais", feedback, campo de mensagem) |
| **Proibida — laterais** | x < 100 e x > 980 | Nada importante (ícones e cortes de tela) |

Proporções para outras resoluções: topo 13%, base 21%, laterais 9%; headline ≈ 14–20% da altura; legenda ≈ 47–55%.

## Regras

1. Nenhum texto, logo, preço ou CTA fora da área segura.
2. Headline sempre no topo da área segura — nunca colada no topo do frame.
3. Legenda sempre no centro vertical — **nunca** no rodapé (é onde fica o botão do anúncio).
4. Rosto do apresentador dentro da área segura; enquadrar para não ficar sob headline/legenda.
5. Legenda com contorno/sombra para leitura sobre qualquer fundo; máx. 2 linhas.
6. Antes de exportar: conferir cada frame com texto contra este mapa. Se algo invadir zona proibida, reposicionar — não reduzir para caber.

## FFmpeg (referência)

```bash
# headline no topo seguro + legenda no centro
-vf "drawtext=text='HEADLINE':x=(w-text_w)/2:y=280:fontsize=64:borderw=4, \
     subtitles=leg.srt:force_style='Alignment=5,MarginV=0,MarginL=100,MarginR=100'"
```
`Alignment=5` = centro da tela (ASS). Para ASS com `PlayResY=1920`, legenda em `\pos(540,975)`.
