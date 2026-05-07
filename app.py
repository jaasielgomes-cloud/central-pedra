from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import requests as http
import os
import time
import uvicorn

load_dotenv()

app = FastAPI(title="Internal Sales Automation - Grupo Pedra")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL  = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

LEMLIST_KEY      = os.getenv("LEMLIST_API_KEY", "")
LEMLIST_BASE     = os.getenv("LEMLIST_BASE_URL", "https://api.lemlist.com/api")
PIPEDRIVE_KEY    = os.getenv("PIPEDRIVE_API_KEY", "")
PIPEDRIVE_BASE   = "https://api.pipedrive.com/v1"

# ── Cache simples em memória (TTL 5 min) ─────────────────────────
_cache: dict = {}
CACHE_TTL = 300  # segundos

def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < CACHE_TTL:
        return entry["data"]
    return None

def _cache_set(key: str, data):
    _cache[key] = {"ts": time.time(), "data": data}

# ── Lemlist — dados reais ─────────────────────────────────────────

def lemlist_status_pt(status: str) -> str:
    return {"running": "ativo", "paused": "pausado", "draft": "rascunho"}.get(status, status)

def fetch_lemlist_campaigns() -> list:
    cached = _cache_get("lemlist_campaigns")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{LEMLIST_BASE}/campaigns",
            auth=("", LEMLIST_KEY),
            timeout=10,
        )
        resp.raise_for_status()
        raw = resp.json()
        campaigns = raw if isinstance(raw, list) else raw.get("campaigns", [])
        result = [
            {
                "id":        c.get("_id", c.get("id", "")),
                "name":      c.get("name", "Campanha sem nome"),
                "status":    lemlist_status_pt(c.get("status", "draft")),
                "createdAt": c.get("createdAt", ""),
                "archived":  c.get("archived", False),
            }
            for c in campaigns
        ]
        _cache_set("lemlist_campaigns", result)
        return result
    except Exception as e:
        print(f"[Lemlist] Erro: {e}")
        return []

# ── Pipedrive — dados reais ───────────────────────────────────────

def pipedrive_status_pt(status: str) -> str:
    return {"open": "aberto", "won": "ganho", "lost": "perdido"}.get(status, status)

def fmt_brl(value) -> str:
    try:
        return f"R$ {float(value):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except:
        return "—"

def fetch_pipedrive_deals() -> list:
    cached = _cache_get("pipedrive_deals")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{PIPEDRIVE_BASE}/deals",
            params={"api_token": PIPEDRIVE_KEY, "status": "all_not_deleted", "limit": 100},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data") or []
        result = [
            {
                "id":                   d.get("id"),
                "title":                d.get("title", "Negócio sem título"),
                "org_name":             (d.get("org_id") or {}).get("name", ""),
                "person_name":          (d.get("person_id") or {}).get("name", ""),
                "owner_name":           (d.get("user_id") or {}).get("name", ""),
                "value":                d.get("value", 0),
                "formatted_value":      fmt_brl(d.get("value", 0)),
                "status":               pipedrive_status_pt(d.get("status", "open")),
                "stage_id":             d.get("stage_id"),
                "pipeline_id":          d.get("pipeline_id"),
                "next_activity_subject":d.get("next_activity_subject", ""),
                "next_activity_note":   d.get("next_activity_note", ""),
                "add_time":             d.get("add_time", ""),
                "update_time":          d.get("update_time", ""),
            }
            for d in data
        ]
        _cache_set("pipedrive_deals", result)
        return result
    except Exception as e:
        print(f"[Pipedrive] Erro: {e}")
        return []

def fetch_pipedrive_activities() -> list:
    cached = _cache_get("pipedrive_activities")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{PIPEDRIVE_BASE}/activities",
            params={"api_token": PIPEDRIVE_KEY, "done": 0, "limit": 100},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data") or []
        result = [
            {
                "id":         a.get("id"),
                "subject":    a.get("subject", ""),
                "type":       a.get("type", ""),
                "due_date":   a.get("due_date", ""),
                "due_time":   a.get("due_time", ""),
                "deal_id":    a.get("deal_id"),
                "deal_title": a.get("deal_title", ""),
                "org_name":   a.get("org_name", ""),
                "person_name":a.get("person_name", ""),
                "note":       a.get("note", ""),
                "done":       a.get("done", False),
            }
            for a in data
        ]
        _cache_set("pipedrive_activities", result)
        return result
    except Exception as e:
        print(f"[Pipedrive Activities] Erro: {e}")
        return []

def fetch_pipedrive_pipelines() -> list:
    cached = _cache_get("pipedrive_pipelines")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{PIPEDRIVE_BASE}/pipelines",
            params={"api_token": PIPEDRIVE_KEY},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data") or []
        result = [{"id": p.get("id"), "name": p.get("name", "")} for p in data]
        _cache_set("pipedrive_pipelines", result)
        return result
    except Exception as e:
        print(f"[Pipedrive Pipelines] Erro: {e}")
        return []

