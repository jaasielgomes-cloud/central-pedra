# Skills — Central Pedra

Este repositório é, além do app de automação de vendas, um **plugin/marketplace do Claude Code**.
Isso permite usar as skills **em todo o ecossistema Claude** (Claude Code, Codex, Cursor,
Gemini CLI…), em qualquer máquina — não apenas dentro deste projeto.

As skills ficam em [`.claude/skills/`](../.claude/skills). Os manifests do plugin ficam em
[`.claude-plugin/`](../.claude-plugin).

---

## Como usar em todo o ecossistema

### 1. Só neste projeto (já funciona)

Ao abrir uma sessão do Claude Code dentro de `central-pedra`, todas as skills carregam
automaticamente como *project skills* (a partir de `.claude/skills/`). Basta digitar
`/nome-da-skill` (ex.: `/watch`, `/cold-email`, `/seo-audit`) ou deixar o Claude ativá-las
pelo contexto.

### 2. Em qualquer máquina / qualquer projeto (via plugin)

```bash
# adiciona este repositório como marketplace
claude plugin marketplace add jaasielgomes-cloud/central-pedra

# instala o pacote de skills (fica disponível em TODAS as sessões)
claude plugin install central-pedra-skills@central-pedra
```

Ou, dentro de uma sessão interativa:

```
/plugin marketplace add jaasielgomes-cloud/central-pedra
/plugin install central-pedra-skills@central-pedra
```

Escopos de instalação: `--scope user` (padrão, todas as sessões do usuário),
`--scope project` (compartilhado via repositório) ou `--scope local`.

### 3. Instalação global manual (uma máquina)

Copie qualquer pasta de skill para `~/.claude/skills/`. Ela passa a valer para todas as
sessões daquele usuário, sem passo de instalação.

---

## Catálogo

### Vídeo (compreensão de vídeo) — ver [`docs/VIDEO.md`](VIDEO.md)

| Skill | O que faz |
|-------|-----------|
| `watch` | Assiste um vídeo por **URL ou arquivo local**: baixa (yt-dlp), extrai frames (ffmpeg) e transcreve (legendas → Whisper). Recomendada para uso geral. |
| `video-frames` | Extração leve de frames JPEG otimizada por modelo (Claude/OpenAI/Gemini), com modo OCR. |
| `analyzing-video` | Análise estruturada: grades de montagem, detecção de cenas, transcrição e subagentes paralelos. |

### Marketing (46 skills)

| Categoria | Skills |
|-----------|--------|
| SEO & Descoberta | `seo-audit`, `ai-seo`, `programmatic-seo`, `site-architecture`, `schema`, `competitors`, `competitor-profiling` |
| Conteúdo & Copy | `copywriting`, `copy-editing`, `cold-email`, `emails`, `sms`, `social`, `video`, `image`, `content-strategy` |
| Conversão | `cro`, `signup`, `onboarding`, `popups`, `paywalls`, `ab-testing`, `analytics` |
| Ads pagos | `ads`, `ad-creative` |
| Growth | `referrals`, `free-tools`, `co-marketing`, `community-marketing`, `marketing-loops`, `lead-magnets` |
| Estratégia | `marketing-ideas`, `marketing-psychology`, `launch`, `pricing`, `offers`, `customer-research`, `marketing-plan`, `product-marketing` |
| Vendas & Ops | `revops`, `sales-enablement`, `prospecting`, `directory-submissions`, `public-relations`, `churn-prevention`, `aso` |

> Observação: existe uma skill de marketing chamada `video` (produção de vídeo/roteiro) —
> diferente das 3 skills de **compreensão** de vídeo acima (`watch`, `video-frames`,
> `analyzing-video`).

---

## Créditos e licença

Todas as skills incluídas são de projetos open-source sob licença **MIT**:

- Skills de marketing — [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (Corey Haines)
- `watch` — [bradautomates/claude-video](https://github.com/bradautomates/claude-video) (Bradley Bonanno)
- `video-frames` — [mugnimaestra/video-frames-skill](https://github.com/mugnimaestra/video-frames-skill)
- `analyzing-video` — [bsisduck/video-analyzer-skill](https://github.com/bsisduck/video-analyzer-skill)
- Servidor MCP `video-vision` — [jordanrendric/claude-video-vision](https://github.com/jordanrendric/claude-video-vision)
