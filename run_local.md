# Como rodar localmente no Windows

## 1. Crie a pasta do projeto

Extraia o ZIP em:

```powershell
C:\Projetos\internal-sales-automation
```

Depois entre na pasta:

```powershell
cd C:\Projetos\internal-sales-automation
```

## 2. Crie o ambiente Python

```powershell
python -m venv .venv
.venv\Scripts\activate
```

## 3. Instale as dependências

```powershell
python -m pip install -r requirements.txt
```

## 4. Configure as chaves

Copie o arquivo exemplo:

```powershell
copy .env.example .env
notepad .env
```

Preencha as variáveis:

- OPENAI_API_KEY
- PIPEDRIVE_API_KEY
- LEMLIST_API_KEY
- LEMLIST_CAMPAIGN_ID
- LEMLIST_WEBHOOK_TOKEN

Não cole suas chaves no terminal aberto durante reunião.

## 5. Carregue o .env no PowerShell

Se você não tiver um carregador automático de .env, rode manualmente:

```powershell
$env:OPENAI_API_KEY="SUA_CHAVE_OPENAI"
$env:OPENAI_MODEL="gpt-4.1-mini"
$env:PIPEDRIVE_API_KEY="SUA_CHAVE_PIPEDRIVE"
$env:PIPEDRIVE_BASE_URL="https://api.pipedrive.com"
$env:LEMLIST_API_KEY="SUA_CHAVE_LEMLIST"
$env:LEMLIST_CAMPAIGN_ID="SEU_CAMPAIGN_ID"
$env:LEMLIST_BASE_URL="https://api.lemlist.com"
$env:LEMLIST_WEBHOOK_TOKEN="um-token-secreto-seu"
```

## 6. Rode o servidor

```powershell
uvicorn app:app --host 127.0.0.1 --port 8080 --reload
```

## 7. Acesse no navegador

```text
http://127.0.0.1:8080/docs
```

Outros links:

```text
http://127.0.0.1:8080/health
http://127.0.0.1:8080/approvals
```

## 8. Teste prático no Swagger

Abra:

```text
http://127.0.0.1:8080/docs
```

Use o endpoint:

```text
POST /simulate
```

Payload de teste:

```json
{
  "lead_email": "cliente@empresa.com.br",
  "lead_name": "Cliente Teste",
  "company_name": "Concessionária Teste",
  "message": "Gostaria de entender o orçamento para adequar nossa oficina com sistema de óleo e valas técnicas.",
  "source": "teste_manual"
}
```

O sistema deve:

1. escolher o agente especialista;
2. analisar a mensagem com OpenAI, se a chave estiver configurada;
3. criar pessoa no Pipedrive;
4. criar negócio no Pipedrive;
5. criar nota;
6. criar atividade;
7. deixar a resposta pendente em `/approvals`.

## 9. Aprovar resposta

Pegue o `approval_id` retornado no `/simulate`.

Use:

```text
POST /approvals/decision
```

Payload:

```json
{
  "approval_id": "COLE_O_ID_AQUI",
  "decision": "approve",
  "edited_reply": "Olá, obrigado pelo retorno. Podemos seguir com um diagnóstico inicial para entender operação, escopo e prioridades antes de falar em orçamento?",
  "reviewer": "Jaasiel"
}
```

Para rejeitar:

```json
{
  "approval_id": "COLE_O_ID_AQUI",
  "decision": "reject",
  "reviewer": "Jaasiel"
}
```