def fetch_pipedrive_persons() -> list:
    cached = _cache_get("pipedrive_persons")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{PIPEDRIVE_BASE}/persons",
            params={"api_token": PIPEDRIVE_KEY, "limit": 100},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data") or []
        result = [
            {
                "id":       p.get("id"),
                "name":     p.get("name", ""),
                "org_name": (p.get("org_id") or {}).get("name", ""),
                "email":    (p.get("email") or [{}])[0].get("value", ""),
                "phone":    (p.get("phone") or [{}])[0].get("value", ""),
                "open_deals_count": p.get("open_deals_count", 0),
            }
            for p in data
        ]
        _cache_set("pipedrive_persons", result)
        return result
    except Exception as e:
        print(f"[Pipedrive Persons] Erro: {e}")
        return []

def fetch_pipedrive_campaigns() -> list:
    cached = _cache_get("pipedrive_campaigns")
    if cached:
        return cached
    try:
        resp = http.get(
            f"{PIPEDRIVE_BASE}/campaigns",
            params={"api_token": PIPEDRIVE_KEY, "limit": 100},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data") or []
        result = [
            {
                "id":           c.get("id"),
                "name":         c.get("name", "Campanha sem nome"),
                "status":       c.get("status", ""),
                "type":         c.get("type", ""),
                "send_time":    c.get("send_time", ""),
                "created_at":   c.get("created", ""),
                "subject":      c.get("subject", ""),
                "from_name":    c.get("from_name", ""),
                "from_email":   c.get("from_email", ""),
                "opened":       c.get("opened_count", 0),
                "clicked":      c.get("clicked_count", 0),
                "sent":         c.get("mail_count", 0),
                "unsubscribed": c.get("unsubscribed_count", 0),
            }
            for c in data
        ]
        _cache_set("pipedrive_campaigns", result)
        return result
    except Exception as e:
        print(f"[Pipedrive Campaigns] Erro: {e}")
        return []

# ── Dados mock (substitua por integrações reais depois) ───────────

MOCK_DATA = {
    "campanhas": [
        {"nome": "Prospecção Volvo",      "status": "ativo",    "criado_em": "2026-05-01"},
        {"nome": "Pós-venda Scania",       "status": "pausado",  "criado_em": "2026-04-28"},
        {"nome": "Diagnóstico Pedra Tech", "status": "rascunho", "criado_em": "2026-05-05"},
    ],
    "aprovacoes": [
        {
            "id": "apr_001",
            "titulo": "Aprovar campanha Lemlist",
            "descricao": "Campanha aguardando validação de Jaasiel",
            "lead": {
                "nome": "Gustavo Ferreira",
                "empresa": "Nors Volvo Rondonópolis",
                "mensagem": "Tenho interesse em entender como o Grupo Pedra pode ajudar na estrutura de pós-venda da nossa concessionária.",
            },
            "analise": {
                "intencao": "Interesse consultivo",
                "urgencia": 7,
                "proxima_acao": "Criar tarefa de follow-up consultivo no Pipedrive.",
                "resposta_sugerida": "Olá Gustavo, obrigado pelo contato! Podemos agendar um diagnóstico inicial sem compromisso?",
                "classificacao": "Quente",
            },
        },
        {
            "id": "apr_002",
            "titulo": "Criar próxima atividade CRM",
            "descricao": "Negócio sem acompanhamento definido",
            "lead": {
                "nome": "Ricardo Alves",
                "empresa": "WLM Scania BH",
                "mensagem": "Precisamos revisar o sistema de separação de óleo na nossa unidade.",
            },
            "analise": {
                "intencao": "Necessidade técnica",
                "urgencia": 8,
                "proxima_acao": "Enviar proposta técnica de separadores Pedra Tech.",
                "resposta_sugerida": "Olá Ricardo, entendemos a necessidade. Nossa equipe Pedra Tech pode fazer uma visita técnica esta semana?",
                "classificacao": "Quente",
            },
        },
    ],
    "negocios": [
        {"titulo": "Volvo Rondonópolis", "empresa": "Nors Volvo", "valor": 2500000, "valor_formatado": "R$ 2.500.000", "status": "aberto", "responsavel": "Jaasiel"},
        {"titulo": "Scania Belo Horizonte", "empresa": "WLM Scania", "valor": 1800000, "valor_formatado": "R$ 1.800.000", "status": "aberto", "responsavel": "Jaasiel"},
    ],
    "melhorias": [
        {"area": "Campanhas",  "titulo": "Melhorar acompanhamento",  "descricao": "Negócios sem próxima ação precisam ser priorizados.", "prioridade": "alta"},
        {"area": "Lemlist",    "titulo": "Revisar abordagem Lemlist", "descricao": "Campanhas devem comparar desempenho com o mercado.",  "prioridade": "média"},
        {"area": "Sofia IA",   "titulo": "Ativar análise Sofia IA",   "descricao": "Sugestões devem passar pelos agentes antes da aprovação.", "prioridade": "normal"},
    ],
    "benchmarks": {
        "taxa_resposta_media": "8%",
        "taxa_resposta_boa": "12%",
        "taxa_resposta_excelente": "18%",
        "resposta_positiva_media": "3%",
        "resposta_positiva_boa": "6%",
        "taxa_reuniao_media": "1%",
        "taxa_reuniao_excelente": "5%",
    },
}

# ── Rotas ────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "ok": True,
        "app": "Internal Sales Automation - Grupo Pedra",
        "env": {
            "openai_configurado": bool(os.getenv("OPENAI_API_KEY")),
            "pipedrive_configurado": bool(os.getenv("PIPEDRIVE_API_KEY")),
            "lemlist_configurado": bool(os.getenv("LEMLIST_API_KEY")),
        },
    }


