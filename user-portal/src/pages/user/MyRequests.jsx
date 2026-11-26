import { Link } from 'react-router-dom'
import { useStore } from '../../store.jsx'
import { requestsForUser, statusText } from '../../lib/requests.js'
import { Badge, Card, PageHeader, EmptyState, timeAgo } from '../../components/ui.jsx'

export default function MyRequests() {
  const { session, store } = useStore()
  const mine = requestsForUser(store, session.email)

  return (
    <div className="fade-up space-y-4">
      <PageHeader
        eyebrow="Your Account"
        title="My Requests"
        subtitle="Only you can see these. Each one shows what the check found and whether the assistant ran, is waiting, or was stopped."
      />
      {mine.length === 0 ? (
        <EmptyState
          title="No requests yet"
          body="Check a request from My Assistant — it will appear here with its verdict and status."
        />
      ) : (
        <div className="space-y-2">
          {mine.map((r) => (
            <Card key={r.id} className="transition hover:-translate-y-0.5">
              <Link to={`/requests/${r.id}`} className="block px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.name} — {r.goal}</span>
                  <span className="flex items-center gap-2">
                    <Badge value={r.scan.level}>
                      {r.scan.level === 'SAFE' ? 'Safe' : r.scan.level === 'LOW' ? 'Needs review' : 'Blocked'} · {r.scan.score}/100
                    </Badge>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{statusText(r.status).label}</span>
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {r.id} · {timeAgo(r.ts)} · {r.agent.calls.length} action{r.agent.calls.length === 1 ? '' : 's'} planned ·{' '}
                  {r.agent.calls.filter((c) => c.status === 'EXECUTED').length} ran,{' '}
                  {r.agent.calls.filter((c) => c.status === 'BLOCKED').length} blocked
                  {r.agent.calls.some((c) => c.status === 'PENDING') ? `, ${r.agent.calls.filter((c) => c.status === 'PENDING').length} waiting` : ''}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
