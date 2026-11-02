---
name: avatar-foto-falante
description: Cria um vídeo da pessoa falando a partir de uma única foto e de um texto ou áudio, no estilo HeyGen, usando Higgsfield Intone e voz clonada. Use quando o usuário disser "transforma essa foto em vídeo falando", "avatar", "estilo HeyGen", "quero gravar sem aparecer", "faz eu falar esse texto".
---

# Avatar: foto falante

Siga `../viral-video-studio/references/regras.md` **antes de tudo**: só com foto e voz de quem consentiu.

## Entradas

- **Foto**: rosto de frente, olhos visíveis, boca fechada ou neutra, luz uniforme, ≥ 1024px, sem óculos escuros. Enquadramento do peito para cima. A foto já define o cenário (ou gerar um cenário com `generate_image` usando a foto como referência).
- **Voz** (escolher uma):
  1. Áudio gravado pelo usuário (melhor qualidade e naturalidade).
  2. Voz clonada: `create_voice` com 30–60s de fala limpa do usuário, depois `generate_audio` com o texto.
  3. Voz de catálogo (`list_voices`): só se o usuário aceitar uma voz que não é a dele.
- **Texto**: roteiro do pipeline (`../viral-video-studio/references/pipeline.md`).

## Produção

1. Dividir o texto em blocos de **8–25s** em pausas naturais (o Intone aceita 4–30s por geração).
2. Gerar o áudio de cada bloco. Conferir a duração com `ffprobe`.
3. Upload da foto e dos áudios (`media_upload` → PUT → `media_confirm`). Guardar os `media_id`.
4. Estimar o custo de N clipes e **pedir confirmação**.
5. `generate_video` com `model: "intone"`, `aspect_ratio: "9:16"`, `resolution: "1080p"`, foto em `image_references` e áudio em `audio_references`. Use as ferramentas batch para gerar os blocos em paralelo e depois `jobs_wait`.
6. Montar com `../viral-video-studio/scripts/compose.sh concat` e esconder as emendas intercalando B-roll ou print (`compose.sh still`), já que um corte seco entre dois clipes do avatar fica visível.
7. Legenda e `loudnorm`.

## Qualidade igual ou melhor que a HeyGen

- Usar foto real em alta resolução, não uma selfie comprimida do WhatsApp.
- Voz real ou clonada vence o TTS genérico. A voz é o maior fator de realismo.
- Clipes curtos (≤ 20s) mantêm o lip-sync mais firme.
- Variar o enquadramento (gerar 2–3 fotos do mesmo look com `generate_image`: close, plano médio) e alternar entre elas a cada bloco.
- Se um bloco sair com artefato na boca ou nos olhos, gerar de novo só aquele bloco.

## Alternativa sem IA

Se o objetivo for autoridade de marca pessoal, gravar de verdade continua tendo mais retenção. Use o avatar para volume (ex.: 5 vídeos/semana) e grave você mesmo os vídeos-chave.
