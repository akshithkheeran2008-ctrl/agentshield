import { forwardRef } from 'react'
import { verdictOf } from '../lib/requests.js'

export const cx = (...c) => c.filter(Boolean).join(' ')

// Copied from the old repo. The text colour carries a light-mode step so
// badges stay readable when the Light theme is on; in dark (the default)
// they render exactly as the old repo's.
export const TONE = {
  SAFE: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  ALLOW: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  ALLOWED: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  EXECUTED: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  APPROVED: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  ONLINE: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  ACTIVE: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
  LOW: 'text-yellow-700 dark:text-yellow-300 bg-yellow-500/10 ring-yellow-500/30',
  REVIEW: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30',
  PENDING: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30',
  WARNING: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30',
  MEDIUM: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30',
  ELEVATED: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30',
  HIGH: 'text-orange-700 dark:text-orange-300 bg-orange-500/10 ring-orange-500/30',
  CRITICAL: 'text-red-700 dark:text-red-300 bg-red-500/12 ring-red-500/40',
  BLOCK: 'text-red-700 dark:text-red-300 bg-red-500/12 ring-red-500/40',
  BLOCKED: 'text-red-700 dark:text-red-300 bg-red-500/12 ring-red-500/40',
  REJECTED: 'text-red-700 dark:text-red-300 bg-red-500/12 ring-red-500/40',
  COMPROMISED: 'text-red-700 dark:text-red-200 bg-red-600/25 ring-red-500/60',
  INFO: 'text-sky-700 dark:text-sky-300 bg-sky-500/10 ring-sky-500/30',
  NONE: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 ring-slate-500/30',
}
export const TEXT = { SAFE: 'text-emerald-600 dark:text-emerald-400', LOW: 'text-yellow-600 dark:text-yellow-300', HIGH: 'text-orange-600 dark:text-orange-400', CRITICAL: 'text-red-600 dark:text-red-400', ALLOW: 'text-emerald-600 dark:text-emerald-400', REVIEW: 'text-amber-600 dark:text-amber-400', BLOCK: 'text-red-600 dark:text-red-400' }
export const HEX = { SAFE: '#34d399', LOW: '#facc15', HIGH: '#fb923c', CRITICAL: '#f87171', ALLOW: '#34d399', REVIEW: '#fbbf24', BLOCK: '#f87171', INFO: '#38bdf8' }
export const levelOfScore = (s) => (s >= 80 ? 'CRITICAL' : s >= 60 ? 'HIGH' : s >= 30 ? 'LOW' : 'SAFE')

export function Badge({ value, children, className, dot }) {
  const v = value || children
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset whitespace-nowrap', TONE[v] || TONE.NONE, className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children || value}
    </span>
  )
}

export const Card = forwardRef(function Card({ className, children, ...p }, ref) {
  return <section ref={ref} className={cx('glass min-w-0 rounded-xl', className)} {...p}>{children}</section>
})

export function CardHeader({ icon: Icon, title, subtitle, right, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/[0.06] px-5 py-3.5', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20"><Icon size={16} /></span>}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

const BTN = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_8px_24px_-10px_rgba(37,99,235,.8)]',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-white/[0.04] dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/[0.08]',
  danger: 'bg-red-600/90 text-white hover:bg-red-500',
  success: 'bg-emerald-600/90 text-white hover:bg-emerald-500',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]',
}
export function Button({ variant = 'secondary', icon: Icon, className, children, size = 'md', ...p }) {
  return (
    <button className={cx('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-40',
      size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm', BTN[variant], className)} {...p}>
      {Icon && <Icon size={size === 'sm' ? 13 : 15} />}{children}
    </button>
  )
}

export function Stat({ label, value, icon: Icon, tone = 'text-slate-900 dark:text-white', hint }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>{label}</span>{Icon && <Icon size={15} className="text-slate-400 dark:text-slate-500" />}
      </div>
      <div className={cx('mt-2 font-mono text-[28px] font-semibold leading-none tabular-nums', tone)}>{value}</div>
      {hint && <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-500">{hint}</div>}
    </Card>
  )
}

export function Highlighted({ text, ranges }) {
  if (!ranges?.length) return <>{text}</>
  const out = []; let i = 0
  const merged = []
  for (const [a, b] of ranges) { const last = merged[merged.length - 1]; if (last && a <= last[1]) last[1] = Math.max(last[1], b); else merged.push([a, b]) }
  merged.forEach(([a, b], k) => { if (a > i) out.push(text.slice(i, a)); out.push(<mark key={k} className="hl">{text.slice(a, b)}</mark>); i = b })
  out.push(text.slice(i))
  return <>{out}</>
}

export function ScoreBar({ score, level }) {
  const v = verdictOf({ level })
  const color = HEX[level] || HEX.SAFE
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Risk score</span>
        <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
          {score}
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500"> / 100</span>
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(2, score)}%`, background: color }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>0 · Safe</span>
        <span>30 · Review</span>
        <span>60 · Block</span>
        <span>100</span>
      </div>
      <div className="mt-1 text-xs font-semibold"><Badge value={level}>{v.label}</Badge></div>
    </div>
  )
}

export const fmtTime = (ts) => new Date(ts).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})
export const fmtArgs = (args) => Object.entries(args).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')

export function Empty({ children }) {
  return <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-500">{children}</div>
}

export function EmptyState({ title, body }) {
  return (
    <Card className="p-8 text-center">
      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </Card>
  )
}

export function timeAgo(ts) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  return `${Math.floor(h / 24)} d ago`
}
