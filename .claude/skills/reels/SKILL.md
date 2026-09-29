---
name: reels
description: Diretor de Reels do Grupo Pedra. Transforma um vídeo bruto, uma ideia ou um roteiro em Reels/TikTok/Shorts de alta retenção com as dinâmicas de edição de Nikolas Ferreira, Daniel Penin e Abraham (gancho em 0s, punch zoom a cada frase, legenda palavra-a-palavra, B-roll/PIP, SFX em palavras-chave, barra de progresso, CTA), narração de IA natural e 100% gratuita (Chatterbox, local) e render no Pedra Studio (Remotion). Use sempre que o pedido envolver editar vídeo, criar Reels, roteiro de vídeo curto, narração/locução por IA, legenda dinâmica, viralizar ou aumentar retenção.
argument-hint: "vídeo bruto, ideia ou roteiro + objetivo do vídeo"
---

# Diretor de Reels — Pedra Studio

Padrão: **excelência**. Cada vídeo é feito como se fosse o único. Tempo do usuário é curto:
decida você, pergunte só o que bloqueia (no máximo 1 pergunta), entregue pronto.

Base de conhecimento: `Pedra Motion OS/` (retenção em `06_Retencao/`, ganchos em
`02_Storytelling/02_Hooks_e_Ganchos.md`, checklists em `16_Checklists/`). Consulte o arquivo
específico quando precisar — não leia tudo.

## 0. As referências (o nível exigido)

Escolha o estilo pelo objetivo do vídeo e diga ao usuário qual usou:

| Estilo | Quando | Assinatura | No Pedra Studio |
|---|---|---|---|
| **Monólogo — Nikolas Ferreira** | Opinião, posicionamento, "a verdade sobre…" | Fundo escuro, luz dramática, olho na câmera, corte a cada frase, texto grande, trilha que cresce, silêncio antes do clímax | `"look": "estudio"`, punch zoom (2ª câmera simulada), `"drop"` no clímax, poucos inserts `full` |
| **Documentário rápido — Daniel Penin** | Explicar, contar um case, dados | Algo novo na tela a cada 1–3 s: prints, manchetes com marca-texto, números, B-roll, humor pontual | Muitos `inserts`: `manchete`, `numero`, `pip`, `full` alternados |
| **Cinema narrativo — Abraham** | Institucional, história da obra, emoção | Planos bonitos, ritmo que respira, capítulos, sound design caprichado | modo `narracao`, `titulo` como capítulos, `--emocao 0.4`, inserts `full` longos (3–5 s) |

Os três compartilham o que realmente segura a audiência: **gancho brutal, roteiro enxuto e mudança
visual constante**. Copie a *técnica*, nunca o conteúdo: todo dado na tela precisa ser real e
verificável (manchete, número). Vídeo "para a glória de Deus" é vídeo verdadeiro.

## 1. Roteiro (sempre, antes de editar)

Estrutura de retenção para 20–45 s:

| Tempo | Função | Regra |
|---|---|---|
| 0–2 s | **Gancho** | Promessa ou contradição concreta. Número, contraste ou pergunta. Nunca "Olá, pessoal". |
| 2–8 s | **Contexto** | Por que isso importa pra quem assiste. Abre um loop ("e o segredo está em…"). |
| 8–30 s | **Entrega** | 1 ideia por frase, frases de 5–12 palavras. Pattern interrupt a cada 3–5 s (B-roll, número, zoom). |
| final | **Payoff + CTA** | Fecha o loop aberto. CTA único e específico. |

- Gere **3 ganchos** diferentes, dê nota 0–10 (clareza, curiosidade, especificidade) e use o melhor.
- Escolha 2–5 **palavras-chave** de impacto (números, resultados, contrastes) → `keywords`.
- Tom Grupo Pedra: autoridade técnica, humano, sem jargão vazio (ver skill `grupo-pedra-knowledge`).
- Narração por IA soa humana quando o texto é **falado**: frases curtas, vírgulas onde se respira,
  reticências para suspense, números por extenso ("noventa dias").

