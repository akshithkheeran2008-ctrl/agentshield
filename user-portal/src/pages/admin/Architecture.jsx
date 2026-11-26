import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Card, LivePill } from '../../components/ui.jsx'

const FLOW = [
  { name: 'Client Applications', desc: 'Where the request starts', tone: 'blue' },
  { name: 'Agent Runtime', desc: 'The assistant that plans actions', tone: 'violet' },
  { name: 'AgentShield Security Layer', desc: 'Prompt Injection Detection · Policy Engine', tone: 'green', highlight: true },
  { name: 'Tool Layer', desc: 'Four mock tools, sandboxed', tone: 'cyan' },
  { name: 'External APIs', desc: 'Allow-listed mock sites only', tone: 'amber' },
]

const FLOW_TONE = {
  blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
  violet: 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300',
  green: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300',
  cyan: 'border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300',
  amber: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300',
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Architecture</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">How a request moves through AgentShield — and what guards it at each step.</p>
        </div>
        <LivePill />
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">The layers</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {FLOW.map((f, i) => (
            <span key={f.name} className="flex flex-wrap items-center gap-2">
              <span className={`rounded-xl border px-3 py-2.5 ${FLOW_TONE[f.tone]}`}>
                <span className="flex items-center gap-2 text-sm font-bold">
                  {f.highlight && <ShieldCheck className="h-4 w-4 shrink-0" />}
                  {f.name}
                </span>
                <span className="block text-xs font-normal opacity-80">{f.desc}</span>
              </span>
              {i < FLOW.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMPONENTS.map((c) => (
          <Card key={c.name}>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Data flow</h2>
        <ol className="mt-3 space-y-3">
          {DATA_FLOW.map((d, i) => (
            <li key={d.step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{i + 1}</span>
              <span>
                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{d.step}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-400">{d.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
