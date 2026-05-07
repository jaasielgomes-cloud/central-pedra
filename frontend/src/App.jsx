import { useEffect, useRef, useState } from 'react'
import './App.css'

const STATUS_MAP = {
  // English (legacy)
  running: { label: 'Ativo',     cls: 'badge-running' },
  paused:  { label: 'Pausado',   cls: 'badge-paused'  },
  draft:   { label: 'Rascunho',  cls: 'badge-draft'   },
  open:    { label: 'Aberto',    cls: 'badge-running' },
  won:     { label: 'Ganho',     cls: 'badge-won'     },
  lost:    { label: 'Perdido',   cls: 'badge-lost'    },
  // Português
  ativo:    { label: 'Ativo',    cls: 'badge-running' },
  pausado:  { label: 'Pausado',  cls: 'badge-paused'  },
  rascunho: { label: 'Rascunho', cls: 'badge-draft'   },
  aberto:   { label: 'Aberto',   cls: 'badge-running' },
  ganho:    { label: 'Ganho',    cls: 'badge-won'     },
  perdido:  { label: 'Perdido',  cls: 'badge-lost'    },
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status || '-', cls: 'badge-draft' }
  return <span className={`status-badge ${s.cls}`}>{s.label}</span>
}

function PriorityDot({ priority }) {
  return <span className={`dot dot-${priority}`}></span>
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard',       icon: '◈' },
  { id: 'lemlist',   label: 'Lemlist',          icon: '✉' },
  { id: 'pipedrive', label: 'Pipedrive',        icon: '◎' },
  { id: 'relatorios',label: 'Relatórios',       icon: '▦' },
  { id: 'acoes',     label: 'Ações do CRM',     icon: '⚡' },
  { id: 'sofia',     label: 'Sofia IA',         icon: '◇' },
  { id: 'consulta',  label: 'Consulta de Dados',icon: '⌕' },
]

