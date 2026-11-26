import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { awaitingRequests, attackTypePlain } from '../../lib/requests.js'
import { Badge, Button, PageHeader, EmptyState, timeAgo } from '../../components/ui.jsx'
import VerdictCard from '../../components/VerdictCard.jsx'

export default function Queue() {
  const { store, decide } = useStore()
  const queue = awaitingRequests(store)

  return (
    <div className="fade-up space-y-4">
      <PageHeader
        eyebrow="Security Console"
        title="Approval Queue"
        subtitle="Every request that scored 30 or higher, or had an action held for review. Approve runs the held actions in the sandbox; deny blocks them. Actions the policies already blocked stay blocked either way. Your decision shows up in the user’s panel straight away."
      />

      {queue.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          body="No requests are waiting for a decision. Risky requests from any user will appear here, oldest first."
        />
      ) : (
        <div className="space-y-5">
          {queue.map((r) => (
            <article key={r.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-ink dark:text-white">{r.userName} — {r.goal}</h2>
                  <p className="text-sm text-ink/60 dark:text-mist/60">
                    {r.id} · {r.userEmail} · {timeAgo(r.ts)} · {attackTypePlain(r.scan.attackType)}
                  </p>
                </div>
                <Badge value={r.scan.level}>{r.scan.level} · {r.scan.score}/100</Badge>
              </div>
              <VerdictCard request={r} showAdminActions onDecide={(id, d) => decide(id, d)} />
              <div className="flex flex-wrap gap-2">
                <Button variant="success" icon={CheckCircle2} onClick={() => decide(r.id, 'approve')}>Approve</Button>
                <Button variant="danger" icon={XCircle} onClick={() => decide(r.id, 'deny')}>Deny</Button>
                <Link to={`/admin/requests/${r.id}`}><Button>Open full detail</Button></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
