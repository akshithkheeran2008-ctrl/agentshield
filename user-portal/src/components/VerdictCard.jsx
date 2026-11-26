import { ShieldCheck, AlertTriangle, Ban, Clock, CheckCircle2, XCircle } from 'lucide-react'
import {
  verdictOf,
  attackTypePlain,
  statusText,
  callStatusText,
  sourceLabel,
} from '../lib/requests.js'
import { Badge, Card, CardHeader, Button, ScoreBar, fmtTime, timeAgo } from './ui.jsx'

const VERDICT_ICON = {
  safe: ShieldCheck,
  review: AlertTriangle,
  blocked: Ban,
}

const STATUS_BADGE = {
  allowed: 'SAFE',
  awaiting: 'REVIEW',
  approved: 'APPROVED',
  denied: 'BLOCKED',
}

const CALL_BADGE = {
  safe: 'SAFE',
  review: 'REVIEW',
  blocked: 'BLOCKED',
}

export default function VerdictCard({ request, showAdminActions = false, onDecide }) {
  const { scan, agent } = request
  const v = verdictOf(scan)
  const st = statusText(request.status)
  const Icon = VERDICT_ICON[v.tone] || ShieldCheck

  return (
    <div className="space-y-4">
      {/* Verdict */}
      <Card>
        <CardHeader icon={Icon} title={v.headline} subtitle={v.blurb} right={<Badge value={STATUS_BADGE[request.status] || 'NONE'}>{st.label}</Badge>} />
        <div className="p-5">
          <ScoreBar score={scan.score} level={scan.level} />
          <div className="mt-4 grid gap-2 text-sm text-ink/65 dark:text-mist/65 sm:grid-cols-2">
            <div><span className="font-semibold text-ink dark:text-white">Attack: </span>{attackTypePlain(scan.attackType)}</div>
            <div><span className="font-semibold text-ink dark:text-white">Checked: </span>{fmtTime(request.ts)} ({timeAgo(request.ts)})</div>
            <div><span className="font-semibold text-ink dark:text-white">Came from: </span>{sourceLabel(request.source)}{request.resource ? ` · ${request.resource}` : ''}</div>
            <div className="sm:col-span-2"><span className="font-semibold text-ink dark:text-white">Your request: </span>{request.goal}</div>
          </div>

          {request.status === 'awaiting' && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-flame/30 bg-flame/10 p-3 text-sm text-flame-deep dark:text-flame-soft">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>Waiting for admin decision.</strong> An admin will review this request. Nothing risky has run, and the assistant is on hold until then.</span>
            </div>
          )}
          {request.decisionBy && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-ink/10 dark:border-mist/10 bg-ink/[0.03] dark:bg-white/[0.02] p-3 text-sm text-ink/70 dark:text-mist/70">
              {request.status === 'approved' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-kelly-deep dark:text-kelly-soft" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson-deep dark:text-crimson-soft" />}
              <span><strong>Decided by {request.decisionBy}</strong> · {fmtTime(request.decisionTs)}. {request.decisionNote}</span>
            </div>
          )}

          {showAdminActions && request.status === 'awaiting' && onDecide && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 dark:border-mist/10 pt-4">
              <Button variant="success" icon={CheckCircle2} onClick={() => onDecide(request.id, 'approve')}>
                Approve — run the safe actions
              </Button>
              <Button variant="danger" icon={XCircle} onClick={() => onDecide(request.id, 'deny')}>
                Deny — block it
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Why this score — one card per detection reason */}
      <Card>
        <CardHeader title="Why this score" subtitle="Every point is explained — nothing is just a colour." />
        <div className="p-5">
          {scan.signals.length === 0 ? (
            <p className="text-sm text-ink/65 dark:text-mist/65">No warning signs were found in the words. The pattern checker also gave this a clean result.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {scan.signals.map((s) => (
                <li key={s.id} className="rounded-xl border border-flame/25 bg-flame/[0.06] p-3.5 dark:border-flame/25 dark:bg-flame/[0.07]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-bold text-ink dark:text-white">{s.label}</div>
                    <span className="shrink-0 rounded-full bg-flame/15 px-2 py-0.5 text-xs font-bold text-flame-deep dark:text-flame-soft ring-1 ring-inset ring-flame/30">+{s.weight} pts</span>
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-ink/65 dark:text-mist/65">{s.explain}</div>
                  {s.matches && s.matches.length > 0 && (
                    <div className="mt-2 font-mono text-xs text-ink/50 dark:text-mist/50">Matched: {s.matches.slice(0, 3).join(' · ')}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-ink/65 dark:text-mist/65">
            The pattern checker (a small trained classifier) added{' '}
            <strong className="text-ink dark:text-white">{scan.classifier.points} points</strong>{' '}
            with a confidence of {Math.round(scan.classifier.prob * 100)}%.
            {scan.decoded && scan.decoded.length > 0 && (
              <> Hidden encoded text was decoded and checked too: {scan.decoded.map((d) => `"${d}"`).join(', ')}.</>
            )}
            {scan.zeroWidth > 0 && <> {scan.zeroWidth} invisible characters were found and removed before checking.</>}
          </p>
        </div>
      </Card>

      {/* What the assistant tried to do */}
      <Card>
        <CardHeader title="What the assistant tried to do" subtitle="Each action the assistant planned, and whether it ran. Nothing here moves real money or sends real email — this is a sandbox." />
        <div className="p-5">
          <ul className="space-y-2">
            {agent.calls.map((c) => {
              const cs = callStatusText(c)
              return (
                <li key={c.id} className="rounded-xl border border-ink/10 dark:border-mist/10 bg-ink/[0.03] dark:bg-white/[0.02] px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink dark:text-white">{c.label}</span>
                    <Badge value={CALL_BADGE[cs.tone] || 'NONE'}>{cs.label}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-ink/65 dark:text-mist/65">
                    {c.tainted ? 'This action came from the untrusted content, not from you. ' : ''}
                    {c.reason}
                  </div>
                  {c.result && c.tool === 'payment_lookup' && c.result.balance && (
                    <div className="mt-1.5 rounded-lg bg-white dark:bg-black/30 px-2.5 py-2 font-mono text-xs text-ink/65 dark:text-mist/65 ring-1 ring-ink/10 dark:ring-mist/10">
                      {c.result.name} · Balance {c.result.balance}
                    </div>
                  )}
                  {c.result && c.result.draft_id && (
                    <div className="mt-1.5 rounded-lg bg-white dark:bg-black/30 px-2.5 py-2 font-mono text-xs text-ink/65 dark:text-mist/65 ring-1 ring-ink/10 dark:ring-mist/10">
                      Draft {c.result.draft_id} · {c.result.status} · To {c.result.to}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-sm text-ink/65 dark:text-mist/65">
            Assistant status: <strong className="text-ink dark:text-white">{agent.status}</strong> — {agent.summary}
          </p>
        </div>
      </Card>
    </div>
  )
}
