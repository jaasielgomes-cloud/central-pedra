# 🎬 Pedra Studio

Estúdio de vídeo do Grupo Pedra. Do bruto ao Reels pronto com **um comando**,
**100% local, gratuito e sem limite de uso**.

| Etapa | Ferramenta | Custo |
|---|---|---|
| Corte de silêncios (jump cuts) | auto-editor | grátis, local |
| Narração IA natural PT-BR + vozes clonadas | Chatterbox Multilingual (MIT) | grátis, local, ilimitado |
| Legenda palavra-a-palavra | faster-whisper (MIT) | grátis, local |
| Edição com efeitos + render | Remotion | grátis até 3 pessoas* |

\* Remotion exige licença de empresa acima de 3 funcionários (remotion.pro/license).

## Instalar (uma vez, Windows)

1. Instale **Python 3.11** (python.org, marque "Add to PATH") e **Node.js LTS** (nodejs.org).
2. Clone o repositório, abra o PowerShell na pasta `pedra-studio` e rode:
   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass; .\instalar.ps1
   ```
   Com placa NVIDIA, a narração e a legenda saem em segundos. Sem ela funciona, só que mais devagar.

## Usar

Com Claude Code nesta pasta, digite **`/reels`** e mande o vídeo ou a ideia. O diretor faz o resto.

Manual:
```powershell
# Você gravou falando
.\.venv\Scripts\python pipeline\reel.py fala bruto.mp4 --nome obra-x --gancho "Casa sem derrubar UMA árvore" --destaque árvore --chaves árvore,90

# Narração de IA sobre imagens da obra (voz de vozes\locutor.wav)
.\.venv\Scripts\python pipeline\reel.py narracao roteiro.txt --fundo obra.mp4 --voz locutor --nome obra-x
```
Resultado: `out\obra-x.mp4`. Para ajustar B-rolls: rode com `--so-json`, edite `projetos\obra-x.json`
e depois `pipeline\reel.py render projetos\obra-x.json`.

Preview interativo: `npm run dev`.

## O que cada Reel recebe automaticamente (`ReelRetencao`)

- **Gancho** cinético nos 2 primeiros segundos + flash e boom de abertura
- **Punch zoom** a cada frase (esconde os cortes e reseta a atenção) + deriva lenta
- **Legenda** estilo karaokê: bloco curto, palavra falada em amarelo, palavras-chave em vermelho
- **Tremida + impacto sonoro** nas palavras-chave
- **B-roll** tela cheia ou janela (PIP), com whoosh
- **Barra de progresso**, color grade de cinema, grão de filme, marca d'água
- **Riser + cartão final** com logo e CTA

## Estrutura
```
pipeline/reel.py            # orquestrador (corte → voz → legenda → JSON → render)
vozes/                      # seu banco de vozes (.wav de 8–15 s, com autorização)
src/compositions/ReelRetencao.tsx   # modelo de Reels de retenção
src/compositions/AFrameCase.tsx     # case cinematográfico "Casa em A"
src/reel/                   # legenda, punch zoom, B-roll, barra de progresso
src/components/             # títulos, cartões, grade, grão, logo…
public/audio  public/fonts  public/media
../Pedra Motion OS/         # manual de direção: retenção, ganchos, som, checklists
```

## ⚠️ Antes de publicar o case "Casa em A"
Os valores em `src/data/aframe.ts` → `stats` são **placeholders**. Substitua pelos dados reais da obra.