@app.get("/dashboard/full")
def dashboard_full():
    # Dados reais das APIs
    campaigns  = fetch_lemlist_campaigns()
    deals      = fetch_pipedrive_deals()
    activities = fetch_pipedrive_activities()

    # Fallback para mock se APIs retornarem vazio
    if not campaigns:
        campaigns = [
            {"id": "mock1", "name": c["nome"], "status": c["status"], "createdAt": c["criado_em"], "archived": False}
            for c in MOCK_DATA["campanhas"]
        ]
    if not deals:
        deals = [
            {"id": i, "title": n["titulo"], "org_name": n["empresa"], "person_name": "",
             "owner_name": n["responsavel"], "value": n["valor"], "formatted_value": n["valor_formatado"],
             "status": n["status"], "next_activity_subject": "", "next_activity_note": "",
             "add_time": "", "update_time": ""}
            for i, n in enumerate(MOCK_DATA["negocios"])
        ]

    total_pipeline = sum(float(d.get("value") or 0) for d in deals)
    aprovacoes     = MOCK_DATA["aprovacoes"]
    melhorias      = MOCK_DATA["melhorias"]

    return {
        "ok": True,
        "fonte": {
            "lemlist":   "api_real" if fetch_lemlist_campaigns() else "mock",
            "pipedrive": "api_real" if fetch_pipedrive_deals()  else "mock",
        },
        "campaigns": {
            "ok":        True,
            "total":     len(campaigns),
            "campaigns": campaigns,
        },
        "approvals": {
            "ok":    True,
            "total": len(aprovacoes),
            "items": [
                {
                    "approval_id": a["id"],
                    "title":       a["titulo"],
                    "description": a["descricao"],
                    "lead": {
                        "lead_name":    a["lead"]["nome"],
                        "company_name": a["lead"]["empresa"],
                        "message":      a["lead"]["mensagem"],
                    },
                    "analysis": {
                        "intent":        a["analise"]["intencao"],
                        "urgency_score": a["analise"]["urgencia"],
                        "next_action":   a["analise"]["proxima_acao"],
                        "reply_ptbr":    a["analise"]["resposta_sugerida"],
                        "deal_label":    a["analise"]["classificacao"],
                    },
                }
                for a in aprovacoes
            ],
        },
        "realtime": {
            "ok": True,
            "pipedrive": {
                "deals":      {"success": True, "data": deals},
                "activities": {"success": True, "data": activities},
                "pipelines":  {"success": True, "data": fetch_pipedrive_pipelines()},
                "persons":    {"success": True, "data": fetch_pipedrive_persons()},
                "campaigns":  {"success": True, "data": fetch_pipedrive_campaigns()},
            },
        },
        "improvements": {
            "ok": True,
            "improvements": [
                {"area": m["area"], "title": m["titulo"], "description": m["descricao"], "priority": m["prioridade"]}
                for m in melhorias
            ],
        },
        "benchmarks": {
            "ok":         True,
            "benchmarks": MOCK_DATA["benchmarks"],
        },
        "pipeline_total": total_pipeline,
        "dados_brutos": {
            "campanhas":  campaigns,
            "negocios":   deals,
            "atividades": activities,
            "aprovacoes": aprovacoes,
            "melhorias":  melhorias,
            "benchmarks": MOCK_DATA["benchmarks"],
        },
    }


# ── Transcrição de áudio (Groq Whisper) ──────────────────────────

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        filename = file.filename or "audio.webm"
        transcription = groq_client.audio.transcriptions.create(
            file=(filename, audio_bytes, file.content_type or "audio/webm"),
            model="whisper-large-v3-turbo",
            language="pt",
            response_format="text",
        )
        text = transcription if isinstance(transcription, str) else transcription.text
        return {"ok": True, "text": text.strip()}
    except Exception as e:
        return {"ok": False, "text": "", "error": str(e)}


# ── Sofia IA ─────────────────────────────────────────────────────

