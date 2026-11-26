import { User, ScanSearch, Gauge, ShieldCheck, Bot, Wrench, GitFork } from 'lucide-react'

const NODES = [['User Input', User, 'Untrusted content'], ['Injection Detector', ScanSearch, 'Classifier + heuristics'], ['Risk Engine', Gauge, '0–100 explainable score'], ['Policy Engine', ShieldCheck, '9 runtime policies'], ['AI Agent', Bot, 'Sandboxed planner'], ['Tool Interceptor', Wrench, 'Every call gated'], ['Allow / Review / Block', GitFork, 'Decision + audit']]

export default function Pipeline({ compact }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {NODES.map(([t, Icon, s], i) => (
          <div
            key={t}
            style={{ animationDelay: `${i * 60}ms` }}
            className="fade-up relative rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-white/[0.07] dark:bg-white/[0.02]"
          >
            <div className={`mx-auto grid h-10 w-10 place-items-center rounded-lg ring-1 ${i === 6 ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-300' : 'bg-blue-500/10 text-blue-600 ring-blue-500/25 dark:text-blue-300'}`}><Icon size={18} /></div>
            <div className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">{t}</div>
            {!compact && <div className="mt-0.5 text-[10px] text-slate-500">{s}</div>}
            {i < 6 && <div className="flow-line absolute -right-3 top-8 hidden h-px w-3 lg:block" />}
          </div>
        ))}
      </div>
    </div>
  )
}
