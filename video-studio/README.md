# video-studio — Templates Remotion de retenção (Grupo Pedra / canal dark)

Projeto Remotion para montar vídeos verticais (9:16) com **máxima retenção**,
aplicando a skill `legendas-retencao`. Primeiro template: **história com um
gancho a cada 30 segundos**.

> Este projeto é independente do app Python (`app.py`) na raiz. Roda em Node.

## Rodar

```bash
cd video-studio
npm install

# gerar a trilha sonora (regeneravel; nao vem versionada)
python3 assets-gen/gen_trilha.py     # cria public/trilha.wav

# abrir o editor visual (preview ao vivo, mexer no roteiro e ver na hora)
npm run dev            # remotion studio -> http://localhost:3000

# renderizar o vídeo final (2 min, 1080x1920)
npm run render        # gera out/historia.mp4

# renderizar só os primeiros 5s pra testar rápido
npm run render:hook
```

O ambiente já tem Chromium; não precisa instalar navegador.

## Estrutura

```
src/
  index.ts                 registerRoot
  Root.tsx                 define a Composition (30fps, 1080x1920)
  HistoriaComGanchos.tsx   junta os blocos + barra de progresso
  theme.ts                 TOKENS de cor/fonte (troque a paleta aqui, 1 lugar só)
  data/roteiro.ts          O ROTEIRO: hooks + legendas + timing  <-- você edita aqui
  components/
    Hook.tsx               gancho grande dos primeiros 3.5s (pop/spring)
    CaptionLine.tsx        legenda palavra a palavra com highlight
    Background.tsx         fundo cinematográfico + zoom (Ken Burns)
    Scene.tsx              um bloco de 30s (fundo + hook + legendas + wipe)
    ProgressBar.tsx        barra de retenção no topo
```

## Como personalizar

- **Trocar a história / os ganchos:** edite `src/data/roteiro.ts`. Cada objeto de
  `scenes` é um bloco de 30s com um `hook` (≤6 palavras) e as `lines` da narração.
  Marque a palavra-chave com `w("palavra", true)` para o highlight dourado.
- **Trocar a paleta (Pedra Engenharia / Tech / Infra, ou o canal):** edite só
  `src/theme.ts`.
- **Mais/menos blocos:** adicione ou remova cenas em `roteiro.ts` — a duração total
  se ajusta sozinha.

## Próximos passos (para produção real)

1. **Áudio + timing real:** hoje o timing das palavras é distribuído por código
   (placeholder). Em produção, gere a narração (ex.: ElevenLabs) e extraia os
   timestamps com Whisper para preencher `startSec` de cada linha — sincronismo
   com a fala é o fator nº1 de retenção.
2. **B-roll real:** troque o `Background` por `<Img>`/`<OffthreadVideo>` com o mesmo
   zoom, ou gere imagens por IA.
3. **Fontes da marca:** instalar Bebas Neue / Anton / Inter via `@remotion/google-fonts`
   (hoje usa fallback de sistema para renderizar offline).
4. **Renderização em massa:** parametrizar via `inputProps` e rodar N vídeos com
   roteiros diferentes (o forte do canal dark).