SOFIA_SYSTEM = """
# IDENTIDADE — SOFIA COMERCIAL

Você é Sofia, Arquiteta Comercial do Grupo Pedra.
Não é uma vendedora comum — é uma arquiteta de deals.
Você conhece profundamente o setor de pesados, entende a dor do diretor de pós-venda antes dele mesmo, e usa isso para criar insights que reposicionam a conversa comercial.
Sofia não pede permissão para provocar. Ela ensina, adapta a mensagem e toma controle da negociação.

---

# EMPRESA — GRUPO PEDRA

Três divisões:
- **Pedra Engenharia:** Execução de obras para concessionárias (Volvo, Scania, Iveco, Mercedes), bays de serviço, infraestrutura de pós-venda
- **Pedra Tech:** Suporte técnico especializado, automação, separadores óleo/água, sistemas de lubrificação, valas técnicas. Parceria NORS Caminhões e Ônibus / Rondonópolis-MT
- **Pedra Infra:** Consultoria, projetos, laudos, viabilidade técnica, grandes obras

**Proposta de valor central:** "Inteligência de Fluxo — não vendemos obra, vendemos eficiência operacional."
**Mensagem Pedra Tech:** "Quando seu equipamento para, seu faturamento para. A Pedra Tech existe para isso não acontecer."

---

# ICP — PERFIL IDEAL DO CLIENTE

- Diretor de Pós-venda ou Diretor de Operações
- Concessionária de caminhões, ônibus ou máquinas pesadas (Volvo, Scania, Iveco, Mercedes, John Deere, Foton)
- Empresa com 50+ funcionários
- Dor: baixa eficiência no fluxo de veículos / alta ociosidade de bay / infraestrutura defasada
- Localização: Brasil (foco: MT, GO, SP, MG, RS)
- Sinais de qualificação: menciona "tempo de retorno", "produtividade da oficina", projeto de expansão ou reforma, insatisfação com fornecedor atual

---

# METODOLOGIA — CHALLENGER SALE

Sofia opera 100% com Challenger Sale:

**As 3 fases:**
1. **Teach (Ensinar):** Mostre algo que o prospect não sabe sobre o próprio negócio
   - "Você sabia que a maioria das concessionárias perde X horas/mês por causa de Y?"
2. **Tailor (Personalizar):** Adapte para o perfil e porte específico
   - "Para uma operação do seu porte, o impacto é de R$ Z/ano"
3. **Take Control (Assumir o controle):** Não peça — conduza
   - "Então a pergunta não é SE você vai resolver isso — é QUANDO"

**Antes de qualquer reunião, Sofia pensa:**
"O que esse prospect ainda não sabe sobre o próprio negócio que eu sei?"

**Durante:**
"Não estou aqui para vender. Estou aqui para mostrar o que você está perdendo."

**No follow-up:**
"O silêncio é uma objeção. Vou nomear o que está travando."

---

# OBJEÇÕES E RESPOSTAS CHALLENGER

| Objeção | Reframe |
|---|---|
| "Está caro" | "O que custa mais: a obra ou cada mês sem eficiência?" |
| "Não é o momento" | "O momento certo é antes de perder mais um contrato por capacidade" |
| "Vou pensar" | "O que falta para você tomar a decisão hoje?" |
| "Tenho outro fornecedor" | "Ótimo. Posso te mostrar o que ele não te oferece?" |
| "Preciso consultar a diretoria" | "O que a diretoria vai precisar ver? Posso preparar isso agora." |
| "Não temos budget agora" | "Quando revisam o budget? E o ROI em 90 dias cobre o investimento." |
| "O concorrente é mais barato" | "Mais barato do que o quê? O custo da ineficiência ou a obra?" |

---

# PIPELINE — PIPEDRIVE

| Stage | Critério | Ação |
|---|---|---|
| Prospect | ICP identificado | Primeiro contato enviado |
| Conectado | Respondeu/aceitou conexão | Qualificação agendada |
| Qualificado | BANT confirmado | Reunião de descoberta |
| Proposta | Deal estruturado | Proposta enviada |
| Negociação | Feedback recebido | Follow-up ativo |
| Fechado/Ganho | Contrato assinado | Onboarding iniciado |
| Fechado/Perdido | Sem avanço 30 dias | Nurture passivo |

Deals parados > 7 dias sem atividade são alerta vermelho.

---

# COPYWRITING — VOZ DA MARCA

Tom: técnico, direto, provocador (Challenger Sale)
Evitar: linguagem genérica, promessas vagas, adjetivos sem evidência

✅ Correto: "Cada hora que seu bay fica parado custa R$ X. Nós fechamos esse vazamento."
❌ Errado: "Somos especialistas em infraestrutura de qualidade"

Frameworks: AIDA | PAS | Challenger (Insight → Reframe → Solução) | Before/After/Bridge

---

# LINKEDIN — SEQUÊNCIA DE DM

```
Mensagem 1 (conexão aceita):
"[Nome], obrigado pela conexão. Vi que você está em [cargo] na [empresa] —
exatamente o perfil que a gente mais ajuda. Posso te mostrar algo em 2 minutos?"

Mensagem 2 (+3 dias, sem resposta):
"[Nome], não precisa responder agora — mas quero deixar uma pergunta:
qual é o seu maior gargalo no fluxo de veículos hoje?"

Mensagem 3 (+5 dias):
"Última mensagem, prometo. Preparei um material específico para
concessionárias [porte/tipo]. Vale 5 minutos do seu tempo?"
```

---

# EMAIL — SEQUÊNCIA DE PROSPECÇÃO (5 emails)

```
Email 1 — Insight (Dia 1): Dado técnico + problema nomeado + CTA suave
Email 2 — Prova (Dia 4): Mini case + dado + CTA para conversa
Email 3 — Objeção (Dia 7): Quebra de objeção + reframe + CTA
Email 4 — Urgência (Dia 11): Custo da inação + CTA direto
Email 5 — Breakup (Dia 16): Curto, direto, abre porta para futuro
```

---

# HABILIDADES DISPONÍVEIS

Sofia pode produzir qualquer um destes outputs:

**Estratégia Comercial:**
- Estratégia completa de conta (do primeiro contato ao fechamento)
- Mapa de stakeholders + plano de ataque
- Forecast semanal com deals prioritários
- Script de reunião (abertura, descoberta, pitch, fechamento)
- Plano de objeções mapeadas e respondidas

**Copy e Mensagens:**
- Mensagem LinkedIn DM (conexão, follow-up, breakup)
- Email frio ou sequência completa (5 emails)
- WhatsApp comercial (primeiro contato / follow-up)
- Post LinkedIn (insight challenger, case, pergunta provocadora)
- Proposta executiva de 1-3 páginas

**Análise e Relatórios:**
- Análise de campanhas Lemlist
- Relatório de pipeline Pipedrive
- Lista de deals parados (sem atividade)
- Benchmarks de mercado B2B
- Diagnóstico comercial do Grupo Pedra

**CRM:**
- Próximas ações priorizadas por deal
- Template de nota de reunião para Pipedrive
- Sugestão de automação no CRM
- Relatório de deals por stage

---

# REGRAS DE RESPOSTA

- Sempre em português brasileiro
- Tom Challenger: direto, sem rodeios, baseado em dados e provocação estratégica
- Quando criar mensagem: entregue pronta para copiar e usar
- Quando analisar: comece pelo problema real, depois a solução
- Quando houver dados do dashboard disponíveis: use-os na resposta
- Nunca diga "posso ajudar" sem já começar a ajudar na mesma resposta
- Formato: use markdown com **negrito**, listas e headers quando ajudar a leitura
"""


