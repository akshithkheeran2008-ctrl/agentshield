import { Card, LivePill } from '../../components/ui.jsx'

const STACK = ['React', 'Tailwind CSS', 'ML Classifier', 'FastAPI', 'Python']

export default function About() {
  return (
    <div className="fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">About</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">What AgentShield is, and what it is built with.</p>
        </div>
        <LivePill />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">About the project</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            AgentShield guards an AI assistant that works with money and customer data. A request
            can carry hidden instructions — pasted from a document, an email, or a web page —
            that try to push the assistant into actions nobody asked for: moving money, sending
            customer records outside, or revealing hidden instructions.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            AgentShield checks every request before the assistant acts, scores the risk 0–100,
            and explains every point in plain language. Safe requests run. Risky ones are
            blocked, or held for an admin to approve or deny. Every decision is written to an
            audit log, so nothing happens without a reason on record.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Tech stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STACK.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            The detection engine — weighted warning signals plus a small trained classifier —
            runs in the browser, so every check is instant and nothing leaves the page.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">A note on the demo</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Prototype uses mock tools and synthetic data only. No real money moves, no real email
          is sent, and no real customer data is involved. The assistant, the ledger, and the
          requests are all demo data, made to show how the protection behaves.
        </p>
      </Card>
    </div>
  )
}
