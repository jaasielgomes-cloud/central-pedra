# Dar ao Claude a capacidade de "ver" vídeos

Modelos de linguagem não recebem vídeo como entrada nativa. A técnica que todas as
ferramentas abaixo usam é a mesma: **quebrar o vídeo em frames + transcrever o áudio +
juntar tudo com timestamps** e entregar ao modelo. Ele não "assiste" continuamente como
uma pessoa — ele analisa uma amostra de imagens somada à transcrição.

Este repositório traz **3 skills auto-contidas** (em `.claude/skills/`) e **1 servidor MCP
opcional** (em `mcp-servers/video-vision/`), cobrindo do mais simples ao mais poderoso.

---

## Qual usar?

| Precisa de… | Use | Onde |
|-------------|-----|------|
| Assistir vídeo por **URL** (YouTube/Vimeo/TikTok) ou arquivo, com transcrição | **`watch`** ✅ recomendada | `.claude/skills/watch/` |
| Só extrair frames rápido para análise visual (leve) | **`video-frames`** | `.claude/skills/video-frames/` |
| Análise estruturada: montagem em grade, cenas, subagentes | **`analyzing-video`** | `.claude/skills/analyzing-video/` |
| Backend multimodal robusto (OpenAI/Gemini/local) via tools MCP | **`video-vision`** (MCP) | `mcp-servers/video-vision/` |
| Rodar um modelo de vídeo **local pesado** (offline) | modelos abaixo | referências externas |

---

## 1. Skill `watch` — recomendada para começar

Pipeline completo em Python: pega legendas primeiro, baixa o vídeo com `yt-dlp` se
necessário, extrai frames com `ffmpeg` (auto-escalados / cientes de cena) e monta uma
transcrição com timestamps (legendas nativas → fallback Whisper API). Aceita **URL ou
caminho local**.

```
/watch <url-ou-caminho> [pergunta]
```

**Depende de:** `python3`, `ffmpeg`, `yt-dlp`. Whisper API precisa de `OPENAI_API_KEY`
(só usado como fallback quando não há legendas).

## 2. Skill `video-frames` — extração leve

Um script Python que transforma o vídeo em frames JPEG otimizados para visão de LLM.
Presets de qualidade (`efficient`/`balanced`/`detailed`/`ocr`), detecção de cena,
dimensões cientes do modelo (Claude/OpenAI/Gemini), modo OCR em tons de cinza + alto
contraste e estimativa de tokens. Visual apenas (sem áudio).

**Depende de:** `ffmpeg`, `ffprobe`.

## 3. Skill `analyzing-video` — análise estruturada

Bash + ffmpeg + Whisper CLI. Extrai frames em taxa adaptativa, cria **grades de montagem**,
detecta cenas e dispara **subagentes paralelos** para análise visual e de áudio, gerando um
markdown com timeline e momentos-chave. Bom para arquivos locais (inclusive downloads de
Instagram/TikTok com thumbnail MJPEG embutida).

**Depende de:** `ffmpeg`, `ffprobe`, `python3`, `bc`; `whisper` CLI para transcrição.

## 4. Servidor MCP `video-vision` — o mais poderoso (opcional)

Servidor MCP em TypeScript (`mcp-servers/video-vision/`) que expõe tools
(`video_info`, `video_analyze`, `video_watch`, `video_detail`, `video_configure`,
`video_setup`) com múltiplos backends (OpenAI, Gemini API ou local). Suporta FPS/resolução
variáveis por segmento e análise estrutural (cenas, silêncio, movimento) antes de extrair
frames.

**Requer build antes de usar:**

```bash
cd mcp-servers/video-vision/mcp-server
npm install
npm run build
```

Depois registre no Claude Code (exemplo em `.mcp.json` do seu projeto ou via
`claude mcp add`):

```jsonc
{
  "mcpServers": {
    "video-vision": {
      "command": "node",
      "args": ["<caminho-absoluto>/mcp-servers/video-vision/mcp-server/dist/index.js"]
    }
  }
}
```

Não foi conectado automaticamente ao plugin porque exige build + chaves de backend; deixe
como opt-in.

---

## Modelos locais pesados (referência — não incluídos)

Para "entendimento de vídeo" mais nativo, rodando o modelo localmente (offline, sem quebrar
em frames manualmente). São repositórios grandes de pesquisa; **não** foram clonados aqui —
use direto do fork oficial quando precisar:

| Modelo | Uso | Repositório |
|--------|-----|-------------|
| Video-LLaVA | Raciocínio multimodal com imagens e vídeos | `PKU-YuanGroup/Video-LLaVA` |
| LLaVA-NeXT-Video | Inferência/avaliação de entendimento de vídeo, amostragem de frames | `LLaVA-VL/LLaVA-NeXT` |
| InternVideo / 2 / 2.5 | Família forte de *video foundation models* | `OpenGVLab/InternVideo` |
| Qwen2.5-VL | Visão-linguagem com vídeos longos e localização temporal de eventos | `QwenLM/Qwen2.5-VL` |

**Recomendação:** para Claude Code, comece com `watch`. Para um app próprio de análise,
espelhe a lógica do `Azure-Samples/video-analysis-with-aoai`. Só vá para os modelos locais
pesados se precisar rodar offline/em escala.
