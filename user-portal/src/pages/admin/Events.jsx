import { useState } from 'react'
import { Download } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { allEvents } from '../../lib/requests.js'
import { Badge, Button, Card, PageHeader, Empty, cx, fmtTime } from '../../components/ui.jsx'

function toCsv(rows) {
  const head = ['time', 'user', 'type', 'description', 'risk', 'decision', 'reason']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [head.join(','), ...rows.map((r) => head.map((h) => esc(r[h])).join(','))].join('\n')
}

const DECISION_BADGE = { BLOCKED: 'BLOCKED', APPROVED: 'APPROVED', REVIEW: 'REVIEW' }

export default function Events() {
  const { store } = useStore()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const events = allEvents(store)

  const filtered = events.filter((e) => {
    if (filter === 'blocked' && e.decision !== 'BLOCKED') return false
    if (filter === 'approved' && e.decision !== 'APPROVED') return false
    if (filter === 'flagged' && !(e.type.includes('INJECTION') || e.type.includes('SUSPICIOUS') || e.type.includes('DEVIATION'))) return false
    if (query && !`${e.description} ${e.type} ${e.userName}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const downloadCsv = () => {
    const rows = filtered.map((e) => ({
      time: new Date(e.ts).toISOString(),
      user: e.userEmail,
      type: e.type,
      description: e.description,
      risk: e.risk,
      decision: e.decision,
      reason: e.reason,
    }))
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agentshield-events.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fade-up space-y-4">
      <PageHeader
        eyebrow="Audit Log"
        title="Events — Audit Log"
        subtitle="Every check, block, approval and denial, with its reasons. Nothing is hidden."
        actions={<Button variant="secondary" icon={Download} onClick={downloadCsv}>Export CSV</Button>}
      />

      <Card className="flex flex-wrap gap-2 p-3">
        {[
          ['all', 'All events'],
          ['blocked', 'Blocked'],
          ['approved', 'Approved'],
          ['flagged', 'Flagged'],
        ].map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setFilter(v)}
            className={cx('rounded-full px-3 py-1.5 text-sm font-semibold', filter === v ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08]')}
          >
            {label}
          </button>
        ))}
        <input className="input !w-auto flex-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events…" />
      </Card>

      {filtered.length === 0 ? (
        <Card><Empty>No events match — try a different filter or search.</Empty></Card>
      ) : (
        <Card className="overflow-x-auto">
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
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 dark:border-white/[0.04] last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap py-2.5 pl-5 pr-4 font-mono text-slate-500 dark:text-slate-400">{fmtTime(e.ts)}</td>
                  <td className="px-4 py-2.5">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{e.type}</span>
                    <span className="block text-sm text-slate-600 dark:text-slate-400">{e.description}</span>
                    {e.reason && <span className="block text-xs text-slate-500 dark:text-slate-400">{e.reason}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-600 dark:text-slate-400">{e.userName}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{e.risk}/100</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <Badge value={DECISION_BADGE[e.decision] || 'NONE'}>{e.decision}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
