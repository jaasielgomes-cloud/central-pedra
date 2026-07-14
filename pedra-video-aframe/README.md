# 🎬 Casa em A — Grupo Pedra (Remotion)

Vídeo cinematográfico em **Remotion** gerado com o [**PEDRA MOTION OS**](../Pedra%20Motion%20OS/00_INDEX.md), a partir da filmagem bruta da obra da **Casa em A** (estrutura A-frame na mata).

Aplica o blueprint [Case de Obra](../Pedra%20Motion%20OS/11_Blueprints/01_Blueprint_Case_de_Obra.md): hook → desafio → sistema construtivo → dados → luz/detalhe → grandiosidade + logo.

## O que o sistema aplicou
- **Cores reais da marca** amostradas da logo oficial (vermelho `#F0291B`, preto).
- **Títulos cinéticos** com destaque na palavra-chave (Archivo Black embutida).
- **Grade de cor** cinematográfica (vinheta + teal/orange) + grão de filme.
- **Movimento de câmera** (Ken Burns) em cada plano.
- **Transições** da mesma família (fade / slide) sincronizadas com **whoosh/boom**.
- **Sound design** 100% gerado: trilha ambiente + riser + impactos + clicks.
- **Zonas seguras** de Reels/TikTok respeitadas; **marca d'água** consistente.

## Rodar

```bash
npm install
# Studio (preview interativo)
npm run dev
# Render (aponte o Chromium se necessário)
npx remotion render AFrameCase out/aframe-9x16.mp4 --codec=h264 --crf=18
```

> No ambiente headless deste projeto, o render usou:
> `--browser-executable=/opt/pw-browsers/chromium_headless_shell-.../headless_shell`

## Estrutura
```
public/
  media/aframe.mp4          # filmagem-fonte
  media/logo_pedra*.png     # logo oficial (recortada) + variante clara
  audio/*.wav               # SFX + trilha ambiente (gerados)
  fonts/*.ttf               # Archivo, Inter, Space Grotesk (embutidas)
src/
  theme/{tokens,motion,fonts}.ts
  components/{text,layout,data,util}/...
  compositions/AFrameCase.tsx
  data/aframe.ts            # ROTEIRO/DADOS (edite aqui)
```

## ⚠️ Antes de publicar
Os valores em `src/data/aframe.ts` → `stats` (ex.: `45°`, `100%`) são **placeholders de demonstração**. Substitua pelos dados reais confirmados da obra. Todo o texto do vídeo vive nesse mesmo arquivo — é o único lugar a editar para trocar o roteiro.
