# Roteiro de Narração — "A Fé de Abraão" (2 min, 9:16)

Texto pronto para gerar a voz (ElevenLabs, sua gravação, etc.). Estrutura de
retenção: **um gancho a cada 30 segundos**. Tom: grave, contemplativo, pausado —
estilo canal dark bíblico. As palavras em **negrito** são as que ganham highlight
dourado na legenda (já marcadas no `src/data/roteiro.ts`).

> Como usar: gere o áudio de cada bloco (ou o total), coloque em `public/narracao.wav`,
> extraia timestamps por palavra com Whisper e preencha os `startSec` das linhas em
> `src/data/roteiro.ts`. Aí a legenda casa 100% com a fala (fator nº1 de retenção).

Ritmo alvo: ~145–160 palavras por minuto (voz calma). Pausas curtas nos "...".

---

## Bloco 1 — 0:00 a 0:30
**Gancho na tela:** DEUS PEDIU O **IMPOSSÍVEL**

> Ele era só um homem comum. Sem nada de especial.
> Mas recebeu uma **promessa** que desafiava a lógica.
> Um **filho**... na velhice.
> E, contra tudo o que os olhos podiam ver, ele acreditou.

*(Direção de voz: começar baixo, quase sussurro; subir levemente em "ele acreditou".)*

## Bloco 2 — 0:30 a 1:00
**Gancho na tela:** A PROMESSA PARECIA **MORTA**

> Os anos passaram. E **nada** aconteceu.
> Sara já tinha desistido. Ela riu da promessa.
> Toda a **esperança** parecia ter acabado.
> E foi exatamente aí... que tudo começou a mudar.

*(Direção de voz: tom de tensão, mais lento em "toda a esperança".)*

## Bloco 3 — 1:00 a 1:30
**Gancho na tela:** NO TERCEIRO DIA, TUDO **MUDOU**

> O impossível virou **real**. Isaque nasceu.
> Mas então veio o **teste** mais duro de todos.
> No topo do monte, com tudo em jogo,
> a fé dele não **tremeu**.

*(Direção de voz: clímax contido; peso em "não tremeu".)*

## Bloco 4 — 1:30 a 2:00 (lição + CTA)
**Gancho na tela:** A FÉ DELE TE **ENSINA** ISSO

> Promessa adiada não é promessa **negada**.
> O que parece morto... pode **renascer**.
> A sua espera também tem um propósito.
> **Segue** aqui — a parte 2 vai te surpreender.

*(Direção de voz: resolver com esperança; CTA firme e claro, sem pressa.)*

---

## Versão corrida (para gerar tudo de uma vez)

Ele era só um homem comum. Sem nada de especial. Mas recebeu uma promessa que
desafiava a lógica. Um filho, na velhice. E, contra tudo o que os olhos podiam
ver, ele acreditou. Os anos passaram. E nada aconteceu. Sara já tinha desistido.
Ela riu da promessa. Toda a esperança parecia ter acabado. E foi exatamente aí
que tudo começou a mudar. O impossível virou real. Isaque nasceu. Mas então veio
o teste mais duro de todos. No topo do monte, com tudo em jogo, a fé dele não
tremeu. Promessa adiada não é promessa negada. O que parece morto pode renascer.
A sua espera também tem um propósito. Segue aqui — a parte 2 vai te surpreender.

## Checklist de produção da narração
- [ ] Voz gerada/gravada em `public/narracao.wav` (ou .mp3)
- [ ] Timestamps por palavra extraídos com Whisper
- [ ] `startSec` de cada linha atualizado em `src/data/roteiro.ts`
- [ ] Volume da trilha reduzido para ~0.3 sob a narração (no `<Audio>` de `HistoriaComGanchos.tsx`)
- [ ] Adicionar `<Audio src={staticFile("narracao.wav")} />` na composição