export default function App() {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const [sofiaMessages, setSofiaMessages] = useState([
    { role: 'assistant', text: 'Olá! Sou Sofia, Assistente Comercial IA do Grupo Pedra. Posso analisar campanhas, interpretar respostas de leads, sugerir próximas ações no CRM e gerar relatórios executivos. Como posso ajudar?' }
  ])
  const [sofiaInput, setSofiaInput]     = useState('')
  const [sofiaLoading, setSofiaLoading] = useState(false)
  const [recording, setRecording]       = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const chatEndRef    = useRef(null)
  const mediaRecRef   = useRef(null)
  const chunksRef     = useRef([])

  const [consultaInput, setConsultaInput] = useState('')
  const [consultaResult, setConsultaResult] = useState(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/dashboard/full')
      if (!res.ok) throw new Error('Erro HTTP ' + res.status)
      setData(await res.json())
    } catch (err) {
      setError(err.message || 'Falha ao conectar com o backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [sofiaMessages])

  const campaigns    = data?.campaigns?.campaigns || []
  const approvals    = data?.approvals?.items     || []
  const deals          = data?.realtime?.pipedrive?.deals?.data       || []
  const activities     = data?.realtime?.pipedrive?.activities?.data  || []
  const pipelines      = data?.realtime?.pipedrive?.pipelines?.data   || []
  const persons        = data?.realtime?.pipedrive?.persons?.data     || []
  const pipeCampaigns  = data?.realtime?.pipedrive?.campaigns?.data   || []
  const improvements = data?.improvements?.improvements || []
  const messages     = data?.messages?.messages   || []
  const benchmarks   = data?.benchmarks?.benchmarks || {}

  const running = campaigns.filter(c => c.status === 'running').length
  const paused  = campaigns.filter(c => c.status === 'paused').length
  const draft   = campaigns.filter(c => c.status === 'draft').length

  const totalPipeline = deals.reduce((sum, d) => sum + Number(d.value || 0), 0)

  const pct = (n, total) => (total > 0 ? Math.round((n / total) * 100) : 0)

  const sendToSofia = async () => {
    const text = sofiaInput.trim()
    if (!text || sofiaLoading) return
    setSofiaInput('')
    setSofiaMessages(prev => [...prev, { role: 'user', text }])
    setSofiaLoading(true)
    try {
      const res = await fetch('/api/campaign-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      if (json.pending_action) {
        const reply = json.reply || 'Quero executar uma ação no Pipedrive. Confirma?'
        setSofiaMessages(prev => [...prev, {
          role: 'assistant',
          text: reply,
          pendingAction: json.pending_action,
        }])
        speakText(reply)
      } else {
        const reply = json.reply || json.message || json.response || 'Processado.'
        setSofiaMessages(prev => [...prev, { role: 'assistant', text: reply }])
        speakText(reply)
      }
    } catch {
      setSofiaMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Backend indisponível no momento. Verifique se o servidor está rodando em :8080.'
      }])
    } finally {
      setSofiaLoading(false)
    }
  }

  const approveSofiaAction = async (pendingAction, msgIndex) => {
    setSofiaLoading(true)
    // Remove approval card from that message
    setSofiaMessages(prev => prev.map((m, i) =>
      i === msgIndex ? { ...m, pendingAction: null, actionApproved: true } : m
    ))
    try {
      const res = await fetch('/api/campaign-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'execute', approve_action: pendingAction }),
      })
      const json = await res.json()
      setSofiaMessages(prev => [...prev, {
        role: 'assistant',
        text: json.reply || '✅ Ação executada com sucesso no Pipedrive!',
      }])
      await fetchDashboard()
    } catch {
      setSofiaMessages(prev => [...prev, {
        role: 'assistant',
        text: '❌ Erro ao executar ação. Tente novamente.',
      }])
    } finally {
      setSofiaLoading(false)
    }
  }

  const cancelSofiaAction = (msgIndex) => {
    setSofiaMessages(prev => prev.map((m, i) =>
      i === msgIndex ? { ...m, pendingAction: null, actionCancelled: true } : m
    ))
    setSofiaMessages(prev => [...prev, {
      role: 'assistant',
      text: 'Tudo bem, ação cancelada. Como posso ajudar de outra forma?',
    }])
  }

  const speakText = (text) => {
    if (!audioEnabled || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const clean = text.replace(/\*\*/g, '').replace(/[_*#`]/g, '').substring(0, 500)
    const utt = new SpeechSynthesisUtterance(clean)
    utt.lang = 'pt-BR'
    utt.rate = 1.05
    utt.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find(v => v.lang.startsWith('pt'))
    if (ptVoice) utt.voice = ptVoice
    window.speechSynthesis.speak(utt)
  }

  const startRecording = async () => {
    if (recording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const rec = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('file', blob, 'audio.webm')
        setSofiaLoading(true)
        try {
          const res  = await fetch('/api/transcribe', { method: 'POST', body: form })
          const json = await res.json()
          if (json.ok && json.text) {
            setSofiaInput(json.text)
          }
        } catch {
          // silently fail — user can type manually
        } finally {
          setSofiaLoading(false)
        }
      }
      mediaRecRef.current = rec
      rec.start()
      setRecording(true)
    } catch {
      alert('Permita acesso ao microfone nas configurações do navegador.')
    }
  }

  const stopRecording = () => {
    if (mediaRecRef.current && recording) {
      mediaRecRef.current.stop()
      setRecording(false)
    }
  }

  const handleConsulta = () => {
    if (!data) return setConsultaResult('Dados ainda carregando...')
    const q = consultaInput.toLowerCase()
    const brutos = data.dados_brutos || {}
    let result

    if (q.includes('lemlist') || q.includes('campanha'))
      result = brutos.campanhas || data.campaigns
    else if (q.includes('pipedrive') || q.includes('crm') || q.includes('negócio') || q.includes('negocio') || q.includes('negocio') || q.includes('deal'))
      result = brutos.negocios || data.realtime?.pipedrive
    else if (q.includes('aprovação') || q.includes('aprovacao') || q.includes('pendente'))
      result = brutos.aprovacoes || data.approvals
    else if (q.includes('mensagem') || q.includes('message'))
      result = data.messages || brutos
    else if (q.includes('benchmark') || q.includes('indicador') || q.includes('taxa'))
      result = brutos.benchmarks || data.benchmarks
    else if (q.includes('melhoria') || q.includes('relatório') || q.includes('relatorio') || q.includes('sugestão'))
      result = brutos.melhorias || data.improvements
    else if (q.includes('agente') || q.includes('sofia') || q.includes('assistente'))
      result = data.agents || { sofia: 'Sofia — Assistente Comercial IA' }
    else if (q.includes('tudo') || q.includes('completo'))
      result = brutos
    else
      result = brutos

    setConsultaResult(JSON.stringify(result, null, 2))
  }

  const handleApproval = async (item, decision) => {
    try {
      const res = await fetch('/api/approvals/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval_id: item.approval_id || item.id, decision }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      await fetchDashboard()
    } catch (err) {
      alert('Erro ao processar ação: ' + err.message)
    }
  }

  const createTask = async (item) => {
    const lead     = item.lead || {}
    const analysis = item.analysis || {}
    try {
      const res = await fetch('/api/pipedrive/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject:      analysis.next_action || `Follow-up — ${lead.lead_name || 'Lead'}`,
          note:         `Lead: ${lead.lead_name} (${lead.company_name})\nMensagem: ${lead.message}\nIntenção: ${analysis.intent}\nResposta sugerida: ${analysis.reply_ptbr || ''}`,
          type:         'task',
          lead_name:    lead.lead_name    || '',
          lead_empresa: lead.company_name || '',
        }),
      })
      const json = await res.json()
      if (json.ok) {
        alert(`✅ Tarefa criada no Pipedrive!\n"${json.subject}"`)
        await fetchDashboard()
      } else {
        alert('Erro: ' + json.message)
      }
    } catch (err) {
      alert('Erro ao criar tarefa: ' + err.message)
    }
  }

  // ─── RENDERS ────────────────────────────────────────────────────

  const renderDashboard = () => (
    <>
      <div className="page-header">
        <h1>Central Comercial</h1>
        <p className="subtitle">Visão executiva — campanhas, CRM, aprovações e oportunidades em tempo real</p>
      </div>

      <div className="kpi-grid">
        <div className="card kpi-card">
          <span className="kpi-label">Campanhas Lemlist</span>
          <strong className="kpi-value">{campaigns.length}</strong>
          <span className="kpi-sub">{running} ativas · {paused} pausadas · {draft} rascunho</span>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Ações Pendentes</span>
          <strong className="kpi-value kpi-alert">{approvals.length}</strong>
          <span className="kpi-sub">Aguardando aprovação humana</span>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Negócios Pipedrive</span>
          <strong className="kpi-value">{deals.length}</strong>
          <span className="kpi-sub">{deals.filter(d => d.status === 'open').length} abertos</span>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Pipeline Total</span>
          <strong className="kpi-value kpi-green">
            R$ {totalPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </strong>
          <span className="kpi-sub">Valor estimado em negócios ativos</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Status das Campanhas</h2>
          {[
            { label: 'Ativas',    count: running, total: campaigns.length },
            { label: 'Pausadas',  count: paused,  total: campaigns.length },
            { label: 'Rascunho', count: draft,   total: campaigns.length },
          ].map(row => (
            <div className="bar-row" key={row.label}>
              <span>{row.label}</span>
              <div className="bar">
                <div style={{ width: pct(row.count, row.total) + '%' }} />
              </div>
              <strong>{row.count}</strong>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Top Negócios</h2>
          {deals.slice(0, 4).map((deal, i) => (
            <div className="mini-deal" key={i}>
              <div className="mini-deal-info">
                <strong>{deal.title || 'Negócio'}</strong>
                <span>{deal.org_name || deal.person_name || '—'}</span>
              </div>
              <span className="deal-value">
                {deal.formatted_value || (deal.value ? 'R$ ' + Number(deal.value).toLocaleString('pt-BR') : '—')}
              </span>
            </div>
          ))}
          {deals.length === 0 && <p className="empty-msg">Nenhum negócio carregado.</p>}
        </div>

        <div className="card">
          <h2>Funil Comercial</h2>
          <div className="funnel">
            {['Leads Captados', 'Respostas', 'Reuniões', 'Propostas', 'Vendas'].map((label, i) => (
              <div
                key={i}
                className={`funnel-step${i === 4 ? ' funnel-final' : ''}`}
                style={{ width: (100 - i * 15) + '%' }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Melhorias Prioritárias</h2>
          {improvements.slice(0, 3).map((item, i) => (
            <div className={`priority-item priority-${item.priority || 'normal'}`} key={i}>
              <PriorityDot priority={item.priority || 'normal'} />
              <div>
                <strong>{item.title || item.area || 'Melhoria'}</strong>
                <p>{item.recommendation || item.description || ''}</p>
              </div>
            </div>
          ))}
          {improvements.length === 0 && <p className="empty-msg">Sem melhorias registradas.</p>}
        </div>
      </div>
    </>
  )

  const renderLemlist = () => (
    <>
      <div className="page-header">
        <h1>Lemlist — Campanhas</h1>
        <p className="subtitle">{campaigns.length} campanhas encontradas na conta</p>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome da Campanha</th>
              <th>Status</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr><td colSpan={3} className="empty-cell">Nenhuma campanha carregada.</td></tr>
            )}
            {campaigns.map((c, i) => (
              <tr key={c._id || c.id || i}>
                <td>
                  <strong>{c.name || c.title || 'Campanha sem nome'}</strong>
                  {c.archived && <span className="tag-archived">Arquivada</span>}
                </td>
                <td><StatusBadge status={c.status} /></td>
                <td className="text-secondary">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  const renderPipedrive = () => {
    const semAcao = deals.filter(d => !d.next_activity_subject && d.status === 'aberto')
    const totalPipeline = deals.reduce((s, d) => s + Number(d.value || 0), 0)

    return (
      <>
        <div className="page-header">
          <h1>Pipedrive — CRM Completo</h1>
          <p className="subtitle">{deals.length} negócios · {activities.length} atividades · Pipeline R$ {totalPipeline.toLocaleString('pt-BR', {minimumFractionDigits: 0})}</p>
        </div>

        {semAcao.length > 0 && (
          <div className="card alert-banner">
            <span className="alert-icon">⚠️</span>
            <strong>{semAcao.length} negócio(s) sem próxima ação agendada:</strong>
            {semAcao.map((d, i) => (
              <span key={i} className="alert-deal">{d.title}</span>
            ))}
          </div>
        )}

        <div className="card section-block">
          <h2>Negócios</h2>
          <table>
            <thead>
              <tr>
                <th>Negócio</th>
                <th>Empresa</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Próxima Ação</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {deals.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">Nenhum negócio carregado.</td></tr>
              )}
              {deals.map((deal, i) => (
                <tr key={deal.id || i} className={!deal.next_activity_subject && deal.status === 'aberto' ? 'row-alert' : ''}>
                  <td>
                    <strong>{deal.title || 'Negócio sem título'}</strong>
                    {!deal.next_activity_subject && deal.status === 'aberto' && (
                      <span className="tag-warning">Sem próxima ação</span>
                    )}
                  </td>
                  <td>{deal.org_name || deal.person_name || '—'}</td>
                  <td className="deal-value-cell">
                    {deal.formatted_value || (deal.value ? 'R$ ' + Number(deal.value).toLocaleString('pt-BR') : '—')}
                  </td>
                  <td><StatusBadge status={deal.status} /></td>
                  <td className="text-secondary">
                    {deal.next_activity_subject || '—'}
                    {deal.next_activity_note && <span className="note-text">{deal.next_activity_note}</span>}
                  </td>
                  <td className="text-secondary">{deal.owner_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activities.length > 0 && (
          <div className="card section-block">
            <h2>Atividades Pendentes</h2>
            <table>
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Negócio</th>
                  <th>Empresa</th>
                  <th>Tipo</th>
                  <th>Vencimento</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={a.id || i}>
                    <td><strong>{a.subject || '—'}</strong>
                      {a.note && <span className="note-text">{a.note}</span>}
                    </td>
                    <td>{a.deal_title || '—'}</td>
                    <td className="text-secondary">{a.org_name || a.person_name || '—'}</td>
                    <td><span className="status-badge badge-draft">{a.type || '—'}</span></td>
                    <td className="text-secondary">{a.due_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {persons.length > 0 && (
          <div className="card section-block">
            <h2>Contatos ({persons.length})</h2>
            <table>
              <thead>
                <tr><th>Nome</th><th>Empresa</th><th>E-mail</th><th>Negócios Abertos</th></tr>
              </thead>
              <tbody>
                {persons.slice(0, 20).map((p, i) => (
                  <tr key={p.id || i}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.org_name || '—'}</td>
                    <td className="text-secondary">{p.email || '—'}</td>
                    <td>{p.open_deals_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pipeCampaigns.length > 0 ? (
          <div className="card section-block">
            <h2>Campanhas Pipedrive ({pipeCampaigns.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Enviados</th>
                  <th>Abertos</th>
                  <th>Clicados</th>
                  <th>Descadastros</th>
                  <th>Envio</th>
                </tr>
              </thead>
              <tbody>
                {pipeCampaigns.map((c, i) => {
                  const taxaAbertura = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0
                  const taxaClique   = c.sent > 0 ? Math.round((c.clicked / c.sent) * 100) : 0
                  return (
                    <tr key={c.id || i}>
                      <td><strong>{c.name}</strong></td>
                      <td className="text-secondary">{c.subject || '—'}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>{c.sent || 0}</td>
                      <td>
                        {c.opened || 0}
                        {c.sent > 0 && <span className="pct-tag">{taxaAbertura}%</span>}
                      </td>
                      <td>
                        {c.clicked || 0}
                        {c.sent > 0 && <span className="pct-tag">{taxaClique}%</span>}
                      </td>
                      <td>{c.unsubscribed || 0}</td>
                      <td className="text-secondary">
                        {c.send_time ? new Date(c.send_time).toLocaleDateString('pt-BR') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card section-block">
            <h2>Campanhas Pipedrive</h2>
            <p className="empty-msg">
              Nenhuma campanha encontrada. O módulo de Campanhas do Pipedrive requer o add-on "Campaigns" ativo na conta.
            </p>
          </div>
        )}
      </>
    )
  }

  const renderRelatorios = () => (
    <>
      <div className="page-header">
        <h1>Relatórios Comerciais</h1>
        <p className="subtitle">Análise estratégica e recomendações geradas pela Central Pedra</p>
      </div>

      {messages.length > 0 && (
        <div className="card section-block">
          <h2>Mensagens em Análise</h2>
          <table>
            <thead>
              <tr><th>Mensagem</th><th>Canal</th><th>Campanha</th><th>Enviadas</th><th>Respostas</th></tr>
            </thead>
            <tbody>
              {messages.map((m, i) => (
                <tr key={m.id || i}>
                  <td><strong>{m.name || m.title || 'Mensagem'}</strong></td>
                  <td>{m.channel || m.canal || '—'}</td>
                  <td className="text-secondary">{m.campaign || m.campanha || '—'}</td>
                  <td>{m.sent ?? '—'}</td>
                  <td>{m.replies ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(benchmarks).length > 0 && (
        <div className="card section-block">
          <h2>Benchmarks do Mercado</h2>
          <div className="benchmark-grid">
            {[
              { label: 'Taxa de Resposta (Média)', value: benchmarks.reply_rate_avg + '%', sub: 'Acima de ' + benchmarks.reply_rate_good + '% é bom' },
              { label: 'Resposta Positiva (Média)', value: benchmarks.positive_reply_avg + '%', sub: 'Meta: ' + benchmarks.positive_reply_good + '%' },
              { label: 'Taxa de Reunião (Média)', value: benchmarks.meeting_rate_avg + '%', sub: 'Excelente: ' + benchmarks.meeting_rate_excellent + '%' },
            ].map((b, i) => (
              <div className="benchmark-card" key={i}>
                <span>{b.label}</span>
                <strong>{b.value}</strong>
                <small>{b.sub}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="report-grid">
        {improvements.map((item, i) => (
          <div className={`card report-card priority-${item.priority || 'normal'}`} key={i}>
            <div className="report-card-header">
              <h3>{item.title || item.area || 'Melhoria'}</h3>
              <span className={`badge-priority badge-${item.priority || 'normal'}`}>
                {item.priority || 'normal'}
              </span>
            </div>
            {item.recommendation && (
              <p className="recommendation"><strong>Recomendação:</strong> {item.recommendation}</p>
            )}
            {item.description && <p>{item.description}</p>}
            {item.reason && <p className="reason-text"><em>{item.reason}</em></p>}
          </div>
        ))}
        {improvements.length === 0 && (
          <div className="card"><p className="empty-msg">Sem melhorias registradas.</p></div>
        )}
      </div>
    </>
  )

  const renderAcoes = () => (
    <>
      <div className="page-header">
        <h1>Ações do CRM</h1>
        <p className="subtitle">Toda ação no CRM requer aprovação humana antes de ser executada</p>
      </div>

      {approvals.length === 0 && (
        <div className="card empty-state">
          <span className="empty-icon">✓</span>
          <h3>Nenhuma ação pendente</h3>
          <p>Todas as aprovações foram processadas.</p>
        </div>
      )}

      {approvals.map((item, i) => {
        const lead     = item.lead || {}
        const analysis = item.analysis || {}
        return (
          <div className="card approval-card" key={item.approval_id || item.id || i}>
            <div className="approval-header">
              <div>
                <h3>{lead.lead_name || item.title || 'Lead sem nome'}</h3>
                <span className="company-name">{lead.company_name || '—'}</span>
              </div>
              {analysis.urgency_score !== undefined && (
                <span className="urgency-badge">Urgência {analysis.urgency_score}/10</span>
              )}
            </div>

            {lead.message && (
              <div className="lead-message">
                <strong>Mensagem do Lead:</strong>
                <p>"{lead.message}"</p>
              </div>
            )}

            <div className="analysis-grid">
              {analysis.intent && (
                <div className="analysis-item">
                  <span>Intenção</span>
                  <strong>{analysis.intent}</strong>
                </div>
              )}
              {analysis.next_action && (
                <div className="analysis-item">
                  <span>Próxima Ação</span>
                  <strong>{analysis.next_action}</strong>
                </div>
              )}
              {analysis.deal_label && (
                <div className="analysis-item">
                  <span>Classificação</span>
                  <strong>{analysis.deal_label}</strong>
                </div>
              )}
              {analysis.specialist && (
                <div className="analysis-item">
                  <span>Especialista</span>
                  <strong>{analysis.specialist}</strong>
                </div>
              )}
            </div>

            {analysis.reply_ptbr && (
              <div className="suggested-reply">
                <strong>Resposta Sugerida:</strong>
                <p>{analysis.reply_ptbr}</p>
              </div>
            )}

            {!analysis.reply_ptbr && (item.description || item.action) && (
              <p className="item-desc">{item.description || item.action}</p>
            )}

            <div className="approval-actions">
              <button className="btn-approve" onClick={() => handleApproval(item, 'approve')}>
                ✓ Aprovar Ação
              </button>
              <button className="btn-task" onClick={() => createTask(item)}>
                ＋ Criar Tarefa no Pipedrive
              </button>
              <button className="btn-review" onClick={() => setActiveTab('sofia')}>
                ◇ Revisar com Sofia
              </button>
              <button className="btn-ignore" onClick={() => handleApproval(item, 'ignore')}>
                ✕ Ignorar
              </button>
            </div>
          </div>
        )
      })}
    </>
  )

  const renderSofia = () => (
    <>
      <div className="page-header">
        <h1>Sofia — Assistente Comercial IA</h1>
        <p className="subtitle">Análise de campanhas, sugestão de mensagens e orientação estratégica</p>
      </div>

      <div className="card chat-container">
        <div className="chat-messages">
          {sofiaMessages.map((msg, i) => (
            <div key={i} className={`chat-bubble chat-${msg.role}`}>
              {msg.role === 'assistant' && (
                <span className="chat-avatar">S</span>
              )}
              <div className="chat-text-wrap">
                <div className="chat-text">{msg.text}</div>

                {msg.pendingAction && (
                  <div className="pending-action-card">
                    <div className="pending-action-header">
                      <span className="pending-icon">⚡</span>
                      <strong>{msg.pendingAction.label || 'Ação no Pipedrive'}</strong>
                    </div>
                    {msg.pendingAction.preview && (
                      <div className="pending-preview">
                        {Object.entries(msg.pendingAction.preview).map(([k, v]) => (
                          <div key={k} className="pending-preview-row">
                            <span>{k}:</span> <strong>{String(v)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="pending-action-buttons">
                      <button
                        className="btn-confirm-action"
                        onClick={() => approveSofiaAction(msg.pendingAction, i)}
                      >
                        ✓ Confirmar e Criar no Pipedrive
                      </button>
                      <button
                        className="btn-cancel-action"
                        onClick={() => cancelSofiaAction(i)}
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {msg.actionApproved && (
                  <div className="action-status action-approved">✅ Ação confirmada — executando...</div>
                )}
                {msg.actionCancelled && (
                  <div className="action-status action-cancelled">✕ Ação cancelada</div>
                )}
              </div>
            </div>
          ))}
          {sofiaLoading && (
            <div className="chat-bubble chat-assistant">
              <span className="chat-avatar">S</span>
              <div className="chat-text chat-loading">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-suggestions">
          {[
            'Analise as campanhas Lemlist',
            'Qual campanha está melhor?',
            'Gere relatório executivo',
            'Como melhorar a taxa de resposta?',
          ].map(s => (
            <button
              key={s}
              className="suggestion-chip"
              onClick={() => { setSofiaInput(s); }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <button
            className={`btn-mic ${recording ? 'btn-mic-active' : ''}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            title="Segure para falar"
            disabled={sofiaLoading}
          >
            {recording ? '⏹' : '🎙'}
          </button>

          <input
            value={sofiaInput}
            onChange={e => setSofiaInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendToSofia()}
            placeholder={recording ? 'Gravando... solte para transcrever' : 'Pergunte para Sofia ou segure 🎙'}
            disabled={sofiaLoading}
          />

          <button
            className={`btn-audio-toggle ${audioEnabled ? 'btn-audio-on' : 'btn-audio-off'}`}
            onClick={() => { window.speechSynthesis.cancel(); setAudioEnabled(v => !v) }}
            title={audioEnabled ? 'Desativar voz da Sofia' : 'Ativar voz da Sofia'}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>

          <button
            className="btn-send"
            onClick={sendToSofia}
            disabled={sofiaLoading || !sofiaInput.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  )

  const renderConsulta = () => (
    <>
      <div className="page-header">
        <h1>Consulta de Dados</h1>
        <p className="subtitle">Acesso direto aos dados brutos de Lemlist, Pipedrive, aprovações e mais</p>
      </div>

      <div className="card consulta-tips">
        <strong>Exemplos de consulta:</strong>
        <div className="tip-chips">
          {[
            'mostre campanhas do Lemlist',
            'liste negócios do Pipedrive',
            'aprovações pendentes',
            'mensagens',
            'benchmarks',
            'melhorias',
          ].map(t => (
            <button
              key={t}
              className="tip-chip"
              onClick={() => { setConsultaInput(t); }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="consulta-input-row">
          <input
            value={consultaInput}
            onChange={e => setConsultaInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConsulta()}
            placeholder="Digite o que deseja consultar..."
          />
          <button className="btn-consultar" onClick={handleConsulta}>Consultar</button>
        </div>

        {consultaResult && (
          <pre className="json-output">{consultaResult}</pre>
        )}

        {!consultaResult && (
          <p className="empty-msg">Digite uma consulta e pressione Enter ou clique em Consultar.</p>
        )}
      </div>
    </>
  )

  // ─── ROOT RENDER ─────────────────────────────────────────────────

  const renderContent = () => {
    if (loading) return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Carregando Central Pedra...</p>
      </div>
    )

    if (error) return (
      <div className="card error-card">
        <h2>Falha na conexão</h2>
        <p>{error}</p>
        <p className="error-hint">Verifique se o backend está rodando: <code>uvicorn app:app --port 8080</code></p>
        <button onClick={fetchDashboard}>Tentar novamente</button>
      </div>
    )

    switch (activeTab) {
      case 'lemlist':   return renderLemlist()
      case 'pipedrive': return renderPipedrive()
      case 'relatorios':return renderRelatorios()
      case 'acoes':     return renderAcoes()
      case 'sofia':     return renderSofia()
      case 'consulta':  return renderConsulta()
      default:          return renderDashboard()
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo-grupo-pedra.png" alt="Grupo Pedra" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <span className="brand-name">GRUPO PEDRA</span>
            <span className="brand-sub">Central Comercial</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeTab === item.id ? ' nav-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'acoes' && approvals.length > 0 && (
                <span className="nav-badge">{approvals.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-refresh" onClick={fetchDashboard} disabled={loading}>
            {loading ? '...' : '↺ Atualizar'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}
