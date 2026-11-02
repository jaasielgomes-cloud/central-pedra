# Pipeline de produção

## 1. Briefing (perguntar só o que faltar, numa mensagem)

- Tema e mensagem única (uma frase)
- Objetivo: alcance | autoridade | venda | captação de lead
- Público
- CTA (seguir, comentar palavra-chave, link na bio, WhatsApp)
- Plataforma e duração (padrão: Reels/TikTok, 9:16, 20–45s)
- Material disponível: vai gravar? tem fotos? tem vídeo de referência?

## 2. Roteiro

Estrutura padrão (ajustada por cada formato):

| Bloco | Tempo | Função |
|---|---|---|
| Gancho | 0–3s | Frase + visual que param o scroll. Conflito, número, promessa ou pergunta |
| Contexto | 3–8s | Por que importa |
| Desenvolvimento | 8–35s | Uma ideia, em ritmo de corte a cada 2–4s |
| Virada/payoff | final | Revelação, punchline ou resultado |
| CTA | últimos 2–3s | Uma ação só |

Entregar sempre como tabela: `tempo | quem fala | fala | visual | texto na tela`.

Ganchos que funcionam: "Ninguém te conta isso sobre X", "Parei de fazer X e aconteceu Y", "3 erros que...", "Você está fazendo X errado", pergunta direta, resultado antes do processo.

## 3. Shot list

Para cada plano: enquadramento, duração, fonte (gravar | IA | stock | print), observação de luz/áudio.
Gravação pelo usuário: celular na vertical, luz de frente (janela), microfone de lapela, 4K/30fps se possível, gravar cada fala 2x.

## 4. Montagem

- `scripts/compose.sh` — split, pip, stack de diálogo, concat, legenda .ass/.srt, normalização de áudio.
- Cortes secos, sem silêncios > 0,4s, zoom punch-in a cada troca de ideia.
- Música de fundo a −20 a −25 dB abaixo da voz.

## 5. Legenda

- Palavra a palavra ou 2–4 palavras por vez, centro-baixo (fora da UI da plataforma: margem inferior ≥ 20%).
- Destaque de cor nas palavras-chave.
- Opções: app Captions (templates do usuário), workflow `video-montage` do Higgsfield, ou .ass via `compose.sh captions`.

## 6. Checklist antes de entregar

- [ ] Gancho visual E falado nos 0–3s
- [ ] Nenhum trecho parado > 3s
- [ ] Texto legível e fora das áreas de UI (topo 12%, base 20%, lateral direita 15%)
- [ ] Áudio da voz entre −16 e −14 LUFS
- [ ] Um único CTA
- [ ] Conteúdo de IA rotulado ao publicar
- [ ] Legenda do post + 3–5 hashtags + palavra-chave de comentário (se usar automação de DM)