class ChatMessage(BaseModel):
    message: str
    context: dict = {}
    approve_action: dict = {}   # preenchido quando usuário aprova ação pendente

# ── Ferramentas Pipedrive para Sofia ────────────────────────────────
SOFIA_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "criar_tarefa_pipedrive",
            "description": "Cria uma tarefa ou atividade no Pipedrive. Use quando identificar lead quente ou próxima ação clara.",
            "parameters": {
                "type": "object",
                "properties": {
                    "subject":  {"type": "string",  "description": "Título da tarefa (ex: 'Follow-up consultivo — Nors Volvo')"},
                    "note":     {"type": "string",  "description": "Contexto detalhado: lead, empresa, mensagem, próxima ação"},
                    "type":     {"type": "string",  "enum": ["task", "call", "meeting", "email"], "description": "Tipo de atividade"},
                    "due_date": {"type": "string",  "description": "Data de vencimento YYYY-MM-DD (opcional)"},
                },
                "required": ["subject", "note", "type"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "criar_negocio_pipedrive",
            "description": "Cria um novo negócio no Pipedrive. Use quando lead estiver qualificado e pronto para pipeline.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title":    {"type": "string", "description": "Título do negócio (ex: 'Grupo Canopus — Pedra Engenharia')"},
                    "org_name": {"type": "string", "description": "Nome da empresa/concessionária"},
                    "value":    {"type": "number", "description": "Valor estimado em reais (opcional)"},
                    "note":     {"type": "string", "description": "Contexto do negócio e histórico"},
                },
                "required": ["title"],
            },
        },
    },
]


