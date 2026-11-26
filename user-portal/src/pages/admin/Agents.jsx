import { Link } from 'react-router-dom'
import { Wrench, User, FileInput, ScanSearch, Gauge, ShieldCheck, Bot, ChevronRight } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { TOOLS, allEvents, metrics } from '../../lib/requests.js'
import { Badge, Card, CardHeader, PageHeader, Stat, Empty, fmtTime, cx } from '../../components/ui.jsx'

const RISK_BADGE = { LOW: 'SAFE', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }

// Node state: 'ok' (Teal/Indigo processing), 'warn' (Orange), 'bad' (Dark Red).
const NODE_TILE = {
  okTeal: 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/25',
  okRoyal: 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/25',
  warn: 'bg-flame/10 text-flame-deep dark:text-flame-soft ring-flame/30',
  bad: 'bg-crimson/10 text-crimson-deep dark:text-crimson-soft ring-crimson/35',
  neutral: 'bg-ink/5 dark:bg-white/[0.05] text-ink/60 dark:text-mist/60 ring-ink/10 dark:ring-mist/15',
}

function FlowNode({ icon: Icon, label, sub, state, tile }) {
  return (
    <div className="glass flex min-w-0 flex-col items-center rounded-2xl px-2 py-3 text-center">
      <span className={cx('grid h-10 w-10 place-items-center rounded-lg ring-1', tile)}>
        <Icon size={18} />
      </span>
      <span className="mt-2 text-xs font-bold text-ink dark:text-white">{label}</span>
      <span className={cx('mt-0.5 text-[10px] font-medium', state === 'bad' ? 'text-crimson-deep dark:text-crimson-soft' : state === 'warn' ? 'text-flame-deep dark:text-flame-soft' : 'text-ink/50 dark:text-mist/50')}>{sub}</span>
    </div>
  )
}

