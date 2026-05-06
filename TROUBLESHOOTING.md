# Troubleshooting

## Erro de proxy no Codex ou ambiente remoto

Se o `pip install` falhar com erro parecido com:

```text
ProxyError 403 Forbidden
```

o problema não é necessariamente o código. É bloqueio de rede impedindo acesso ao PyPI.

Solução recomendada:

1. Baixar este ZIP.
2. Extrair no Windows em `C:\Projetos\internal-sales-automation`.
3. Rodar localmente conforme `run_local.md`.

## Verificar sintaxe sem instalar dependências

```powershell
python -m py_compile app.py
```

## Verificar dependências

```powershell
python -c "import fastapi, uvicorn, pydantic, requests; print('deps_ok')"
```

## Porta ocupada

Se a porta 8080 estiver ocupada:

```powershell
uvicorn app:app --host 127.0.0.1 --port 8081 --reload
```

Depois acesse:

```text
http://127.0.0.1:8081/docs
```