def sofia_responder(pergunta: str) -> str:
    """Sofia local — responde com dados reais do dashboard."""
    q = pergunta.lower()
    campanhas = MOCK_DATA["campanhas"]
    negocios  = MOCK_DATA["negocios"]
    aprovacoes = MOCK_DATA["aprovacoes"]
    melhorias  = MOCK_DATA["melhorias"]

    # ── Campanhas ─────────────────────────────────────────────────
    if any(p in q for p in ["campanha", "lemlist", "prospecção", "prospeccao"]):
        ativas  = [c for c in campanhas if c["status"] == "ativo"]
        pausadas = [c for c in campanhas if c["status"] == "pausado"]
        total = len(campanhas)
        linhas = "\n".join(f"• {c['nome']} — {c['status'].upper()}" for c in campanhas)
        resposta = (
            f"📊 **Campanhas Lemlist — Grupo Pedra**\n\n"
            f"{linhas}\n\n"
            f"**Resumo:** {total} campanhas no total. "
            f"{len(ativas)} ativas e {len(pausadas)} pausadas.\n\n"
        )
        if ativas:
            resposta += (
                f"✅ **Recomendação:** As campanhas ativas estão rodando. "
                f"Monitore as taxas de resposta e compare com o benchmark do mercado (8% média, 12% bom, 18% excelente). "
                f"Campanhas pausadas devem ser revisadas antes de reativar."
            )
        return resposta

    # ── Pipedrive / Negócios ───────────────────────────────────────
    if any(p in q for p in ["negócio", "negocio", "pipedrive", "pipeline", "crm", "venda"]):
        total_valor = sum(n["valor"] for n in negocios)
        abertos = [n for n in negocios if n["status"] == "aberto"]
        linhas = "\n".join(
            f"• {n['titulo']} ({n['empresa']}) — {n['valor_formatado']}"
            for n in negocios
        )
        return (
            f"💼 **Pipeline Comercial — Pipedrive**\n\n"
            f"{linhas}\n\n"
            f"**Total em pipeline:** R$ {total_valor:,.0f}\n"
            f"**Negócios abertos:** {len(abertos)}\n\n"
            f"⚡ **Próximo passo:** Verifique se todos os negócios têm próxima atividade agendada. "
            f"Negócios sem follow-up perdem temperatura rápido no ciclo B2B de concessionárias."
        )

    # ── Aprovações / Ações CRM ────────────────────────────────────
    if any(p in q for p in ["aprovação", "aprovacao", "ação", "acao", "pendente", "aprovar"]):
        if not aprovacoes:
            return "✅ Nenhuma ação pendente no momento. Todas as aprovações foram processadas."
        linhas = "\n".join(
            f"• {a['titulo']} — Lead: {a['lead']['nome']} ({a['lead']['empresa']})\n"
            f"  Urgência: {a['analise']['urgencia']}/10 | {a['analise']['intencao']}"
            for a in aprovacoes
        )
        return (
            f"⚡ **Ações Pendentes de Aprovação**\n\n"
            f"{linhas}\n\n"
            f"⚠️ **Importante:** Nenhuma ação é executada no CRM sem sua aprovação. "
            f"Acesse a aba 'Ações do CRM' para aprovar ou ignorar cada item."
        )

    # ── Melhorias / Relatório ─────────────────────────────────────
    if any(p in q for p in ["melhoria", "relatório", "relatorio", "sugestão", "sugestao", "recomendação"]):
        altas = [m for m in melhorias if m["prioridade"] == "alta"]
        linhas = "\n".join(
            f"• [{m['prioridade'].upper()}] {m['titulo']}: {m['descricao']}"
            for m in melhorias
        )
        return (
            f"📈 **Relatório de Melhorias Comerciais**\n\n"
            f"{linhas}\n\n"
            f"🔴 **{len(altas)} melhorias de alta prioridade** precisam de atenção imediata."
        )

    # ── Mensagem / WhatsApp / LinkedIn ────────────────────────────
    if any(p in q for p in ["mensagem", "whatsapp", "linkedin", "email", "e-mail", "texto", "escreve", "escrever"]):
        return (
            f"✍️ **Criando mensagem comercial — Grupo Pedra**\n\n"
            f"Para qual nicho é a mensagem?\n\n"
            f"• **Gerentes de Pós-venda** → foco em eficiência operacional\n"
            f"• **Diretores de Concessionária** → foco em ROI e infraestrutura\n"
            f"• **Compras e Suprimentos** → foco em custo e padronização\n"
            f"• **Máquinas Amarelas** → foco em manutenção e separadores\n\n"
            f"Me diga o nicho e o canal (WhatsApp, LinkedIn ou e-mail) que gero a mensagem completa."
        )

    # ── Benchmark / Taxa ──────────────────────────────────────────
    if any(p in q for p in ["benchmark", "taxa", "média", "media", "mercado", "indicador"]):
        b = MOCK_DATA["benchmarks"]
        return (
            f"📊 **Benchmarks do Mercado B2B**\n\n"
            f"**Taxa de Resposta:**\n"
            f"  Média: {b['taxa_resposta_media']} | Boa: {b['taxa_resposta_boa']} | Excelente: {b['taxa_resposta_excelente']}\n\n"
            f"**Resposta Positiva:**\n"
            f"  Média: {b['resposta_positiva_media']} | Boa: {b['resposta_positiva_boa']}\n\n"
            f"**Taxa de Reunião:**\n"
            f"  Média: {b['taxa_reuniao_media']} | Excelente: {b['taxa_reuniao_excelente']}\n\n"
            f"💡 Use esses números para avaliar se suas campanhas Lemlist estão performando acima ou abaixo do mercado."
        )

    # ── Quem é Sofia / apresentação ───────────────────────────────
    if any(p in q for p in ["quem", "sofia", "você", "voce", "apresenta", "olá", "ola", "oi"]):
        return (
            f"Olá! Sou **Sofia**, Assistente Comercial IA do Grupo Pedra. 👋\n\n"
            f"Posso ajudar com:\n"
            f"• Análise de campanhas Lemlist\n"
            f"• Resumo dos negócios do Pipedrive\n"
            f"• Revisão de ações pendentes no CRM\n"
            f"• Relatório de melhorias comerciais\n"
            f"• Criação de mensagens para WhatsApp, LinkedIn e e-mail\n"
            f"• Benchmarks do mercado B2B\n\n"
            f"O que deseja analisar hoje?"
        )

    # ── Relatório executivo ───────────────────────────────────────
    if any(p in q for p in ["relatório executivo", "relatorio executivo", "resumo", "visão geral", "visao geral"]):
        total_pipeline = sum(n["valor"] for n in negocios)
        ativas = len([c for c in campanhas if c["status"] == "ativo"])
        return (
            f"📋 **Relatório Executivo — Grupo Pedra**\n\n"
            f"**Campanhas Lemlist:** {len(campanhas)} total | {ativas} ativas\n"
            f"**Pipeline Pipedrive:** R$ {total_pipeline:,.0f} em {len(negocios)} negócios abertos\n"
            f"**Ações pendentes:** {len(aprovacoes)} aguardando aprovação\n"
            f"**Melhorias identificadas:** {len(melhorias)} recomendações\n\n"
            f"🔴 **Prioridade imediata:** Revisar as {len(aprovacoes)} ações pendentes no CRM e garantir follow-up nos negócios abertos."
        )

    # ── Default ───────────────────────────────────────────────────
    return (
        f"Entendido! Posso te ajudar com:\n\n"
        f"• **Campanhas** — análise das campanhas Lemlist ativas\n"
        f"• **Negócios** — resumo do pipeline no Pipedrive\n"
        f"• **Ações pendentes** — aprovações aguardando no CRM\n"
        f"• **Melhorias** — recomendações estratégicas\n"
        f"• **Mensagem** — criar texto para WhatsApp, LinkedIn ou e-mail\n"
        f"• **Benchmarks** — taxas do mercado B2B\n"
        f"• **Relatório executivo** — visão geral do comercial\n\n"
        f"Qual desses você quer ver?"
    )


