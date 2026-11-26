import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, PageHeader, cx } from '../../components/ui.jsx'

const FLOW = [
  { name: 'Client Applications', desc: 'Where the request starts', tone: 'blue' },
  { name: 'Agent Runtime', desc: 'The assistant that plans actions', tone: 'violet' },
  { name: 'AgentShield Security Layer', desc: 'Prompt Injection Detection · Policy Engine', tone: 'green', highlight: true },
  { name: 'Tool Layer', desc: 'Four mock tools, sandboxed', tone: 'cyan' },
  { name: 'External APIs', desc: 'Allow-listed mock sites only', tone: 'amber' },
]

const FLOW_TONE = {
  blue: 'border-aqua/30 bg-aqua/10 text-aqua-deep dark:text-aqua-soft',
  violet: 'border-royal/30 bg-royal/10 text-royal-deep dark:text-royal-soft',
  green: 'border-kelly/40 bg-kelly/10 text-kelly-deep dark:text-kelly-soft',
  cyan: 'border-aqua/30 bg-aqua/10 text-aqua-deep dark:text-aqua-soft',
  amber: 'border-flame/30 bg-flame/10 text-flame-deep dark:text-flame-soft',
}

const COMPONENTS = [
  { name: 'Injection Detector', body: 'Scans every request with weighted warning signals plus a small trained classifier. Hidden or encoded text is decoded and checked too.' },
  { name: 'Risk Engine', body: 'Turns the scan into a 0–100 score and a verdict band: Safe, Needs review, or Blocked — with every point explained.' },
  { name: 'Policy Engine', body: 'Applies the nine policies. Anything a policy forbids is stopped before it runs, and money tools are never registered at all.' },
  { name: 'Tool Interceptor', body: 'Sits between the assistant and the tools. Risky calls are held for an admin decision; only safe calls run in the sandbox.' },
]

const DATA_FLOW = [
  { step: 'Request Intake', body: 'A user’s request arrives — typed, pasted from a document, or from an email or web page.' },
  { step: 'Detection', body: 'The Injection Detector checks the words against the warning signals and the classifier.' },
  { step: 'Risk Assessment', body: 'The Risk Engine scores the request 0–100 and picks a verdict band.' },
  { step: 'Policy Check', body: 'The Policy Engine applies the nine policies to every action the assistant planned.' },
  { step: 'Decision & Audit', body: 'Safe actions run; risky ones wait for an admin. Every decision is written to the audit log with its reason.' },
]

export default function Architecture() {
  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Information"
        title="Architecture"
        subtitle="How a request moves through AgentShield — and what guards it at each step."
      />

      <Card>
        <CardHeader title="The layers" />
        <div className="flex flex-wrap items-center gap-2 p-5">
          {FLOW.map((f, i) => (
            <span key={f.name} className="flex flex-wrap items-center gap-2">
              <span className={cx('rounded-lg border px-3 py-2.5', FLOW_TONE[f.tone])}>
                <span className="flex items-center gap-2 text-sm font-bold">
                  {f.highlight && <ShieldCheck className="h-4 w-4 shrink-0" />}
                  {f.name}
                </span>
                <span className="block text-xs font-normal opacity-80">{f.desc}</span>
              </span>
              {i < FLOW.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-ink/50 dark:text-mist/55" />}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMPONENTS.map((c) => (
          <Card key={c.name} className="p-5">
            <div className="text-base font-bold text-ink dark:text-white">{c.name}</div>
            <p className="mt-1 text-sm leading-relaxed text-ink/70 dark:text-mist/60">{c.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Data flow" />
        <ol className="space-y-3 p-5">
          {DATA_FLOW.map((d, i) => (
            <li key={d.step} className="flex items-start gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal text-xs font-bold text-white">{i + 1}</span>
              <span>
                <span className="block text-sm font-bold text-ink dark:text-white">{d.step}</span>
                <span className="block text-sm text-ink/70 dark:text-mist/60">{d.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
