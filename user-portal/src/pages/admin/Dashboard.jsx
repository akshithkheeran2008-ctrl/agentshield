import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { ScanSearch, ShieldAlert, Ban, Eye, CheckCircle2, Siren, Gauge, Activity, Hourglass } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { metrics, awaitingRequests, allEvents } from '../../lib/requests.js'
import { Button, Card, CardHeader, PageHeader, Stat, Empty, timeAgo, levelOfScore } from '../../components/ui.jsx'

const LEVEL_COLORS = { SAFE: '#4FB06D', LOW: '#F07857', HIGH: '#B82C34', CRITICAL: '#B82C34' }
const LEVEL_OPACITY = { SAFE: 1, LOW: 1, HIGH: 0.65, CRITICAL: 1 }
const RISK_TONE = { SAFE: 'text-kelly-deep dark:text-kelly-soft', LOW: 'text-flame-deep dark:text-flame-soft', HIGH: 'text-crimson-deep dark:text-crimson-soft', CRITICAL: 'text-crimson-deep dark:text-crimson-soft' }

export default function AdminDashboard() {
  const { store } = useStore()
  const m = metrics(store)
  const awaiting = awaitingRequests(store)
  const events = allEvents(store).slice(0, 8)
  const byLevel = ['SAFE', 'LOW', 'HIGH', 'CRITICAL'].map((level) => ({
    level,
    count: store.requests.filter((r) => r.scan.level === level).length,
  }))
  const criticalThreats = store.requests.filter((r) => r.scan.level === 'CRITICAL').length
  const reviewed = m.approved + m.denied
  const overallLevel = levelOfScore(m.avgScore)

  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Security Console"
        title="Admin Dashboard"
        subtitle="Every user’s requests, threats, and decisions — in one place."
        actions={awaiting.length > 0 ? (
          <Link to="/admin/queue">
            <Button variant="danger">{awaiting.length} waiting for your decision →</Button>
          </Link>
        ) : null}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Threats Detected" value={m.threats} icon={ShieldAlert} tone="text-flame-deep dark:text-flame-soft" hint={`Average risk ${m.avgScore}/100`} />
        <Stat label="Requests Scanned" value={m.total} icon={ScanSearch} tone="text-aqua-deep dark:text-aqua-soft" hint={`${m.safe} safe · ${m.threats} with a threat`} />
        <Stat label="Actions Blocked" value={m.blocked} icon={Ban} tone="text-crimson-deep dark:text-crimson-soft" hint={`${m.executed} actions ran`} />
        <Stat label="Actions Reviewed" value={reviewed} icon={Eye} tone="text-royal-deep dark:text-royal-soft" hint={`${m.awaiting} awaiting decision`} />
        <Stat label="Safe Requests" value={m.safe} icon={CheckCircle2} tone="text-kelly-deep dark:text-kelly-soft" hint={`${m.approved} approved · ${m.denied} denied`} />
        <Stat label="Critical Threats" value={criticalThreats} icon={Siren} tone="text-crimson-deep dark:text-crimson-soft" hint="Risk 80–100 · Blocked" />
        <Stat label="Overall Risk" value={m.avgScore} icon={Gauge} tone={RISK_TONE[overallLevel]} hint={`${overallLevel} · average across all requests`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Requests by risk level" />
          <div className="h-56 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLevel} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'var(--chart-tick)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--chart-tick)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#253342', border: '1px solid rgba(203,214,226,0.2)', borderRadius: 12, color: '#CBD6E2' }} labelStyle={{ color: '#CBD6E2' }} cursor={{ fill: 'rgba(203,214,226,0.08)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {byLevel.map((d) => <Cell key={d.level} fill={LEVEL_COLORS[d.level]} fillOpacity={LEVEL_OPACITY[d.level]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 pb-4 text-[11px] font-medium text-ink/55 dark:text-mist/55">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-kelly" />SAFE</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-flame" />LOW · Warning</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-crimson/65" />HIGH · Blocked</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-crimson" />CRITICAL · Blocked</span>
          </div>
        </Card>

        <Card>
          <CardHeader icon={Activity} title="Latest activity" subtitle="Every pipeline stage emits an auditable event" right={<Link to="/admin/events" className="text-xs text-aqua-deep dark:text-aqua-soft hover:underline">Open the full audit log →</Link>} />
          {events.length === 0 ? (
            <Empty>No activity yet.</Empty>
          ) : (
            <ul className="space-y-2 p-4">
              {events.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5 rounded-xl border border-ink/10 dark:border-mist/10 bg-ink/[0.03] dark:bg-white/[0.02] px-3 py-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.decision === 'BLOCKED' ? 'bg-crimson' : e.decision === 'APPROVED' ? 'bg-kelly' : 'bg-aqua'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink dark:text-white">{e.type} — {e.userName}</span>
                    <span className="block truncate text-sm text-ink/65 dark:text-mist/65">{e.description}</span>
                    <span className="block text-xs text-ink/55 dark:text-mist/50">{timeAgo(e.ts)} · Risk {e.risk}/100</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {awaiting.length > 0 && (
        <Card>
          <CardHeader icon={Hourglass} title="Needs your decision now" subtitle="REVIEW decisions waiting for an analyst" />
          <div className="space-y-2 p-4">
            {awaiting.slice(0, 3).map((r) => (
              <Link key={r.id} to={`/admin/requests/${r.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-flame/30 bg-flame/10 px-3 py-2.5">
                <span>
                  <span className="block text-sm font-bold text-ink dark:text-white">{r.userName} — {r.goal}</span>
                  <span className="block text-xs text-ink/65 dark:text-mist/65">{r.scan.attackType} · Risk {r.scan.score}/100 · {timeAgo(r.ts)}</span>
                </span>
                <span className="text-sm font-bold text-flame-deep dark:text-flame-soft">Review →</span>
              </Link>
            ))}
          </div>
        </Card>
      )}
      {awaiting.length === 0 && (
        <Card><Empty>Nothing waiting — no requests are waiting for a decision right now. New risky requests will appear in the Approval Queue.</Empty></Card>
      )}
    </div>
  )
}
