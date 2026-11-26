import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { TOOLS, allEvents } from '../../lib/requests.js'
import { Badge, Card, CardHeader, PageHeader, Stat, Empty, fmtTime } from '../../components/ui.jsx'

const RISK_BADGE = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }

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
      <PageHeader
        eyebrow="Security Console"
        title="Agent Monitor"
        subtitle="The four mock tools the assistant can call — and what actually happened to each call."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total tools" value={toolStats.length} icon={Wrench} hint="Mock tools in the sandbox" />
        <Stat label="Total calls" value={calls.length} hint={`${calls.filter((c) => c.status === 'EXECUTED').length} ran`} />
        <Stat label="Blocked calls" value={blockedCalls} tone="text-red-600 dark:text-red-300" hint={`${calls.filter((c) => c.status === 'PENDING').length} waiting for a decision`} />
        <Stat label="Tools restricted" value={restrictedTools} hint="With at least one blocked call" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {toolStats.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                <Wrench className="h-5 w-5" />
              </span>
              <Badge value={t.blocked > 0 ? 'BLOCKED' : 'INFO'}>{t.blocked > 0 ? 'Restricted' : 'Monitored'}</Badge>
            </div>
            <div className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{t.fn} · {t.permission}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.desc}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge value={RISK_BADGE[t.risk] || 'NONE'}>{t.risk} risk</Badge>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">{t.total}</strong> calls</span>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-red-600 dark:text-red-400">{t.blocked}</strong> blocked</span>
              <span className="text-slate-600 dark:text-slate-400"><strong className="text-emerald-600 dark:text-emerald-400">{t.executed}</strong> ran</span>
              {t.pending > 0 && <span className="text-slate-600 dark:text-slate-400"><strong className="text-amber-600 dark:text-amber-400">{t.pending}</strong> waiting</span>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Agent activity timeline" right={<Link to="/admin/events" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Open the full audit log →</Link>} />
        {events.length === 0 ? (
          <Empty>No activity yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.06] text-left text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                  <th className="px-4 py-2.5 first:pl-5">Time</th>
                  <th className="px-4 py-2.5">Event</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Risk</th>
                  <th className="px-4 py-2.5">Decision</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 dark:border-white/[0.04] last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap py-2.5 pl-5 pr-4 font-mono text-slate-500 dark:text-slate-400">{fmtTime(e.ts)}</td>
                    <td className="px-4 py-2.5">
                      <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{e.type}</span>
                      <span className="block text-sm text-slate-600 dark:text-slate-400">{e.description}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-600 dark:text-slate-400">{e.userName}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{e.risk}/100</td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <Badge value={e.decision === 'BLOCKED' ? 'BLOCKED' : e.decision === 'APPROVED' ? 'APPROVED' : e.decision === 'REVIEW' ? 'REVIEW' : 'NONE'}>
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
        <Card><Empty>No tool calls yet — tool calls appear here once users submit requests. Try the Attack Simulator to see one.</Empty></Card>
      )}
    </div>
  )
}
