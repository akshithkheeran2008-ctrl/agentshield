import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { ScanSearch, ShieldAlert, Ban, Eye, Activity, Hourglass } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { metrics, awaitingRequests, allEvents } from '../../lib/requests.js'
import { Button, Card, CardHeader, PageHeader, Stat, Empty, timeAgo } from '../../components/ui.jsx'

const LEVEL_COLORS = { SAFE: '#10b981', LOW: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }

export default function AdminDashboard() {
  const { store } = useStore()
  const m = metrics(store)
  const awaiting = awaitingRequests(store)
  const events = allEvents(store).slice(0, 8)
  const byLevel = ['SAFE', 'LOW', 'HIGH', 'CRITICAL'].map((level) => ({
    level,
    count: store.requests.filter((r) => r.scan.level === level).length,
  }))

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
        <Stat label="Requests checked" value={m.total} icon={ScanSearch} hint={`${m.safe} safe · ${m.threats} with a threat`} />
        <Stat label="Threats detected" value={m.threats} icon={ShieldAlert} tone="text-orange-600 dark:text-orange-300" hint={`Average risk ${m.avgScore}/100`} />
        <Stat label="Actions blocked" value={m.blocked} icon={Ban} tone="text-red-600 dark:text-red-300" hint={`${m.executed} actions ran`} />
        <Stat label="Awaiting decision" value={m.awaiting} icon={Eye} tone="text-amber-600 dark:text-amber-300" hint={`${m.approved} approved · ${m.denied} denied`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Requests by risk level" />
          <div className="h-56 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLevel} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-700)" />
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'var(--color-slate-500)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-slate-500)' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {byLevel.map((d) => <Cell key={d.level} fill={LEVEL_COLORS[d.level]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader icon={Activity} title="Latest activity" subtitle="Every pipeline stage emits an auditable event" right={<Link to="/admin/events" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Open the full audit log →</Link>} />
          {events.length === 0 ? (
            <Empty>No activity yet.</Empty>
          ) : (
            <ul className="space-y-2 p-4">
              {events.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-3 py-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.decision === 'BLOCKED' ? 'bg-red-500' : e.decision === 'APPROVED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{e.type} — {e.userName}</span>
                    <span className="block truncate text-sm text-slate-600 dark:text-slate-400">{e.description}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{timeAgo(e.ts)} · Risk {e.risk}/100</span>
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
              <Link key={r.id} to={`/admin/requests/${r.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{r.userName} — {r.goal}</span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">{r.scan.attackType} · Risk {r.scan.score}/100 · {timeAgo(r.ts)}</span>
                </span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">Review →</span>
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
