---
titulo: Infográficos e Dados Técnicos
tipo: receita
tags: [pedra-motion-os, engenharia, componente, receita]
---

# Infográficos e Dados Técnicos

> **Objetivo:** transformar dados de engenharia em motion graphics claros e bonitos. Regra: **um dado por tela, animado, com contexto**.

## Princípios de dataviz em vídeo
- **Uma mensagem por gráfico.** O gráfico existe para provar UM ponto.
- **Anime a construção** do gráfico (barra sobe, linha desenha, número conta).
- **Destaque o ponto-chave** com `signal`; o resto em neutro.
- **Rótulos legíveis** e unidades claras (m², R$, meses, %).
- **Nunca** gráfico 3D distorcido ou pizza com 8 fatias.

## Tipos e quando usar
| Tipo | Comunica |
|---|---|
| Contador (number counter) | um KPI de impacto (ex.: "240 unidades") |
| Barra animada | comparação entre poucos itens |
| Linha (line chart) | tendência no tempo (valorização, vendas) |
| Progress ring/bar | % de conclusão da obra |
| Timeline | fases e marcos do cronograma |
| Comparativo lado a lado | Pedra vs mercado, opção A vs B |
| Mapa com pins | localização e entorno |

## Fluxo de apresentação de um dado
```
1. Contexto (label): "Velocidade de vendas"
2. Build: barra/linha/contador anima
3. Clímax: número-chave em destaque (signal, escala)
4. Significado: legenda que traduz ("acima da média da região")
```

## Componentes prontos
Ver [[12_Componentes_Remotion/03_Dados_e_Infograficos]] para `NumberCounter`, `BarChart`, `StatCard`, `ProgressRing`.

## Honestidade dos dados
Eixos sem truncamento enganoso; escalas justas; fonte do dado quando relevante. A marca é confiança — dado manipulado destrói reputação. Ver [[17_Auditoria/01_Rubrica_de_Auditoria]].

Ver: [[12_Componentes_Remotion/03_Dados_e_Infograficos]] · [[09_Biblioteca_Visual/03_Paleta_e_Cor]]
