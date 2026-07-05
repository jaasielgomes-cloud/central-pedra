# Ferramentas manuais — fallback quando não há Remotion

Carregar apenas se o usuário confirmar que **não** vai usar Remotion. Todos os
princípios da SKILL principal continuam valendo (zona segura 9:16, ≤6 palavras
no hook, highlight só na palavra-chave, timing sincronizado com a fala, máx. 2
fontes). Aqui estão só os "como fazer" por ferramenta.

Tokens de referência (ajustar à paleta oficial do Grupo Pedra):
- Texto base: `#FFFFFF`
- Highlight: `#E8B44C`
- Stroke/shadow: preto, opacidade 60-80%, 2-4px
- Fontes: Hook = Bebas Neue / Anton · Fala = Inter / Montserrat · KPI = Montserrat (tabular)

---

## 1. CapCut

Fluxo recomendado para retenção institucional:

1. **Legendas automáticas + revisão manual.** `Texto > Legendas automáticas`
   gera o timing base a partir do áudio. Sempre revisar palavra a palavra — o
   auto-caption erra números, siglas e nomes técnicos.
2. **Uma ideia por bloco.** Quebre frases longas em blocos de 5-6 palavras;
   nunca deixe duas linhas cheias empilhadas.
3. **Estilo base:** fonte Inter/Montserrat SemiBold, branco, sombra ativada
   (opacidade ~70%, distância baixa). Evitar o "fundo/caixa" sólido — usar só
   sombra ou contorno fino.
4. **Highlight de palavra-chave:** duplicar o clipe de texto, isolar a palavra
   em um bloco separado, trocar a cor para o highlight e aumentar levemente o
   peso/tamanho. Entrar com ~2-3 frames de atraso em relação à fala.
5. **Animação de entrada:** `Animações > Entrada > Escala (pop-in)` no hook.
   Duração curta (~8-12 frames). Não usar "Máquina de escrever" no hook (lento
   demais para reter).
6. **Zona segura:** manter o texto acima dos ~12% inferiores (barra de UI do
   TikTok/Reels). Usar a grade de segurança do CapCut como guia.
7. **Evitar:** glitch, shake, chroma, stickers e emojis piscando em conteúdo
   institucional/B2B. Reservar esses efeitos só para BTS informal.

---

## 2. Adobe Premiere Pro

1. **Transcrição → captions.** `Window > Text > Transcribe`, depois
   `Create Captions`. Isso ancora o timing no áudio real.
2. **Converter para gráfico quando precisar de estilo forte.** Captions são
   ótimas para fala corrida; para o hook e KPIs, use `Essential Graphics` (MOGRT
   ou Text layer) para ter controle total de keyframes.
3. **Estilo base (Essential Graphics):** Inter/Montserrat SemiBold, branco,
   `Stroke` 2-4px preto OU `Shadow` com opacidade 60-80%. Salvar como estilo
   (`Track Style`) para reaproveitar e garantir consistência.
4. **Pop-in do hook:** keyframe de `Scale` de 85% → 100% em ~8-10 frames, com
   `Ease In/Out` (Temporal Interpolation) para simular o overshoot do spring.
   Opcional: um segundo keyframe passando de 103% → 100% para o leve overshoot.
5. **Highlight de palavra-chave:** camada de texto separada só com a palavra, cor
   de highlight, entrando 2-3 frames depois. Nada de piscar.
6. **KPI / count-up:** usar expressão no valor ou o efeito de contagem de um MOGRT;
   fonte Montserrat com tabular nums para os dígitos não "dançarem".
7. **Transição de bloco:** `Clip-path`/`Crop` ou wipe curto sincronizado com o
   corte da cena — não zoom exagerado.
8. **Zona segura:** ativar `Safe Margins` e manter texto entre 10%-85% vertical.

---

## 3. DaVinci Resolve

1. **Transcrição e captions:** na página `Edit`, use
   `Create Subtitles from Audio` (Studio) para o timing base; revisar manualmente.
2. **Text+ para estilo cinematográfico.** Para hook, highlight e KPIs, usar o
   nó `Text+` (não o Title simples) — permite stroke, shadow e keyframes precisos.
3. **Estilo base (Text+):** Inter/Montserrat SemiBold, branco; aba `Shading` →
   elemento 1 = fill branco, elemento 2 = outline/stroke preto 2-4px OU drop
   shadow com opacidade 60-80%.
4. **Pop-in do hook:** keyframe de `Transform > Size` 0.85 → 1.0 em ~8-10 frames,
   suavizado no `Spline Editor` (ease) para imitar o spring. Curva com leve
   overshoot se quiser o "bounce".
5. **Highlight de palavra-chave:** Text+ separado só com a palavra, cor de
   highlight, entrando com 2-3 frames de atraso. Alternativa: usar o campo de
   `Character Level Styling` do Text+ para colorir só a palavra sem duplicar nó.
6. **KPI / count-up:** expressão no campo de texto ou macro de contagem; Fusion
   dá controle fino. Fonte Montserrat tabular.
7. **Transição de bloco:** máscara/`clip-path` no Fusion ou wipe curto no corte.
8. **Zona segura:** ativar overlay de `Safe Area` e respeitar 10%-85% vertical.

---

## Checklist manual (qualquer ferramenta)

- [ ] Timing veio de transcrição do áudio, não de estimativa manual?
- [ ] Máx. 2 fontes, hierarquia hook / fala / KPI respeitada?
- [ ] Highlight só na palavra-chave, com cor OU peso (não os dois + itálico)?
- [ ] Sombra/stroke sutil em vez de caixa sólida cobrindo a imagem?
- [ ] Texto dentro da zona segura 9:16 (fora dos ~12% inferiores)?
- [ ] Nenhum efeito "viral genérico" (glitch/shake/emoji) em conteúdo institucional?
- [ ] CTA final legível e estático por 1-2s?
