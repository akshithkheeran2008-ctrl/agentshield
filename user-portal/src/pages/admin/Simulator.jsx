import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, ShieldCheck, ShieldAlert, RotateCcw, ListChecks, AlertOctagon } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { SAMPLE_TASKS } from '../../lib/requests.js'
import { Button, Card, CardHeader, PageHeader, Badge } from '../../components/ui.jsx'
import VerdictCard from '../../components/VerdictCard.jsx'

const SOURCE_OPTIONS = [
  { value: 'user', label: 'I typed / pasted it myself' },
  { value: 'email', label: 'Pasted from an email' },
  { value: 'document', label: 'Pasted from a document' },
  { value: 'web', label: 'Pasted from a web page' },
]

// Three preset attacks, taken from the demo's own sample tasks.
const PRESETS = [
  { id: 'fintech', label: 'Payment Redirect', hint: 'A balance check hijacked into a large transfer' },
  { id: 'exfil', label: 'Exfiltrate Customer Data', hint: 'A request to send customer records outside' },
  { id: 'direct', label: 'Override the Guardrails', hint: 'A message that tries to override the assistant' },
]

function ThreatBanner({ result }) {
  const { scan } = result
  if (scan.level === 'SAFE') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-kelly/40 bg-kelly/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} className="shrink-0 text-kelly-deep dark:text-kelly-soft" />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-kelly-deep dark:text-kelly-soft">NO INJECTION DETECTED</div>
            <div className="text-sm text-ink/65 dark:text-mist/65">This prompt looks safe. The assistant may proceed.</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right"><div className="text-[11px] font-semibold uppercase tracking-wider text-ink/55 dark:text-mist/55">Risk Score</div><div className="font-mono text-2xl font-bold text-kelly-deep dark:text-kelly-soft">{scan.score}/100</div></div>
          <Badge value="SAFE">SAFE</Badge>
        </div>
      </div>
    )
  }
  if (scan.level === 'LOW') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-flame/40 bg-flame/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <ShieldAlert size={28} className="shrink-0 text-flame-deep dark:text-flame-soft" />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-flame-deep dark:text-flame-soft">REVIEW NEEDED — POSSIBLE INJECTION</div>
            <div className="text-sm text-ink/65 dark:text-mist/65">Something looks off, but it is not clearly an attack. An admin will check it.</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right"><div className="text-[11px] font-semibold uppercase tracking-wider text-ink/55 dark:text-mist/55">Risk Score</div><div className="font-mono text-2xl font-bold text-flame-deep dark:text-flame-soft">{scan.score}/100</div></div>
          <Badge value="REVIEW">LOW</Badge>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-crimson/50 bg-crimson/15 px-5 py-4">
      <div className="flex items-center gap-3">
        <AlertOctagon size={28} className="shrink-0 text-crimson-deep dark:text-crimson-soft" />
        <div>
          <div className="text-lg font-extrabold tracking-tight text-crimson-deep dark:text-crimson-soft">PROMPT INJECTION DETECTED</div>
          <div className="text-sm text-ink/65 dark:text-mist/65">Malicious instructions were found. The risky actions were stopped before they ran.</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right"><div className="text-[11px] font-semibold uppercase tracking-wider text-ink/55 dark:text-mist/55">Risk Score</div><div className="font-mono text-2xl font-bold text-crimson-deep dark:text-crimson-soft">{scan.score}/100</div></div>
        <div className="text-right"><div className="text-[11px] font-semibold uppercase tracking-wider text-ink/55 dark:text-mist/55">Severity</div><Badge value={scan.level}>{scan.level}</Badge></div>
      </div>
    </div>
  )
}

export default function Simulator() {
  const { store, submit, decide } = useStore()
  const [text, setText] = useState('')
  const [source, setSource] = useState('user')
  const [error, setError] = useState('')
  const [resultId, setResultId] = useState(null)
  const result = useMemo(
    () => (resultId ? store.requests.find((r) => r.id === resultId) || null : null),
    [store, resultId],
  )

  const loadPreset = (presetId) => {
    const task = SAMPLE_TASKS.find((s) => s.id === presetId)
    if (!task) return
    setText(task.content)
    setSource(task.source)
    setError('')
    setResultId(null)
  }

  const runScan = (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content) {
      setError('Paste a prompt first — any text, from anywhere.')
      return
    }
    setError('')
    const id = submit({
      goal: 'Simulator test — pasted prompt',
      content,
      source,
      resource: undefined,
    })
    if (id) {
      setResultId(id)
      document.getElementById('simulator-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Security Console"
        title="Attack Simulator"
        subtitle="Run a prompt through the same check a real request gets — and see exactly what happens."
      />

      <Card>
        <CardHeader icon={FlaskConical} title="Test a prompt" subtitle="Paste any prompt — long, short, from any dataset or document. Line breaks are fine." />
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p.id} size="sm" onClick={() => loadPreset(p.id)} title={p.hint}>
                {p.label}
              </Button>
            ))}
          </div>
          <form onSubmit={runScan} className="mt-4 space-y-3">
            <div>
              <label htmlFor="sim-text" className="mb-1 block text-xs font-medium text-ink/60 dark:text-mist/60">Paste untrusted content or prompt</label>
              <textarea
                id="sim-text"
                className="input min-h-48"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the prompt here — for example a message from a dataset, a document, or an email."
              />
            </div>
            <div>
              <label htmlFor="sim-source" className="mb-1 block text-xs font-medium text-ink/60 dark:text-mist/60">Where did it come from?</label>
              <select id="sim-source" className="input" value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {error && <p className="text-sm font-medium text-crimson-deep dark:text-crimson-soft">{error}</p>}
            <Button type="submit" variant="primary" size="lg" icon={ShieldCheck}>RUN SECURITY SCAN</Button>
          </form>
          <p className="mt-3 text-sm text-ink/60 dark:text-mist/60">
            Every test is saved as a request, and anything risky goes to the{' '}
            <Link to="/admin/queue" className="font-semibold text-aqua-deep dark:text-aqua-soft underline">Approval Queue</Link>{' '}
            — exactly like a real request.
          </p>
        </div>
      </Card>

      {result && (
        <div id="simulator-result" className="scroll-mt-4 space-y-4">
          <ThreatBanner result={result} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-ink dark:text-white">Result — {result.id}</h2>
            <span className="flex gap-2">
              <Link to={`/admin/requests/${result.id}`}>
                <Button variant="ghost" size="sm" icon={ListChecks}>Full detail</Button>
              </Link>
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => { setResultId(null); setText('') }}>
                Test another
              </Button>
            </span>
          </div>
          <VerdictCard request={result} showAdminActions onDecide={decide} />
        </div>
      )}
    </div>
  )
}