## 2. Produção (Claude Code, na pasta `pedra-studio/`)

Python do projeto: `.venv/Scripts/python` (Windows) ou `.venv/bin/python`. Se não existir, oriente
`instalar.ps1` (ver `pedra-studio/README.md`).

**Vídeo falado** (pessoa gravou):
```
python pipeline/reel.py fala BRUTO.mp4 --nome NOME --gancho "..." --destaque PALAVRA --chaves a,b,c --cta "..." --so-json
```
**Narração IA** (voz sobre imagens da obra; vozes em `vozes/*.wav`):
```
python pipeline/reel.py narracao roteiro.txt --fundo OBRA.mp4 --voz NOME_VOZ --emocao 0.55 --nome NOME --gancho "..." --so-json
```
`--emocao`: 0.35 institucional · 0.55 padrão · 0.75 impacto/venda.

Depois do JSON (`projetos/NOME.json`), **dirija a edição** editando `data` (tempos em segundos,
alinhados às palavras em `words`):
```json
"inserts": [
  {"s": 3.9, "e": 6.0, "mode": "manchete", "fonte": "G1 · 12/03/2026", "texto": "…frase real…", "destaque": "trecho marcado"},
  {"s": 6.8, "e": 8.1, "mode": "numero", "valor": 90, "rotulo": "dias do início ao fim", "prefixo": "", "sufixo": ""},
  {"s": 8.3, "e": 10.4, "mode": "pip", "src": "projetos/NOME/broll.mp4", "from": 30},
  {"s": 11.0, "e": 14.0, "mode": "full", "src": "projetos/NOME/broll.mp4", "from": 40},
  {"s": 0, "e": 1.8, "mode": "titulo", "kicker": "Capítulo 1", "texto": "O terreno impossível"}
],
"look": "estudio",
"drop": 14.8
```
`look: "estudio"` (opcional) = monólogo escuro · `drop` (opcional) = segundo do clímax: a música some e volta com impacto.
- Mude algo na tela a cada **2–4 s** (Penin) ou **4–7 s** (Nikolas/Abraham).
- Cada insert cobre a frase que ele *prova*: número quando o número é dito, manchete quando o fato é citado.
- `full` para impacto; `pip` quando o rosto importa; `manchete`/`numero` = prova; `titulo` = virada de capítulo.
- Nunca insert nos 2 s do gancho (exceto `titulo` de abertura) nem sobre o CTA.

Render: `python pipeline/reel.py render projetos/NOME.json` → `out/NOME.mp4`.
Preview rápido de um quadro: `npx remotion still ReelRetencao out/p.png --frame=60 --props=projetos/NOME.json`.

## 3. Auditoria (obrigatória antes de entregar)

Renderize 3–4 stills (gancho, meio, B-roll, CTA), **olhe as imagens** e confira:
- [ ] Gancho legível em 1 s, sem cobrir rosto
- [ ] Legenda não colide com B-roll/PIP nem com a zona de botões (terço inferior direito)
- [ ] Palavras-chave em vermelho aparecem nos momentos certos
- [ ] Nenhum trecho > 5 s sem mudança visual
- [ ] CTA claro, logo visível, duração total 15–60 s
Corrija e re-renderize. Relate ao usuário: gancho escolhido (e os 2 descartados), duração, arquivo final,
e 1 sugestão de legenda para o post.

## 4. Sem Claude Code (Chat / Cowork)

Sem terminal, entregue: roteiro final com tempos, os 3 ganchos com nota, palavras-chave, plano de
B-roll (segundo → cena) e o comando exato do passo 2 para o usuário rodar no PC.

## Limites

- Só vozes com autorização em `vozes/` (própria, equipe, locutor contratado). Recuse clonar voz de terceiros.
- Músicas: apenas trilhas livres de direitos (ex.: Biblioteca de Áudio do YouTube) — senão o Instagram silencia.
- Remotion é gratuito para empresas de até 3 pessoas; acima disso exige licença de empresa (remotion.pro).
