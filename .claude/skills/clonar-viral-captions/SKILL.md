---
name: clonar-viral-captions
description: Replica a estrutura de um vídeo viral já validado (template do app Captions, Reels, TikTok, Shorts) com o conteúdo e a marca do usuário. Use quando o usuário enviar ou citar um vídeo de referência e pedir "faz um igual", "copia esse formato", "usa esse template do Captions", "modelar esse viral".
---

# Clonar viral (templates do Captions e outros)

Copia a **estrutura** que viralizou (ritmo, gancho, cortes, legenda, enquadramento), nunca o conteúdo ou a imagem de terceiros. Siga o pipeline de `../viral-video-studio/references/pipeline.md` e as regras de `../viral-video-studio/references/regras.md`.

## Limite técnico

Não existe conector do Captions. Os templates são aplicados **no app**. Claude faz a engenharia reversa e entrega tudo pronto para gravar e aplicar o template, ou monta o vídeo com Higgsfield/ffmpeg.

## Passos

1. **Receber a referência**: arquivo de vídeo (exportado do Captions ou baixado) ou link do YouTube. Se for só um link do Instagram/TikTok, pedir o arquivo.
2. **Analisar**:
   - Arquivo local: `media_upload` → `media_confirm` → `video_analysis_create` (video_input_id) → `video_analysis_status` até `completed`.
   - YouTube: `video_analysis_create` com `youtube_url`.
   - Complementar localmente: `ffprobe` (duração, fps), e extrair um quadro por corte com `ffmpeg -vf "select='gt(scene,0.3)',showinfo" -vsync vfr quadro_%03d.jpg` para ver os enquadramentos.
3. **Gerar o Blueprint** (salvar em `blueprints/<nome>.md` na pasta de trabalho do usuário para reutilizar):

```
Formato: <ex. split-react, POV, dois papéis>  → skill correspondente
Duração: __s | Cortes: __ (média __s por plano)
Gancho (0–3s): visual __ | fala __ | texto __
Estrutura: [bloco | tempo | função | tipo de plano]
Legenda: estilo (palavra a palavra?), posição, cores de destaque
Áudio: voz / trilha / efeitos sonoros e onde entram
Por que funciona: 3 bullets (gatilho, retenção, compartilhamento)
Variáveis trocáveis: tema, fala, cenário, CTA
```

4. **Adaptar**: reescrever o roteiro com o tema do usuário mantendo tempos e função de cada bloco. Entregar 3 variações de gancho.
5. **Produzir**: encaminhar para a skill `formato-*` correspondente. Se o usuário for aplicar o template no Captions, entregar: roteiro para gravar, lista de takes, textos de tela e o nome/estilo do template a escolher.
6. **Checar** com `virality_predictor` (opcional, pago) e com o checklist do pipeline.

## Biblioteca de templates

Cada blueprint salvo vira um template reutilizável. Quando o usuário disser "usa o template X", carregue `blueprints/X.md` e pule direto para o passo 4.
