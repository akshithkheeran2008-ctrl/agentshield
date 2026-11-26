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
          <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
            <div><span className="font-semibold text-slate-800 dark:text-slate-200">Attack: </span>{attackTypePlain(scan.attackType)}</div>
            <div><span className="font-semibold text-slate-800 dark:text-slate-200">Checked: </span>{fmtTime(request.ts)} ({timeAgo(request.ts)})</div>
            <div><span className="font-semibold text-slate-800 dark:text-slate-200">Came from: </span>{sourceLabel(request.source)}{request.resource ? ` · ${request.resource}` : ''}</div>
            <div className="sm:col-span-2"><span className="font-semibold text-slate-800 dark:text-slate-200">Your request: </span>{request.goal}</div>
          </div>

          {request.status === 'awaiting' && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>Waiting for admin decision.</strong> An admin will review this request. Nothing risky has run, and the assistant is on hold until then.</span>
            </div>
          )}
          {request.decisionBy && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 text-sm text-slate-700 dark:text-slate-300">
              {request.status === 'approved' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
              <span><strong>Decided by {request.decisionBy}</strong> · {fmtTime(request.decisionTs)}. {request.decisionNote}</span>
            </div>
          )}

          {showAdminActions && request.status === 'awaiting' && onDecide && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 dark:border-white/[0.06] pt-4">
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

      {/* Why this score */}
      <Card>
        <CardHeader title="Why this score" subtitle="Every point is explained — nothing is just a colour." />
        <div className="p-5">
          {scan.signals.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">No warning signs were found in the words. The pattern checker also gave this a clean result.</p>
          ) : (
            <ul className="space-y-2">
              {scan.signals.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-3 py-2.5">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{s.explain}</div>
                    {s.matches && s.matches.length > 0 && (
                      <div className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">Matched: {s.matches.slice(0, 3).join(' · ')}</div>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-white dark:bg-white/[0.04] px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-white/10">+{s.weight} pts</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            The pattern checker (a small trained classifier) added{' '}
            <strong className="text-slate-800 dark:text-slate-200">{scan.classifier.points} points</strong>{' '}
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
                <li key={c.id} className="rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                    <Badge value={CALL_BADGE[cs.tone] || 'NONE'}>{cs.label}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {c.tainted ? 'This action came from the untrusted content, not from you. ' : ''}
                    {c.reason}
                  </div>
                  {c.result && c.tool === 'payment_lookup' && c.result.balance && (
                    <div className="mt-1.5 rounded-lg bg-white dark:bg-black/30 px-2.5 py-2 font-mono text-xs text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10">
                      {c.result.name} · Balance {c.result.balance}
                    </div>
                  )}
                  {c.result && c.result.draft_id && (
                    <div className="mt-1.5 rounded-lg bg-white dark:bg-black/30 px-2.5 py-2 font-mono text-xs text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10">
                      Draft {c.result.draft_id} · {c.result.status} · To {c.result.to}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Assistant status: <strong className="text-slate-800 dark:text-slate-200">{agent.status}</strong> — {agent.summary}
          </p>
        </div>
      </Card>
    </div>
  )
}
