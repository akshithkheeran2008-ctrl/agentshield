import { Link } from 'react-router-dom'
import { ShieldCheck, Search, ListChecks, ArrowRight } from 'lucide-react'
import { Card, LivePill } from '../../components/ui.jsx'

const FEATURES = [
  {
    icon: Search,
    title: 'Check',
    body: 'Every word is scanned for hidden instructions and scored 0–100.',
  },
  {
    icon: ListChecks,
    title: 'Explain',
    body: 'You see the score and the reason for every point — in plain English.',
  },
  {
    icon: ShieldCheck,
    title: 'Stop or allow',
    body: 'Safe requests run. Risky ones are blocked or sent to an admin first.',
  },
]

const PIPELINE = [
  { step: 'Request Intake', body: 'A user’s request arrives — typed, pasted from a document, or from an email or web page.' },
  { step: 'Detection', body: 'Weighted warning signals plus a small trained classifier check the words, including hidden or encoded text.' },
  { step: 'Risk Assessment', body: 'The check becomes a 0–100 score and a verdict: Safe, Needs review, or Blocked.' },
  { step: 'Policy Check', body: 'The nine policies are applied. Anything a policy forbids is stopped before it runs.' },
  { step: 'Decision & Audit', body: 'Safe actions run in the sandbox. Risky ones wait for an admin, and every decision is written to the audit log.' },
]

export default function ProductOverview() {
  return (
    <div className="fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Product Overview</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">What AgentShield is, and how it guards the assistant.</p>
        </div>
        <LivePill />
      </div>

      <section className="card p-6 sm:p-8">
        <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Your AI assistant, <span className="gradient-text">guarded.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          AgentShield checks every request before your assistant acts. If a hidden instruction
          in a document or email tries to push it somewhere you did not ask, it gets stopped —
          and you get told why, in plain language.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          The assistant works in a sandbox with four mock tools and synthetic data only. Money
          tools are not registered at all, so a transfer can never be ordered — even by an
          instruction that slips into the prompt.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <f.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{f.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">How a request is checked</h2>
        <ol className="mt-3 space-y-3">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{i + 1}</span>
              <span>
                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{p.step}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-400">{p.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Where to go next</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/admin" className="btn btn-outline">Dashboard <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/admin/simulator" className="btn btn-outline">Attack Simulator <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/admin/queue" className="btn btn-outline">Approval Queue <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/admin/architecture" className="btn btn-outline">Architecture <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Card>
    </div>
  )
}
