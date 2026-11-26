import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { requestsForUser, statusText } from '../../lib/requests.js'
import { Badge, Card, PageHeader, EmptyState, timeAgo } from '../../components/ui.jsx'

export default function UserPanel() {
  const { email } = useParams()
  const userEmail = decodeURIComponent(email || '')
  const { store } = useStore()
  const list = requestsForUser(store, userEmail)
  const name = list[0]?.userName || userEmail

  return (
    <div className="fade-up space-y-4">
      <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm font-semibold text-flame dark:text-aqua-soft">
        <ArrowLeft className="h-4 w-4" /> Back to all requests
      </Link>
      <PageHeader
        eyebrow="Security Console"
        title={`${name}’s panel`}
        subtitle={`Viewing as admin — this is exactly what ${name} sees in their own panel: only their requests, with the same verdicts and statuses. You can open any request to approve or deny it.`}
      />
      <p className="-mt-3 font-mono text-xs text-ink/60 dark:text-mist/60">{userEmail}</p>

      {list.length === 0 ? (
        <EmptyState title="No requests from this user" body="This user has not submitted anything yet." />
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <Card key={r.id} className="transition hover:-translate-y-0.5">
              <Link to={`/admin/requests/${r.id}`} className="block px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-ink dark:text-white">{r.name} — {r.goal}</span>
                  <span className="flex items-center gap-2">
                    <Badge value={r.scan.level}>
                      {r.scan.level === 'SAFE' ? 'Safe' : r.scan.level === 'LOW' ? 'Needs review' : 'Blocked'} · {r.scan.score}/100
                    </Badge>
                    <span className="text-xs font-semibold text-ink/70 dark:text-mist/60">{statusText(r.status).label}</span>
                  </span>
                </div>
                <div className="mt-1 text-xs text-ink/60 dark:text-mist/60">{r.id} · {timeAgo(r.ts)}</div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
