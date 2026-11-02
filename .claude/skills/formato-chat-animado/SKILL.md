---
name: formato-chat-animado
description: Vídeo de conversa de WhatsApp, Instagram Direct ou iMessage aparecendo mensagem a mensagem, com som de notificação, narração opcional e reviravolta no final. Use para "conversa de WhatsApp", "print de conversa animado", "chat story", "texting story", "história por mensagens".
---

# Chat animado

Pipeline: `../viral-video-studio/references/pipeline.md`. Regras: conversa encenada nunca pode ser apresentada como print real de cliente (ver `regras.md`, item 4). Use nomes fictícios.

## Roteiro

- 8 a 16 mensagens. A primeira já tem conflito ("você viu o que fizeram com seu carro?").
- Alternar quem fala, com mensagens curtas. Inserir "digitando..." antes da revelação.
- A reviravolta vem na penúltima mensagem; a última é a punchline ou o CTA.

## Produção (100% local, sem créditos)

1. Gerar o HTML da conversa (estilo WhatsApp: fundo #0B141A, balões #005C4B enviado e #202C33 recebido, 1080×1920).
2. Renderizar um PNG por estado (mensagem 1, 1–2, 1–3...) com Playwright (`page.screenshot`).
3. Cada estado vira um clipe: `compose.sh still estado_N.png <segundos> c_N.mp4 0`. Tempo por mensagem: 0,6s + 0,05s por caractere (mínimo 1,2s).
4. `compose.sh concat`, depois `compose.sh music` com a trilha. Som de notificação: misture um "pop" curto no início de cada mensagem (ffmpeg `adelay` + `amix`).
5. Opcional: voz narrando as mensagens (`generate_audio`) ou gameplay/B-roll embaixo com `compose.sh split chat.mp4 broll.mp4 out.mp4 0.6`.

Entregue também o HTML para o usuário poder ajustar o texto e renderizar de novo.
