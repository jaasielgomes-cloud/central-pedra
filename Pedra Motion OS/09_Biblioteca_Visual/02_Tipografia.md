---
titulo: Tipografia
tipo: conceito
tags: [pedra-motion-os, biblioteca-visual, conceito]
---

# Tipografia

> **Objetivo:** regras de tipografia que fazem o texto parecer editorial/premium, não "legenda de app".

## Escala e hierarquia
Use a escala de [[09_Biblioteca_Visual/01_Design_Tokens|tokens]] (`TYPO.size`). Nunca mais de **2–3 tamanhos** por tela. Hierarquia por **peso e cor**, não só por tamanho.

## Regras premium
- **Tracking negativo** em manchetes grandes (`-0.02em`): dá ar de campanha.
- **Caixa alta** para labels curtos e kickers; caixa mista para leitura.
- **Números tabulares** (mono nos dígitos) em contadores — evita "dança" de largura.
- **Contraste de peso:** palavra-chave em `black`, resto em `regular`.
- **Máximo ~6 palavras** por card em vertical.
- **Alinhamento** consistente (geralmente à esquerda ou centralizado — escolha um por vídeo).

## Legibilidade no feed
- Tamanho mínimo de leitura confortável em vertical: `TYPO.size.caption` (30px @1080).
- Sempre **fundo de contraste**: caixa semitransparente, sombra sutil ou gradiente atrás do texto sobre imagem.
- Texto seguro dentro das margens (`GRID.margin`) e fora das [[15_Exportacao/02_Zonas_Seguras|zonas de UI]].

## Kinetic typography (texto animado)
- Entrada por palavra ou linha com **stagger** (não a frase inteira de vez).
- Palavra-chave com destaque atrasado (aparece + escala + cor).
- Ver componente [[12_Componentes_Remotion/01_Titulos_e_Texto|KineticTitle]].

## Pares tipográficos aprovados
- **Archivo** (display) + **Inter** (corpo) — geométrico, moderno, sóbrio.
- **Inter Tight** (display) + **Inter** (corpo) — coeso, tech.
- Dígitos: **IBM Plex Mono** para dados.

Ver: [[09_Biblioteca_Visual/01_Design_Tokens]] · [[12_Componentes_Remotion/01_Titulos_e_Texto]]
