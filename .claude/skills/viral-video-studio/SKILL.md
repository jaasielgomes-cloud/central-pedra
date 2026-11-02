---
name: viral-video-studio
description: Núcleo e roteador de produção de vídeos virais curtos (Reels, TikTok, Shorts). Use quando o usuário pedir "vídeo viral", "reels", "formato viral", "qual formato usar", ou não souber qual formato escolher. Define o pipeline comum (briefing → roteiro → assets → montagem → legenda → checagem) usado por todas as skills formato-*, clonar-viral-captions e avatar-foto-falante.
---

# Viral Video Studio

Núcleo compartilhado. As skills de formato seguem este pipeline e só definem o que muda.

## Catálogo de skills

| Skill | Quando usar |
|---|---|
| `clonar-viral-captions` | Já existe um vídeo viral (Captions, TikTok, Reels) e quer replicar a estrutura com outro conteúdo |
| `avatar-foto-falante` | Só tem uma foto + texto/voz e quer a pessoa falando (estilo HeyGen) |
| `formato-split-react` | Tela dividida: vídeo em cima, pessoa reagindo embaixo |
| `formato-greenscreen` | Pessoa na frente de print, notícia, site ou vídeo comentando |
| `formato-dois-papeis` | A mesma pessoa faz dois personagens que conversam |
| `formato-novelinha` | Minissérie dramatizada em episódios com gancho |
| `formato-podcast-fake` | Corte de "podcast" com dois microfones e legendas grandes |
| `formato-pov-conversa` | POV: a pessoa responde à câmera como se o espectador falasse |
| `formato-chat-animado` | Conversa de WhatsApp/DM animada mensagem a mensagem |
| `formato-entrevista-rua` | Pergunta rápida "de rua" com respostas cortadas |

Se o usuário não souber o formato: pergunte objetivo (alcance, autoridade, venda) e recomende 1–2 do catálogo.

## Pipeline obrigatório

Detalhes em `references/pipeline.md`. Resumo:

1. **Briefing** — tema, objetivo, público, CTA, marca, plataforma, duração (padrão 20–45s, 9:16).
2. **Roteiro** — gancho nos 0–3s, uma ideia, virada, CTA. Entregue em tabela tempo × fala × visual × texto na tela.
3. **Assets** — prefira gravação real do usuário (melhor retenção). IA só onde falta material. Ver `references/ferramentas.md`.
4. **Montagem** — `scripts/compose.sh` (ffmpeg) ou workflow `video-montage` do Higgsfield.
5. **Legenda** — app Captions ou workflow `video-montage` do Higgsfield.
6. **Checagem** — checklist de `references/pipeline.md` + `virality_predictor` (opcional, Higgsfield).

## Regras inegociáveis

Ler `references/regras.md` antes de gerar qualquer pessoa com IA. Resumo: só rosto/voz com consentimento, nada de imitar pessoa real, rotular conteúdo de IA, informar custo em créditos antes de gastar.

## Marca

Se o vídeo for do Grupo Pedra / Renovo / outra marca do usuário, carregue a skill de marca correspondente (ex.: `grupo-pedra-knowledge`, `renovo-identidade-marca`) antes do roteiro.
