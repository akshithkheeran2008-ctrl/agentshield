import { Link, useNavigate } from 'react-router-dom'
import { User, ShieldCheck, ScanSearch, Gauge, Lock, ArrowRight, FileWarning, Mail, Globe, Bot, Shield } from 'lucide-react'
import Pipeline from '../components/Pipeline.jsx'
import { useStore } from '../store.jsx'
import { metrics, modelInfo } from '../lib/requests.js'

const CAPS = [
  [ScanSearch, 'Detect', 'Find direct, indirect and obfuscated prompt injections in prompts, documents, emails and web pages.', 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/25'],
  [Gauge, 'Analyze', 'Score every request 0–100 with explainable signals, attack type and severity.', 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/25'],
  [Lock, 'Control', 'Intercept every AI tool call and enforce runtime security policies before execution.', 'bg-flame/10 text-flame-deep dark:text-flame-soft ring-flame/25'],
  [ShieldCheck, 'Protect', 'Stop unauthorized payments, data exfiltration and compromised-agent behaviour.', 'bg-kelly/10 text-kelly-deep dark:text-kelly-soft ring-kelly/25'],
]
const THREATS = [[FileWarning, 'Hidden text in invoices & PDFs'], [Mail, 'Malicious instructions in emails'], [Globe, 'Poisoned web pages'], [Bot, 'Agents exceeding their authority']]

export default function Landing() {
  const { store, accounts, signIn } = useStore()
  const navigate = useNavigate()
  const m = metrics(store)

  const enterAs = (account, to) => {
    signIn(account)
    navigate(to)
  }

  return (
    <div className="min-h-screen bg-grid">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <img src="/shield.svg" alt="" className="h-9 w-9" />
          <div>
            <div className="font-semibold text-ink dark:text-white">Zer0-Neuro</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50 dark:text-mist/55">AgentShield</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-ink/60 dark:text-mist/65 md:flex">
          <Link to="/signin" className="hover:text-ink dark:hover:text-white">Architecture</Link>
          <Link to="/signin" className="hover:text-ink dark:hover:text-white">Policies</Link>
          <Link to="/signin" className="hover:text-ink dark:hover:text-white">About</Link>
          <Link to="/signin" className="rounded-lg bg-ink/[0.06] px-3 py-1.5 text-ink ring-1 ring-ink/10 hover:bg-ink/10 dark:bg-white/[0.06] dark:text-white dark:ring-mist/15 dark:hover:bg-white/10">Open Console</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 text-center md:pt-20">
        <div className="fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-royal/30 bg-royal/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-royal-deep dark:text-royal-soft">
          <Shield size={12} />AGENTSHIELD
        </div>
        <h1 className="fade-up mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-ink dark:text-white md:text-6xl" style={{ animationDelay: '60ms' }}>
          Stop Prompt Injection <span className="bg-gradient-to-r from-flame to-aqua bg-clip-text text-transparent">Before Your AI Agent Acts.</span>
        </h1>
        <p className="fade-up mx-auto mt-5 max-w-2xl text-base text-ink/65 dark:text-mist/65 md:text-lg" style={{ animationDelay: '120ms' }}>
          Detect malicious instructions. Analyze agent behavior. Control tool execution. Block unsafe actions.
        </p>
        <div className="fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: '180ms' }}>
          <Link to="/signin" className="inline-flex items-center gap-2 rounded-xl bg-flame px-5 py-3 text-sm font-semibold text-ink shadow-lg shadow-flame/30 hover:bg-flame/90">
            Launch Security Console<ArrowRight size={16} />
          </Link>
          <button type="button" onClick={() => enterAs(accounts.admin, '/admin/simulator')} className="inline-flex items-center gap-2 rounded-xl bg-aqua/10 px-5 py-3 text-sm font-semibold text-aqua-deep ring-1 ring-inset ring-aqua/30 hover:bg-aqua/20 dark:text-aqua-soft">
            <Gauge size={16} />Run Attack Simulation
          </button>
        </div>
        <div className="fade-up mt-6" style={{ animationDelay: '220ms' }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50 dark:text-mist/50">Demo access — no password, no sign-up</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => enterAs(accounts.user, '/')} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink ring-1 ring-ink/15 hover:bg-mist/40 dark:bg-white/[0.06] dark:text-white dark:ring-mist/15 dark:hover:bg-white/10">
              <User size={16} />User Access
            </button>
            <button type="button" onClick={() => enterAs(accounts.admin, '/admin')} className="inline-flex items-center gap-2 rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-royal/30 hover:bg-royal/90">
              <ShieldCheck size={16} />Admin Access
            </button>
          </div>
          <p className="mt-3 text-xs text-ink/50 dark:text-mist/50">
            User Access signs in as demo.user@gmail.com; Admin Access as demo.admin@gmail.com.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[[m.total, 'Requests scanned', 'text-aqua-deep dark:text-aqua-soft'], [m.threats, 'Threats detected', 'text-flame-deep dark:text-flame-soft'], [m.blocked, 'Actions blocked', 'text-crimson-deep dark:text-crimson-soft'], [modelInfo.cvF1, 'Classifier CV-F1', 'text-royal-deep dark:text-royal-soft']].map(([v, l, tone]) => (
            <div key={l} className="glass rounded-2xl px-3 py-3"><div className={`font-mono text-2xl font-bold ${tone}`}>{v}</div><div className="text-[11px] text-ink/55 dark:text-mist/55">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="glass rounded-2xl p-6"><div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink/50 dark:text-mist/50">Runtime protection pipeline</div><Pipeline /></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map(([Icon, t, d, tile], i) => (
          <div key={t} style={{ animationDelay: `${i * 70}ms` }} className="fade-up glass rounded-2xl p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ${tile}`}><Icon size={18} /></span>
            <h3 className="mt-4 text-lg font-semibold text-ink dark:text-white">{t}</h3><p className="mt-1.5 text-sm text-ink/65 dark:text-mist/65">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-20 lg:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-aqua-deep dark:text-aqua-soft">The problem</div>
          <h2 className="mt-2 text-3xl font-bold text-ink dark:text-white">To an AI model, hidden instructions look like legitimate data.</h2>
          <p className="mt-3 text-ink/65 dark:text-mist/65">Banks are adopting AI agents that read documents, emails and web pages, then call tools such as payment lookups or email drafts. One poisoned invoice can push an agent to act beyond its authority — at machine speed.</p>
          <p className="mt-3 text-sm text-ink/50 dark:text-mist/50">Prototype uses mock tools and synthetic data only — no real payment APIs. Defensive and detective controls only.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">{THREATS.map(([Icon, t]) => <div key={t} className="glass flex items-center gap-3 rounded-2xl p-4"><Icon className="shrink-0 text-crimson-deep dark:text-crimson-soft" size={18} /><span className="text-sm text-ink dark:text-white">{t}</span></div>)}</div>
      </section>
      <footer className="border-t border-ink/10 dark:border-mist/10 py-6 text-center text-xs text-ink/50 dark:text-mist/50">AgentShield · Zer0-Neuro · Demo — synthetic data only</footer>
    </div>
  )
}