def _build_context() -> str:
    campaigns  = fetch_lemlist_campaigns() or [{"name": c["nome"], "status": c["status"]} for c in MOCK_DATA["campanhas"]]
    deals      = fetch_pipedrive_deals()   or [{"title": n["titulo"], "org_name": n["empresa"], "formatted_value": n["valor_formatado"], "status": n["status"]} for n in MOCK_DATA["negocios"]]
    aprovacoes = MOCK_DATA["aprovacoes"]
    melhorias  = MOCK_DATA["melhorias"]
    total      = sum(float(d.get("value") or 0) for d in deals)
    return f"""
DADOS REAIS DO GRUPO PEDRA:

Campanhas Lemlist ({len(campaigns)} total):
{chr(10).join(f"- {c['name']} | {c['status']} | {c.get('createdAt','')}" for c in campaigns)}

Negócios Pipedrive ({len(deals)} | Pipeline: R$ {total:,.0f}):
{chr(10).join(f"- {d['title']} ({d.get('org_name') or ''}) | {d.get('formatted_value','—')} | {d.get('status','—')} | Próx. ação: {d.get('next_activity_subject') or 'NENHUMA — ALERTA'}" for d in deals)}

Ações pendentes ({len(aprovacoes)}):
{chr(10).join(f"- {a['titulo']} | {a['lead']['nome']} ({a['lead']['empresa']}) | Urgência {a['analise']['urgencia']}/10" for a in aprovacoes)}

Melhorias:
{chr(10).join(f"- [{m['prioridade'].upper()}] {m['titulo']}" for m in melhorias)}

Benchmarks: resposta média 8% / boa 12% / excelente 18%
"""


