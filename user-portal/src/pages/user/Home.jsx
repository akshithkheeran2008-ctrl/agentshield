import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Search, ListChecks, Clock3, ArrowRight, FlaskConical } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { SAMPLE_TASKS, requestsForUser, metrics, statusText } from '../../lib/requests.js'
import { Badge, Button, Card, CardHeader, PageHeader, EmptyState, timeAgo } from '../../components/ui.jsx'

const SOURCE_OPTIONS = [
  { value: 'user', label: 'I typed it myself' },
  { value: 'email', label: 'Pasted from an email' },
  { value: 'document', label: 'Pasted from a document' },
  { value: 'web', label: 'Pasted from a web page' },
]

const SHOW_SAMPLES = ['safe', 'indirect', 'fintech', 'direct', 'obfusc']

export default function Home() {
  const { session, store, submit } = useStore()
  const navigate = useNavigate()
  const [goal, setGoal] = useState('')
  const [content, setContent] = useState('')
  const [source, setSource] = useState('user')
  const [error, setError] = useState('')

  const mine = requestsForUser(store, session.email)
  const m = metrics(store)
  const myAwaiting = mine.filter((r) => r.status === 'awaiting').length
  const samples = SAMPLE_TASKS.filter((s) => SHOW_SAMPLES.includes(s.id))

  const fillSample = (s) => {
    setGoal(s.goal)
    setContent(s.content)
    setSource(s.source)
    setError('')
    document.getElementById('check-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const g = goal.trim()
    const c = content.trim()
    if (!g && !c) {
      setError('Type a request or pick a sample task below.')
      return
    }
    const id = submit({
      goal: g || 'Check the pasted content',
      content: c || g,
      source: c ? source : 'user',
      resource: undefined,
    })
    if (id) navigate(`/requests/${id}`)
  }

  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="My Assistant"
        title="Your AI assistant, guarded."
        subtitle="Your assistant reads documents, emails and web pages to help you — but a hidden instruction inside that content can try to push it to do something you never asked for, like moving money or sending your details outside. AgentShield checks every request before the assistant acts, explains the risk in plain language, and stops anything dangerous."
      />

      <Card>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <div className="rounded-lg border border-ink/12 dark:border-mist/12 bg-white dark:bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink dark:text-white"><Search className="h-4 w-4 text-royal-deep dark:text-royal-soft" /> 1 · Check</div>
            <p className="mt-1 text-sm text-ink/70 dark:text-mist/60">Every word is scanned for hidden instructions and scored 0–100.</p>
          </div>
          <div className="rounded-lg border border-ink/12 dark:border-mist/12 bg-white dark:bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink dark:text-white"><ListChecks className="h-4 w-4 text-aqua-deep dark:text-aqua-soft" /> 2 · Explain</div>
            <p className="mt-1 text-sm text-ink/70 dark:text-mist/60">You see the score and the reason for every point — in plain English.</p>
          </div>
          <div className="rounded-lg border border-ink/12 dark:border-mist/12 bg-white dark:bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink dark:text-white"><ShieldCheck className="h-4 w-4 text-kelly-deep dark:text-kelly-soft" /> 3 · Stop or allow</div>
            <p className="mt-1 text-sm text-ink/70 dark:text-mist/60">Safe requests run. Risky ones are blocked or sent to an admin first.</p>
          </div>
        </div>
        {myAwaiting > 0 && (
          <div className="mx-5 mb-5 flex items-start gap-2 rounded-lg border border-flame/30 bg-flame/10 p-3 text-sm text-flame-deep dark:text-flame-soft">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>{myAwaiting} of your request{myAwaiting > 1 ? 's are' : ' is'} waiting for an admin decision.</strong>{' '}
              <Link to="/requests" className="font-semibold underline">See them in My Requests</Link>
            </span>
          </div>
        )}
      </Card>

      <Card id="check-box" className="scroll-mt-4">
        <CardHeader icon={ShieldCheck} title="Check my request" subtitle="Paste the task, email or document — or pick a sample below. The check runs in your browser." />
        <form onSubmit={onSubmit} className="space-y-3 p-5">
          <div>
            <label htmlFor="goal" className="mb-1 block text-xs font-medium text-ink/60 dark:text-mist/60">What should the assistant do?</label>
            <input id="goal" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Check my account balance and prepare a summary" />
          </div>
          <div>
            <label htmlFor="content" className="mb-1 block text-xs font-medium text-ink/60 dark:text-mist/60">Paste the content it will read (email, document, or web page)</label>
            <textarea id="content" className="input min-h-28" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste the message or document text here. Leave empty to check just the request above." />
          </div>
          <div>
            <label htmlFor="source" className="mb-1 block text-xs font-medium text-ink/60 dark:text-mist/60">Where did this content come from?</label>
            <select id="source" className="input" value={source} onChange={(e) => setSource(e.target.value)}>
              {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {error && <p className="text-sm font-medium text-crimson-deep dark:text-crimson-soft">{error}</p>}
          <Button type="submit" variant="primary" icon={ShieldCheck}>Check this request</Button>
        </form>
      </Card>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-royal-deep dark:text-royal-soft" />
          <h2 className="text-lg font-bold text-ink dark:text-white">Try a sample — see protection work</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((s) => (
            <Card key={s.id} className="p-4 transition hover:-translate-y-0.5">
              <button type="button" onClick={() => fillSample(s)} className="block w-full text-left">
                <span className="text-sm font-bold text-ink dark:text-white">{s.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink/70 dark:text-mist/60">{s.plain}</span>
                <span className="mt-2 block text-xs font-semibold text-flame dark:text-aqua-soft">{s.expected} →</span>
              </button>
            </Card>
          ))}
          <Card className="p-4 transition hover:-translate-y-0.5">
            <Link to="/how-it-works" className="flex h-full flex-col justify-between">
              <span className="text-sm font-bold text-ink dark:text-white">How does the check work?</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink/70 dark:text-mist/60">Four plain steps — no security jargon, and a list of what we never do.</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-flame dark:text-aqua-soft">Read how it works <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink dark:text-white">Your recent requests</h2>
          <Link to="/requests" className="inline-flex items-center gap-1 text-sm font-semibold text-flame dark:text-aqua-soft">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {mine.length === 0 ? (
          <EmptyState title="No requests yet" body="Check a request above, or try a sample task — it will show up here with its verdict." />
        ) : (
          <div className="space-y-2">
            {mine.slice(0, 3).map((r) => (
              <Card key={r.id} className="transition hover:-translate-y-0.5">
                <Link to={`/requests/${r.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <span>
                    <span className="block text-sm font-bold text-ink dark:text-white">{r.name} — {r.goal}</span>
                    <span className="block text-xs text-ink/60 dark:text-mist/60">{r.id} · {timeAgo(r.ts)} · Risk {r.scan.score}/100</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge value={r.scan.level}>{r.scan.level === 'SAFE' ? 'Safe' : r.scan.level === 'LOW' ? 'Needs review' : 'Blocked'}</Badge>
                    <span className="text-xs font-semibold text-ink/70 dark:text-mist/60">{statusText(r.status).label}</span>
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-ink/60 dark:text-mist/60">
          So far across all users: {m.total} requests checked, {m.threats} with a threat found, {m.blocked} actions blocked, {m.awaiting} waiting for an admin.
        </p>
      </section>
    </div>
  )
}
