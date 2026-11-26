import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, ShieldCheck, RotateCcw, ListChecks } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { SAMPLE_TASKS } from '../../lib/requests.js'
import { LivePill } from '../../components/ui.jsx'
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Attack Simulator</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Run a prompt through the same check a real request gets — and see exactly what happens.</p>
        </div>
        <LivePill />
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Test a prompt</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Paste any prompt — long, short, from any dataset or document. Line breaks are fine.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className="btn btn-outline !px-3 !py-1.5 text-xs" onClick={() => loadPreset(p.id)} title={p.hint}>
              {p.label}
            </button>
          ))}
        </div>
        <form onSubmit={runScan} className="mt-4 space-y-3">
          <div>
            <label htmlFor="sim-text" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Paste the prompt</label>
            <textarea
              id="sim-text"
              className="input min-h-36"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the prompt here — for example a message from a dataset, a document, or an email."
            />
          </div>
          <div>
            <label htmlFor="sim-source" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Where did it come from?</label>
            <select id="sim-source" className="input" value={source} onChange={(e) => setSource(e.target.value)}>
              {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" className="btn btn-primary">
            <ShieldCheck className="h-4 w-4" /> Run scan
          </button>
        </form>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Every test is saved as a request, and anything risky goes to the{' '}
          <Link to="/admin/queue" className="font-semibold text-blue-700 dark:text-blue-400 underline">Approval Queue</Link>{' '}
          — exactly like a real request.
        </p>
      </section>

      {result && (
        <div id="simulator-result" className="scroll-mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Result — {result.id}</h2>
            <span className="flex gap-2">
              <Link to={`/admin/requests/${result.id}`} className="btn btn-ghost !px-3">
                <ListChecks className="h-4 w-4" /> Full detail
              </Link>
              <button
                type="button"
                className="btn btn-ghost !px-3"
                onClick={() => { setResultId(null); setText('') }}
              >
                <RotateCcw className="h-4 w-4" /> Test another
              </button>
            </span>
          </div>
          <VerdictCard request={result} showAdminActions onDecide={decide} />
        </div>
      )}
    </div>
  )
}
