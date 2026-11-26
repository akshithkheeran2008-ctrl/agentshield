import { ShieldCheck } from 'lucide-react'
import { useStore } from '../../store.jsx'
import { POLICIES, TOOLS, RISK_BANDS, modelInfo } from '../../lib/requests.js'
import { Badge, Card, CardHeader, PageHeader, cx } from '../../components/ui.jsx'

const SEVERITY_BADGE = { CRITICAL: 'CRITICAL', HIGH: 'HIGH' }
const BAND_DOT = { SAFE: 'bg-kelly', LOW: 'bg-flame', HIGH: 'bg-crimson', CRITICAL: 'bg-crimson' }

export default function Policies() {
  const { store, togglePolicy } = useStore()
  const policies = store.policies

  return (
    <div className="fade-up space-y-6">
      <PageHeader
        eyebrow="Security Console"
        title="Policies"
        subtitle="The nine rules checked before any tool runs. Turning one off affects future checks only — past decisions stay as they were. This is the operator view; users never see these controls."
      />

      <div className="space-y-2">
        {POLICIES.map((p) => {
          const on = policies[p.id] !== false
          return (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-royal/10 text-royal-deep dark:text-royal-soft ring-1 ring-royal/25">
                  <ShieldCheck size={17} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-aqua-deep dark:text-aqua-soft">{p.id}</span>
                    <span className="text-sm font-bold text-ink dark:text-white">{p.name}</span>
                    <Badge value={SEVERITY_BADGE[p.severity] || 'INFO'}>{p.severity}</Badge>
                    <Badge value="AI">{p.action}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink/65 dark:text-mist/65">{p.description}</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`Toggle policy ${p.id}`}
                onClick={() => togglePolicy(p.id, !on)}
                className={cx('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-kelly' : 'bg-mist dark:bg-white/20')}
              >
                <span className={cx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-6' : 'left-1')} />
              </button>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="How the score decides" />
          <div className="space-y-2 p-5">
            {RISK_BANDS.map((b) => (
              <div key={b.level} className="flex items-center justify-between rounded-xl border border-ink/10 dark:border-mist/10 bg-ink/[0.03] dark:bg-white/[0.02] px-3 py-2 text-sm">
                <span className="flex items-center gap-2 font-bold text-ink dark:text-white"><span className={cx('h-2.5 w-2.5 rounded-full', BAND_DOT[b.level])} />{b.plain}</span>
                <span className="text-ink/65 dark:text-mist/65">{b.action}</span>
              </div>
            ))}
          </div>
          <p className="px-5 pb-5 text-sm text-ink/65 dark:text-mist/65">
            Score = sum of the warning-signal points + classifier points, capped at 100.
            The classifier is TF-IDF / logistic regression, trained on {modelInfo.samples} samples
            (vocabulary {modelInfo.vocab.toLocaleString()}, CV F1 {modelInfo.cvF1}).
          </p>
        </Card>

        <Card>
          <CardHeader title="Mock tools in the sandbox" />
          <ul className="space-y-2 p-5">
            {Object.entries(TOOLS).map(([id, t]) => (
              <li key={id} className="rounded-xl border border-ink/10 dark:border-mist/10 bg-ink/[0.03] dark:bg-white/[0.02] px-3 py-2">
                <span className="text-sm font-bold text-ink dark:text-white">{t.name} <span className="font-mono text-xs text-aqua-deep dark:text-aqua-soft">({id})</span></span>
                <span className="block text-sm text-ink/65 dark:text-mist/65">{t.desc}</span>
                <span className="mt-0.5 block text-xs font-semibold text-ink/55 dark:text-mist/55">Permission {t.permission} · Risk {t.risk}</span>
              </li>
            ))}
            <li className="rounded-xl border border-crimson/30 bg-crimson/10 px-3 py-2">
              <span className="text-sm font-bold text-crimson-deep dark:text-crimson-soft">transfer_money · approve_payment — not registered</span>
              <span className="block text-sm text-crimson-deep/80 dark:text-crimson-soft/80">Any attempt to call these is always refused, whatever the score says.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