@app.post("/campaign-chat/message")
def sofia_chat(body: ChatMessage):
    # ── Executar ação aprovada pelo usuário ───────────────────────
    if body.approve_action:
        action = body.approve_action
        fn     = action.get("function")
        args   = action.get("args", {})
        try:
            if fn == "criar_tarefa_pipedrive":
                resp = http.post(
                    f"{PIPEDRIVE_BASE}/activities",
                    params={"api_token": PIPEDRIVE_KEY},
                    json={
                        "subject":  args.get("subject", "Tarefa Sofia"),
                        "type":     args.get("type", "task"),
                        "note":     args.get("note", ""),
                        "due_date": args.get("due_date", ""),
                        "done":     0,
                    },
                    timeout=10,
                )
                resp.raise_for_status()
                d = resp.json().get("data", {})
                _cache.pop("pipedrive_activities", None)
                return {
                    "ok":    True,
                    "reply": f"✅ **Tarefa criada no Pipedrive!**\n\n**{d.get('subject')}**\nID: {d.get('id')}\n\nPode acompanhar diretamente no Pipedrive.",
                    "action_executed": True,
                }

            elif fn == "criar_negocio_pipedrive":
                resp = http.post(
                    f"{PIPEDRIVE_BASE}/deals",
                    params={"api_token": PIPEDRIVE_KEY},
                    json={
                        "title": args.get("title", "Novo Negócio"),
                        "value": args.get("value"),
                        "note":  args.get("note", ""),
                    },
                    timeout=10,
                )
                resp.raise_for_status()
                d = resp.json().get("data", {})
                _cache.pop("pipedrive_deals", None)
                return {
                    "ok":    True,
                    "reply": f"✅ **Negócio criado no Pipedrive!**\n\n**{d.get('title')}**\nID: {d.get('id')}\n\nJá está no pipeline. Adicione a próxima atividade para manter o deal aquecido.",
                    "action_executed": True,
                }
        except Exception as e:
            return {"ok": False, "reply": f"Erro ao executar no Pipedrive: {str(e)}"}

    # ── Resposta normal da Sofia com tool calling ─────────────────
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SOFIA_SYSTEM + "\n\n" + _build_context()},
                {"role": "user",   "content": body.message},
            ],
            tools=SOFIA_TOOLS,
            tool_choice="auto",
            max_tokens=1024,
            temperature=0.7,
        )

        msg = response.choices[0].message

        # Sofia quer executar uma ferramenta Pipedrive
        if msg.tool_calls:
            import json
            tc   = msg.tool_calls[0]
            fn   = tc.function.name
            args = json.loads(tc.function.arguments)

            label = "Criar Tarefa no Pipedrive" if fn == "criar_tarefa_pipedrive" else "Criar Negócio no Pipedrive"
            preview = args.get("subject") or args.get("title", "")
            vencimento = ("\n\nVencimento: " + args["due_date"]) if args.get("due_date") else ""
            nota = args.get("note", "")
            reply_text = f"Identifiquei uma ação para executar no Pipedrive. Confirma?\n\n**{label}:** {preview}\n\n_{nota}_{vencimento}"

            return {
                "ok":             True,
                "reply":          reply_text,
                "pending_action": {"function": fn, "args": args, "label": label, "preview": preview},
            }

        reply = (msg.content or "").strip()
        return {"ok": True, "reply": reply}

    except Exception as e:
        return {"ok": False, "reply": f"Erro Sofia: {str(e)}"}


# ── Aprovações ───────────────────────────────────────────────────

class ApprovalDecision(BaseModel):
    approval_id: str
    decision: str  # "approve" | "ignore"


@app.get("/approvals")
def list_approvals():
    return {"ok": True, "total": len(MOCK_DATA["aprovacoes"]), "items": MOCK_DATA["aprovacoes"]}


@app.post("/approvals/decision")
def approval_decision(body: ApprovalDecision):
    return {
        "ok": True,
        "approval_id": body.approval_id,
        "decision": body.decision,
        "message": f"Ação '{body.decision}' registrada para aprovação {body.approval_id}.",
    }


# ── Criar tarefa no Pipedrive ─────────────────────────────────────

class CreateTask(BaseModel):
    subject: str
    note: str = ""
    deal_id: int = None
    person_id: int = None
    org_id: int = None
    due_date: str = ""          # "YYYY-MM-DD"
    type: str = "task"          # task | call | meeting | email
    lead_name: str = ""
    lead_empresa: str = ""


@app.post("/pipedrive/tasks/create")
def create_pipedrive_task(body: CreateTask):
    try:
        payload = {
            "subject":  body.subject,
            "type":     body.type,
            "note":     body.note or f"Lead quente: {body.lead_name} ({body.lead_empresa})",
            "done":     0,
        }
        if body.deal_id:    payload["deal_id"]    = body.deal_id
        if body.person_id:  payload["person_id"]  = body.person_id
        if body.org_id:     payload["org_id"]      = body.org_id
        if body.due_date:   payload["due_date"]    = body.due_date

        resp = http.post(
            f"{PIPEDRIVE_BASE}/activities",
            params={"api_token": PIPEDRIVE_KEY},
            json=payload,
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data", {})
        _cache.pop("pipedrive_activities", None)  # invalida cache
        return {
            "ok":       True,
            "task_id":  data.get("id"),
            "subject":  data.get("subject"),
            "message":  f"Tarefa '{body.subject}' criada no Pipedrive com sucesso.",
        }
    except Exception as e:
        return {"ok": False, "message": f"Erro ao criar tarefa: {str(e)}"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)
