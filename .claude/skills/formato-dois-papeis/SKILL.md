---
name: formato-dois-papeis
description: Formato viral em que a mesma pessoa interpreta dois personagens que conversam, com um perguntando e o outro respondendo (cliente x vendedor, eu de antes x eu de hoje, chefe x funcionário). Use para "eu fazendo dois papéis", "conversando comigo mesmo", "diálogo com eu mesmo", "personagens".
---

# Dois papéis (mesma pessoa)

Pipeline: `../viral-video-studio/references/pipeline.md`.

## Roteiro

- Definir os personagens A e B com um **contraste claro**: objetivo oposto, emoção oposta ou conhecimento oposto.
- Diferenciar no visual: roupa, acessório (boné, óculos, crachá), lado do quadro e, se possível, cenário.
- Falas curtas (1 frase por turno), ritmo de pingue-pongue. A virada vem de B (ou de A no último turno, para o humor).
- Entregar o roteiro com uma coluna `personagem | figurino | lado/olhar`.

Ideias de contraste: cliente indeciso x vendedor que resolve, "eu em 2020" x "eu hoje", objeção x resposta, iniciante x especialista.

## Produção gravada (recomendada)

1. Tripé fixo e mesma luz. Gravar **todas** as falas de A, trocar de roupa, depois todas as de B.
2. A olha levemente para a direita, B para a esquerda (simula o contracampo).
3. Cortar fala a fala e intercalar: `compose.sh concat final.mp4 a1.mp4 b1.mp4 a2.mp4 ...`.
4. Variação com os dois na tela ao mesmo tempo: `compose.sh stack a.mp4 b.mp4 saida.mp4`.
5. Legenda com cor diferente por personagem (gerar .ass com dois estilos).

## Produção com IA (sem gravar)

1. Uma foto do usuário → `generate_image` gera o personagem B (outra roupa ou cenário, mesmo rosto).
2. Áudio: voz clonada do usuário (`avatar-foto-falante`), com entonação diferente por personagem (ex.: B mais grave e lento).
3. Uma geração `intone` por fala (4–30s; agrupe falas curtas do mesmo personagem quando possível para economizar créditos).
4. Montar como na versão gravada.
