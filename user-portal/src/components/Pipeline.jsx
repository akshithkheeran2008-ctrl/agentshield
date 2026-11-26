import { User, ScanSearch, Gauge, ShieldCheck, Bot, Wrench, GitFork } from 'lucide-react'
import { cx } from './ui.jsx'

const NODES = [
  ['User Input', User, 'Untrusted content', 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/25'],
  ['Injection Detector', ScanSearch, 'Classifier + heuristics', 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/25'],
  ['Risk Engine', Gauge, '0–100 explainable score', 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/25'],
  ['Policy Engine', ShieldCheck, '9 runtime policies', 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/25'],
  ['AI Agent', Bot, 'Sandboxed planner', 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/25'],
  ['Tool Interceptor', Wrench, 'Every call gated', 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/25'],
  ['Allow / Review / Block', GitFork, 'Decision + audit', 'bg-kelly/10 text-kelly-deep dark:text-kelly-soft ring-kelly/25'],
]

export default function Pipeline({ compact }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {NODES.map(([t, Icon, s, tile], i) => (
          <div
            key={t}
            style={{ animationDelay: `${i * 60}ms` }}
            className="fade-up relative rounded-2xl border border-ink/10 dark:border-mist/10 bg-white dark:bg-white/[0.03] p-3 text-center"
          >
            <div className={cx('mx-auto grid h-10 w-10 place-items-center rounded-lg ring-1', tile)}><Icon size={18} /></div>
            <div className="mt-2 text-xs font-semibold text-ink dark:text-white">{t}</div>
            {!compact && <div className="mt-0.5 text-[10px] text-ink/50 dark:text-mist/50">{s}</div>}
            {i < 6 && <div className="flow-line absolute -right-3 top-8 hidden h-px w-3 lg:block" />}
          </div>
        ))}
      </div>
    </div>
  )
}
