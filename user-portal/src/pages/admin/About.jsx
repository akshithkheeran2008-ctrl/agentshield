import { Card, CardHeader, PageHeader } from '../../components/ui.jsx'

const STACK = ['React', 'Tailwind CSS', 'ML Classifier', 'FastAPI', 'Python']

export default function About() {
  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Information"
        title="About"
        subtitle="What AgentShield is, and what it is built with."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="About the project" />
          <div className="space-y-2 p-5 text-sm leading-relaxed text-ink/70 dark:text-mist/60">
            <p>
              AgentShield guards an AI assistant that works with money and customer data. A request
              can carry hidden instructions — pasted from a document, an email, or a web page —
              that try to push the assistant into actions nobody asked for: moving money, sending
              customer records outside, or revealing hidden instructions.
            </p>
            <p>
              AgentShield checks every request before the assistant acts, scores the risk 0–100,
              and explains every point in plain language. Safe requests run. Risky ones are
              blocked, or held for an admin to approve or deny. Every decision is written to an
              audit log, so nothing happens without a reason on record.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Tech stack" />
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {STACK.map((t) => (
                <span key={t} className="rounded-full border border-ink/12 dark:border-mist/12 bg-white dark:bg-white/[0.02] px-3 py-1.5 text-sm font-semibold text-ink/80 dark:text-mist/70">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-mist/60">
              The detection engine — weighted warning signals plus a small trained classifier —
              runs in the browser, so every check is instant and nothing leaves the page.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="A note on the demo" />
        <p className="p-5 text-sm leading-relaxed text-ink/70 dark:text-mist/60">
          Prototype uses mock tools and synthetic data only. No real money moves, no real email
          is sent, and no real customer data is involved. The assistant, the ledger, and the
          requests are all demo data, made to show how the protection behaves.
        </p>
      </Card>
    </div>
  )
}
