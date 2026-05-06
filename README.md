# Internal Sales Automation — Grupo Pedra

MVP interno para integrar:

- Lemlist
- OpenAI
- Pipedrive
- Aprovação humana obrigatória
- Agentes especialistas por tipo de lead

## O que este app faz

Quando um lead chega, o sistema:

1. recebe a mensagem em `/simulate` ou `/webhooks/lemlist`;
2. escolhe um agente especialista:
   - `pricing_agent`
   - `technical_agent`
   - `compliance_agent`
   - `sdr_agent`
3. analisa a mensagem com OpenAI;
4. cria pessoa, negócio, nota e atividade no Pipedrive;
5. salva a resposta em uma fila de aprovação;
6. só envia ao Lemlist depois de aprovação manual.

## Regra principal

Nenhuma resposta é enviada automaticamente.

A resposta fica pendente em:

```text
GET /approvals
```

A aprovação é feita em:

```text
POST /approvals/decision
```

## Acesso local

Depois de rodar o servidor:

```text
http://127.0.0.1:8080/docs
```

## Rodar no Windows

Veja o arquivo:

```text
run_local.md
```

## Segurança

Não coloque chaves reais em arquivos enviados por WhatsApp, prints ou repositórios públicos.

Se alguma chave já foi colada em chat, terminal gravado, print ou ambiente compartilhado, revogue e gere outra.
