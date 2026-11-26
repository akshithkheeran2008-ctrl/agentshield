import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { TOOLS, allEvents } from '../../lib/requests.js'
import { Badge, Card, Stat, EmptyState, LivePill, fmtTime } from '../../components/ui.jsx'

const RISK_TONE = { LOW: 'safe', MEDIUM: 'review', HIGH: 'blocked' }

export default function Agents() {
  const { store } = useStore()
  const calls = store.requests.flatMap((r) => r.agent.calls)
  const toolStats = Object.entries(TOOLS).map(([id, spec]) => {
    const tc = calls.filter((c) => c.tool === id)
    return {
      id,
      ...spec,
      total: tc.length,
      blocked: tc.filter((c) => c.status === 'BLOCKED').length,
      executed: tc.filter((c) => c.status === 'EXECUTED').length,
      pending: tc.filter((c) => c.status === 'PENDING').length,
    }
  })
  const blockedCalls = calls.filter((c) => c.status === 'BLOCKED').length
  const restrictedTools = toolStats.filter((t) => t.blocked > 0).length
  const events = allEvents(store).slice(0, 10)

  return (
    <div className="fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Agent Monitor</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">The four mock tools the assistant can call — and what actually happened to each call.</p>
        </div>
        <LivePill />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total tools" value={toolStats.length} sub="Mock tools in the sandbox" />
        <Stat label="Total calls" value={calls.length} delta={`${calls.filter((c) => c.status === 'EXECUTED').length} ran`} deltaTone="safe" />
        <Stat label="Blocked calls" value={blockedCalls} delta={`${calls.filter((c) => c.status === 'PENDING').length} waiting for a decision`} deltaTone={blockedCalls > 0 ? 'blocked' : 'safe'} />
        <Stat label="Tools restricted" value={restrictedTools} sub="With at least one blocked call" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {toolStats.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900">
                <Wrench className="h-5 w-5" />
              </span>
              <Badge tone={t.blocked > 0 ? 'blocked' : 'info'}>{t.blocked > 0 ? 'Restricted' : 'Monitored'}</Badge>
            </div>
            <div className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{t.fn} · {t.permission}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.desc}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge tone={RISK_TONE[t.risk] || 'neutral'}>{t.risk} risk</Badge>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">{t.total}</strong> calls</span>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-red-700 dark:text-red-400">{t.blocked}</strong> blocked</span>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-emerald-700 dark:text-emerald-400">{t.executed}</strong> ran</span>
              {t.pending > 0 && <span className="text-slate-600 dark:text-slate-400"><strong className="text-amber-700 dark:text-amber-400">{t.pending}</strong> waiting</span>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Agent activity timeline</h2>
          <Link to="/admin/events" className="text-sm font-semibold text-blue-700 dark:text-blue-400">Open the full audit log →</Link>
        </div>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Event</th>
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">Risk</th>
                  <th className="px-2 py-2">Decision</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="whitespace-nowrap px-2 py-2.5 text-slate-500 dark:text-slate-400">{fmtTime(e.ts)}</td>
                    <td className="px-2 py-2.5">
                      <span className="block font-semibold text-slate-800 dark:text-slate-200">{e.type}</span>
                      <span className="block text-slate-600 dark:text-slate-400">{e.description}</span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-slate-600 dark:text-slate-400">{e.userName}</td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-bold text-slate-800 dark:text-slate-200">{e.risk}/100</td>
                    <td className="whitespace-nowrap px-2 py-2.5">
                      <Badge tone={e.decision === 'BLOCKED' ? 'blocked' : e.decision === 'APPROVED' ? 'safe' : e.decision === 'REVIEW' ? 'review' : 'neutral'}>
                        {e.decision}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {calls.length === 0 && (
        <EmptyState title="No tool calls yet" body="Tool calls appear here once users submit requests. Try the Attack Simulator to see one." />
      )}
    </div>
  )
}
