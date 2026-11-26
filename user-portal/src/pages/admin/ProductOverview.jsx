import { Link } from 'react-router-dom'
import { ShieldCheck, Search, ListChecks, ArrowRight } from 'lucide-react'
import { Card, CardHeader, PageHeader } from '../../components/ui.jsx'

const FEATURES = [
  {
    icon: Search,
    tone: 'text-royal-deep dark:text-royal-soft',
    title: 'Check',
    body: 'Every word is scanned for hidden instructions and scored 0–100.',
  },
  {
    icon: ListChecks,
    tone: 'text-aqua-deep dark:text-aqua-soft',
    title: 'Explain',
    body: 'You see the score and the reason for every point — in plain English.',
  },
  {
    icon: ShieldCheck,
    tone: 'text-kelly-deep dark:text-kelly-soft',
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
      <PageHeader
        eyebrow="Product Overview"
        title="Product Overview"
        subtitle="What AgentShield is, and how it guards the assistant."
      />

      <Card className="p-6 sm:p-8">
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-ink dark:text-white sm:text-4xl">
          Your AI assistant, guarded.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-mist/60 sm:text-base">
          AgentShield checks every request before your assistant acts. If a hidden instruction
          in a document or email tries to push it somewhere you did not ask, it gets stopped —
          and you get told why, in plain language.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-mist/60">
          The assistant works in a sandbox with four mock tools and synthetic data only. Money
          tools are not registered at all, so a transfer can never be ordered — even by an
          instruction that slips into the prompt.
        </p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} className="p-5">
            <f.icon className={`h-5 w-5 ${f.tone}`} />
            <div className="mt-2 text-sm font-bold text-ink dark:text-white">{f.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-ink/70 dark:text-mist/60">{f.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="How a request is checked" />
        <ol className="space-y-3 p-5">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="flex items-start gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal text-xs font-bold text-white">{i + 1}</span>
              <span>
                <span className="block text-sm font-bold text-ink dark:text-white">{p.step}</span>
                <span className="block text-sm text-ink/70 dark:text-mist/60">{p.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardHeader title="Where to go next" />
        <div className="flex flex-wrap gap-2 p-5">
          {[
            ['/admin', 'Dashboard'],
            ['/admin/simulator', 'Attack Simulator'],
            ['/admin/queue', 'Approval Queue'],
            ['/admin/architecture', 'Architecture'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-ink/80 ring-1 ring-inset ring-ink/12 hover:bg-white dark:bg-white/[0.04] dark:text-white dark:ring-mist/15 dark:hover:bg-white/[0.08]">
              {label} <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
