import { Link, useNavigate } from 'react-router-dom'
import { User, ShieldCheck, ScanSearch, Gauge, Lock, ArrowRight, FileWarning, Mail, Globe, Bot } from 'lucide-react'
import Pipeline from '../components/Pipeline.jsx'
import { useStore } from '../store.jsx'
import { metrics, modelInfo } from '../lib/requests.js'

const CAPS = [
  [ScanSearch, 'Detect', 'Find direct, indirect and obfuscated prompt injections in prompts, documents, emails and web pages.'],
  [Gauge, 'Analyze', 'Score every request 0–100 with explainable signals, attack type and severity.'],
  [Lock, 'Control', 'Intercept every AI tool call and enforce runtime security policies before execution.'],
  [ShieldCheck, 'Protect', 'Stop unauthorized payments, data exfiltration and compromised-agent behaviour.'],
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
            <div className="font-semibold text-slate-900 dark:text-white">Zer0-Neuro</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">AgentShield</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-500 dark:text-slate-400 md:flex">
          <Link to="/signin" className="hover:text-slate-900 dark:hover:text-white">Architecture</Link>
          <Link to="/signin" className="hover:text-slate-900 dark:hover:text-white">Policies</Link>
          <Link to="/signin" className="hover:text-slate-900 dark:hover:text-white">About</Link>
          <Link to="/signin" className="rounded-lg bg-slate-900/[0.06] px-3 py-1.5 text-slate-900 ring-1 ring-slate-900/10 hover:bg-slate-900/10 dark:bg-white/[0.06] dark:text-white dark:ring-white/10 dark:hover:bg-white/10">Open Console</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 text-center md:pt-20">
        <div className="fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs text-blue-700 dark:text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />AI in Cybersecurity & Fintech · Zer0-Neuro
        </div>
        <h1 className="fade-up mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl" style={{ animationDelay: '60ms' }}>
          Stop Prompt Injection <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Before Your AI Agent Acts.</span>
        </h1>
        <p className="fade-up mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-400 md:text-lg" style={{ animationDelay: '120ms' }}>
          AgentShield detects malicious instructions, evaluates risk, validates tool calls and blocks unauthorized AI actions in banking and fintech workflows — in real time, with an explainable audit trail.
        </p>
        <div className="fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: '180ms' }}>
          <button type="button" onClick={() => enterAs(accounts.user, '/')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500">
            <User size={16} />User Access<ArrowRight size={16} />
          </button>
          <button type="button" onClick={() => enterAs(accounts.admin, '/admin')} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-900/10 hover:bg-slate-50 dark:bg-white/[0.05] dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10">
            <ShieldCheck size={16} />Admin Access
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Demo accounts — no password, no sign-up. User Access signs in as demo.user@gmail.com; Admin Access as demo.admin@gmail.com.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[[m.total, 'Requests scanned'], [m.threats, 'Threats detected'], [m.blocked, 'Actions blocked'], [modelInfo.cvF1, 'Classifier CV-F1']].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]"><div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{v}</div><div className="text-[11px] text-slate-500">{l}</div></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="glass rounded-2xl p-6"><div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Runtime protection pipeline</div><Pipeline /></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map(([Icon, t, d], i) => (
          <div key={t} style={{ animationDelay: `${i * 70}ms` }} className="fade-up glass rounded-2xl p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/25 dark:text-blue-300"><Icon size={18} /></span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{t}</h3><p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-20 lg:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">The problem</div>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">To an AI model, hidden instructions look like legitimate data.</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Banks are adopting AI agents that read documents, emails and web pages, then call tools such as payment lookups or email drafts. One poisoned invoice can push an agent to act beyond its authority — at machine speed.</p>
          <p className="mt-3 text-sm text-slate-500">Prototype uses mock tools and synthetic data only — no real payment APIs. Defensive and detective controls only.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">{THREATS.map(([Icon, t]) => <div key={t} className="glass flex items-center gap-3 rounded-xl p-4"><Icon className="shrink-0 text-red-500 dark:text-red-400" size={18} /><span className="text-sm text-slate-700 dark:text-slate-200">{t}</span></div>)}</div>
      </section>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-500">AgentShield · Zer0-Neuro · Demo — synthetic data only</footer>
    </div>
  )
}
