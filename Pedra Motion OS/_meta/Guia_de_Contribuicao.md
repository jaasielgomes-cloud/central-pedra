---
titulo: Guia de Contribuição
tipo: meta
tags: [pedra-motion-os, meta]
---

# ✍️ Guia de Contribuição

Como manter o Pedra Motion OS crescendo sem perder consistência.

## Anatomia de toda nota
1. **Frontmatter** com `titulo`, `tipo`, `tags`.
2. **Título H1** claro.
3. **Callout de objetivo** (o que a nota resolve).
4. **Corpo** organizado em seções curtas.
5. **Bloco "Ver:"** ao final com links internos `[[ ]]`.

## Regras de escrita
- Português do Brasil, tom profissional e direto.
- Frases curtas. Listas > parágrafos longos.
- Todo conceito abstrato vem com **exemplo concreto**.
- Todo componente/transição diz **quando usar** e **quando NÃO usar**.
- Código sempre em bloco ` ```tsx ` com comentário do que faz.

## Convenção de nomes
- Pastas: `NN_Nome_Do_Modulo`.
- Notas: `NN_Nome_Da_Nota.md` (índices sempre `00_Index.md`).
- IDs de componentes: `PascalCase` (ex.: `KineticTitle`).
- Tokens: `kebab-case` (ex.: `color-pedra-graphite`).

## Ciclo de qualidade
Nova nota → `#status/rascunho` → revisão → `#status/ativo`.
Todo componente novo precisa de exemplo de implementação testável.

Ver: [[_meta/Sistema_de_Tags]] · [[00_INDEX]]
