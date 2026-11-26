import { forwardRef } from 'react'
import { verdictOf } from '../lib/requests.js'

export const cx = (...c) => c.filter(Boolean).join(' ')

// Enterprise brand palette. Text uses a "deep" step in light mode and a
// "soft" (lightened) step in dark mode so badges stay readable on both
// backgrounds; the background tint and ring use the pure accent.
export const TONE = {
  SAFE: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  ALLOW: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  ALLOWED: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  EXECUTED: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  APPROVED: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  ONLINE: 'text-sea-deep dark:text-sea-soft bg-sea/10 ring-sea/30',
  ACTIVE: 'text-kelly-deep dark:text-kelly-soft bg-kelly/10 ring-kelly/30',
  HEALTHY: 'text-sea-deep dark:text-sea-soft bg-sea/10 ring-sea/30',
  LOW: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  REVIEW: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  PENDING: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  WARNING: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  MEDIUM: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  ELEVATED: 'text-flame-deep dark:text-flame-soft bg-flame/10 ring-flame/30',
  HIGH: 'text-crimson-deep dark:text-crimson-soft bg-crimson/10 ring-crimson/40',
  CRITICAL: 'text-crimson-deep dark:text-crimson-soft bg-crimson/12 ring-crimson/40',
  BLOCK: 'text-crimson-deep dark:text-crimson-soft bg-crimson/12 ring-crimson/40',
  BLOCKED: 'text-crimson-deep dark:text-crimson-soft bg-crimson/12 ring-crimson/40',
  REJECTED: 'text-crimson-deep dark:text-crimson-soft bg-crimson/12 ring-crimson/40',
  COMPROMISED: 'text-crimson-deep dark:text-crimson-soft bg-crimson/20 ring-crimson/50',
  INFO: 'text-aqua-deep dark:text-aqua-soft bg-aqua/10 ring-aqua/30',
  AI: 'text-royal-deep dark:text-royal-soft bg-royal/10 ring-royal/30',
  ANALYSIS: 'text-royal-deep dark:text-royal-soft bg-royal/10 ring-royal/30',
  NONE: 'text-ink/60 dark:text-mist/70 bg-ink/5 dark:bg-mist/10 ring-ink/15 dark:ring-mist/20',
}
export const TEXT = { SAFE: 'text-kelly-deep dark:text-kelly-soft', LOW: 'text-flame-deep dark:text-flame-soft', HIGH: 'text-crimson-deep dark:text-crimson-soft', CRITICAL: 'text-crimson-deep dark:text-crimson-soft', ALLOW: 'text-kelly-deep dark:text-kelly-soft', REVIEW: 'text-flame-deep dark:text-flame-soft', BLOCK: 'text-crimson-deep dark:text-crimson-soft', INFO: 'text-aqua-deep dark:text-aqua-soft' }
export const HEX = { SAFE: '#4FB06D', LOW: '#F07857', HIGH: '#B82C34', CRITICAL: '#B82C34', ALLOW: '#4FB06D', REVIEW: '#F07857', BLOCK: '#B82C34', INFO: '#43A5BE', AI: '#5C62D6', HEALTHY: '#53DA5A' }
export const levelOfScore = (s) => (s >= 80 ? 'CRITICAL' : s >= 60 ? 'HIGH' : s >= 30 ? 'LOW' : 'SAFE')

export function Badge({ value, children, className, dot }) {
  const v = value || children
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset whitespace-nowrap', TONE[v] || TONE.NONE, className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children || value}
    </span>
  )
}

export const Card = forwardRef(function Card({ className, children, ...p }, ref) {
  return <section ref={ref} className={cx('glass min-w-0 rounded-2xl transition-shadow', className)} {...p}>{children}</section>
})

export function CardHeader({ icon: Icon, title, subtitle, right, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-3 border-b border-ink/10 dark:border-mist/10 px-5 py-3.5', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-royal/10 text-royal-deep dark:text-royal-soft ring-1 ring-royal/25"><Icon size={16} /></span>}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink dark:text-white truncate">{title}</h2>
          {subtitle && <p className="text-xs text-ink/60 dark:text-mist/60 truncate">{subtitle}</p>}
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
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-aqua-deep dark:text-aqua-soft">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink dark:text-white md:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-ink/65 dark:text-mist/65">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

const BTN = {
  primary: 'bg-flame text-ink font-semibold hover:bg-flame/90 shadow-[0_10px_28px_-12px_rgba(240,120,87,.7)]',
  secondary: 'bg-white text-ink ring-1 ring-inset ring-ink/15 hover:bg-mist/40 dark:bg-white/[0.06] dark:text-white dark:ring-mist/15 dark:hover:bg-white/[0.1]',
  teal: 'bg-aqua text-ink font-semibold hover:bg-aqua/90 shadow-[0_10px_28px_-12px_rgba(67,165,190,.7)]',
  indigo: 'bg-royal text-white font-semibold hover:bg-royal/90 shadow-[0_10px_28px_-12px_rgba(92,98,214,.7)]',
  danger: 'bg-crimson text-white font-semibold hover:bg-crimson/90',
  success: 'bg-kelly text-ink font-semibold hover:bg-kelly/90',
  ghost: 'text-ink/70 hover:bg-ink/5 dark:text-mist/80 dark:hover:bg-white/[0.06]',
}
export function Button({ variant = 'secondary', icon: Icon, className, children, size = 'md', ...p }) {
  return (
    <button className={cx('inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-40',
      size === 'sm' ? 'px-2.5 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-3.5 py-2 text-sm', BTN[variant], className)} {...p}>
      {Icon && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />}{children}
    </button>
  )
}

export function Stat({ label, value, icon: Icon, tone = 'text-ink dark:text-white', hint }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between text-xs font-medium text-ink/55 dark:text-mist/55">
        <span>{label}</span>{Icon && <Icon size={15} className="text-ink/40 dark:text-mist/45" />}
      </div>
      <div className={cx('mt-2 font-mono text-[28px] font-semibold leading-none tabular-nums', tone)}>{value}</div>
      {hint && <div className="mt-1.5 text-[11px] text-ink/55 dark:text-mist/50">{hint}</div>}
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
        <span className="text-sm font-semibold text-ink/70 dark:text-mist/70">Risk score</span>
        <span className="font-mono text-2xl font-bold text-ink dark:text-white">
          {score}
          <span className="text-sm font-medium text-ink/45 dark:text-mist/50"> / 100</span>
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(2, score)}%`, background: color }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] font-medium text-ink/55 dark:text-mist/50">
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
  return <div className="px-5 py-10 text-center text-sm text-ink/55 dark:text-mist/50">{children}</div>
}

export function EmptyState({ title, body }) {
  return (
    <Card className="p-8 text-center">
      <div className="text-base font-semibold text-ink dark:text-white">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink/60 dark:text-mist/60">{body}</p>
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
