import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store.jsx'
import { allRequests, usersWithRequests, statusText } from '../../lib/requests.js'
import { Badge, Card, PageHeader, EmptyState, timeAgo } from '../../components/ui.jsx'

export default function AllRequests() {
  const { store } = useStore()
  const [userFilter, setUserFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const users = usersWithRequests(store)

  const list = allRequests(store).filter((r) => {
    if (userFilter !== 'all' && r.userEmail !== userFilter) return false
    if (levelFilter !== 'all' && r.scan.level !== levelFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (query && !`${r.goal} ${r.name} ${r.userName}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="fade-up space-y-4">
      <PageHeader
        eyebrow="Security Console"
        title="All Requests"
        subtitle="Every request from every user. Open one to see its full verdict, or open a user’s panel to see it as they see it."
      />

      <Card className="flex flex-wrap gap-2 p-3">
        <select className="input !w-auto" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} aria-label="Filter by user">
          <option value="all">All users</option>
          {users.map((u) => <option key={u.email} value={u.email}>{u.name} ({u.count})</option>)}
        </select>
        <select className="input !w-auto" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} aria-label="Filter by risk level">
          <option value="all">All risk levels</option>
          <option value="SAFE">Safe</option>
          <option value="LOW">Low</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="allowed">Allowed</option>
          <option value="awaiting">Waiting for decision</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
        <input className="input !w-auto flex-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by goal, user or request name" />
      </Card>

      {list.length === 0 ? (
        <EmptyState title="No requests match" body="Try clearing a filter — or check a new request from the user view." />
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <Card key={r.id} className="px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link to={`/admin/requests/${r.id}`} className="text-sm font-bold text-ink dark:text-white hover:text-flame dark:hover:text-aqua-soft">
                  {r.userName} — {r.name}: {r.goal}
                </Link>
                <span className="flex items-center gap-2">
                  <Badge value={r.scan.level}>{r.scan.level} · {r.scan.score}/100</Badge>
                  <span className="text-xs font-semibold text-ink/70 dark:text-mist/60">{statusText(r.status).label}</span>
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-ink/60 dark:text-mist/60">
                <span>{r.id} · {timeAgo(r.ts)}</span>
                <span>{r.userEmail}</span>
                <Link to={`/admin/requests/${r.id}`} className="font-semibold text-flame dark:text-aqua-soft">Open request →</Link>
                <Link to={`/admin/users/${encodeURIComponent(r.userEmail)}`} className="font-semibold text-flame dark:text-aqua-soft">
                  Open {r.userName}’s panel →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