export default function Agents() {
  const { store } = useStore()
  const m = metrics(store)
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
  const pendingCalls = calls.filter((c) => c.status === 'PENDING').length
  const restrictedTools = toolStats.filter((t) => t.blocked > 0).length
  const criticalCount = store.requests.filter((r) => r.scan.level === 'CRITICAL').length
  const highCount = store.requests.filter((r) => r.scan.level === 'HIGH').length
  const events = allEvents(store).slice(0, 10)

  const nodeState = (kind) => {
    if (kind === 'input') return m.threats > 0 ? 'bad' : 'okTeal'
    if (kind === 'detector' || kind === 'risk') return criticalCount > 0 ? 'bad' : highCount > 0 ? 'warn' : 'okRoyal'
    if (kind === 'policy') return blockedCalls > 0 ? 'bad' : 'okTeal'
    if (kind === 'agent') return pendingCalls > 0 ? 'warn' : 'okRoyal'
    if (kind === 'tool') return blockedCalls > 0 ? 'bad' : pendingCalls > 0 ? 'warn' : 'okTeal'
    return 'neutral'
  }

  const nodes = [
    { icon: User, label: 'USER', sub: `${m.total} requests`, state: 'neutral', tile: NODE_TILE.neutral },
    { icon: FileInput, label: 'INPUT', sub: m.threats > 0 ? `${m.threats} threats found` : 'Clean input', state: nodeState('input'), tile: nodeState('input') === 'bad' ? NODE_TILE.bad : NODE_TILE.okTeal },
    { icon: ScanSearch, label: 'DETECTOR', sub: criticalCount > 0 ? `${criticalCount} critical` : highCount > 0 ? `${highCount} high` : 'No threats', state: nodeState('detector'), tile: nodeState('detector') === 'bad' ? NODE_TILE.bad : nodeState('detector') === 'warn' ? NODE_TILE.warn : NODE_TILE.okRoyal },
    { icon: Gauge, label: 'RISK ENGINE', sub: `Avg risk ${m.avgScore}/100`, state: nodeState('risk'), tile: nodeState('risk') === 'bad' ? NODE_TILE.bad : nodeState('risk') === 'warn' ? NODE_TILE.warn : NODE_TILE.okRoyal },
    { icon: ShieldCheck, label: 'POLICY', sub: blockedCalls > 0 ? `${blockedCalls} blocked` : '9 policies on', state: nodeState('policy'), tile: nodeState('policy') === 'bad' ? NODE_TILE.bad : NODE_TILE.okTeal },
    { icon: Bot, label: 'AGENT', sub: pendingCalls > 0 ? `${pendingCalls} waiting` : 'Running', state: nodeState('agent'), tile: nodeState('agent') === 'warn' ? NODE_TILE.warn : NODE_TILE.okRoyal },
    { icon: Wrench, label: 'TOOL', sub: blockedCalls > 0 ? `${blockedCalls} blocked` : `${calls.length} calls`, state: nodeState('tool'), tile: nodeState('tool') === 'bad' ? NODE_TILE.bad : nodeState('tool') === 'warn' ? NODE_TILE.warn : NODE_TILE.okTeal },
  ]

  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Security Console"
        title="Agent Monitor"
        subtitle="The four mock tools the assistant can call — and what actually happened to each call."
      />

      <Card>
        <CardHeader title="Request pipeline" subtitle="Every request flows through the same seven stages. A stage turns orange or dark red when it stops something unsafe." />
        <div className="p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
            {nodes.map((n, i) => (
              <div key={n.label} className="flex flex-1 items-center gap-2">
                <div className="flex-1"><FlowNode {...n} /></div>
                {i < nodes.length - 1 && <ChevronRight size={18} className={cx('hidden shrink-0 md:block', n.state === 'bad' ? 'text-crimson' : n.state === 'warn' ? 'text-flame' : 'text-aqua/60')} />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-ink/55 dark:text-mist/55">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-aqua" />Teal · Input & policy checks</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-royal" />Indigo · AI analysis</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-flame" />Orange · Warning</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-crimson" />Dark Red · Blocked</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total tools" value={toolStats.length} icon={Wrench} hint="Mock tools in the sandbox" />
        <Stat label="Total calls" value={calls.length} hint={`${calls.filter((c) => c.status === 'EXECUTED').length} ran`} />
        <Stat label="Blocked calls" value={blockedCalls} tone="text-crimson-deep dark:text-crimson-soft" hint={`${pendingCalls} waiting for a decision`} />
        <Stat label="Tools restricted" value={restrictedTools} hint="With at least one blocked call" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {toolStats.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-royal/10 text-royal-deep dark:text-royal-soft ring-1 ring-royal/25">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="flex gap-1.5">
                <Badge value="ACTIVE">ACTIVE</Badge>
                <Badge value={t.blocked > 0 ? 'BLOCKED' : 'INFO'}>{t.blocked > 0 ? 'Restricted' : 'Monitored'}</Badge>
              </span>
            </div>
            <div className="mt-3 text-base font-bold text-ink dark:text-white">{t.name}</div>
            <div className="font-mono text-xs text-ink/55 dark:text-mist/55">{t.fn} · {t.permission}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65 dark:text-mist/65">{t.desc}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-ink/10 dark:border-mist/10 pt-3 text-sm sm:grid-cols-4">
              <div><dt className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 dark:text-mist/50">Risk Level</dt><dd className="mt-1"><Badge value={RISK_BADGE[t.risk] || 'NONE'}>{t.risk}</Badge></dd></div>
              <div><dt className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 dark:text-mist/50">Permission</dt><dd className="mt-1 font-mono text-xs font-bold text-ink dark:text-white">{t.permission}</dd></div>
              <div><dt className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 dark:text-mist/50">Calls</dt><dd className="mt-1 font-mono text-base font-bold text-ink dark:text-white">{t.total}</dd></div>
              <div><dt className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 dark:text-mist/50">Blocked</dt><dd className={cx('mt-1 font-mono text-base font-bold', t.blocked > 0 ? 'text-crimson-deep dark:text-crimson-soft' : 'text-kelly-deep dark:text-kelly-soft')}>{t.blocked}</dd></div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink/65 dark:text-mist/65">
              <span><strong className="text-kelly-deep dark:text-kelly-soft">{t.executed}</strong> ran</span>
              {t.pending > 0 && <span><strong className="text-flame-deep dark:text-flame-soft">{t.pending}</strong> waiting</span>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Agent activity timeline" right={<Link to="/admin/events" className="text-xs text-aqua-deep dark:text-aqua-soft hover:underline">Open the full audit log →</Link>} />
        {events.length === 0 ? (
          <Empty>No activity yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 dark:border-mist/10 text-left text-[10px] uppercase tracking-wider text-ink/50 dark:text-mist/50">
                  <th className="px-4 py-2.5 first:pl-5">Time</th>
                  <th className="px-4 py-2.5">Event</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Risk</th>
                  <th className="px-4 py-2.5">Decision</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-ink/[0.06] dark:border-mist/[0.05] last:border-0 transition-colors hover:bg-ink/[0.03] dark:hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap py-2.5 pl-5 pr-4 font-mono text-ink/55 dark:text-mist/55">{fmtTime(e.ts)}</td>
                    <td className="px-4 py-2.5">
                      <span className="block text-sm font-semibold text-ink dark:text-white">{e.type}</span>
                      <span className="block text-sm text-ink/65 dark:text-mist/65">{e.description}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-ink/65 dark:text-mist/65">{e.userName}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono font-bold text-ink dark:text-white">{e.risk}/100</td>
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
