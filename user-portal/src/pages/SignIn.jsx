import { User, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '../store.jsx'
import { Card } from '../components/ui.jsx'

export default function SignIn() {
  const { accounts, signIn } = useStore()
  const cards = [
    {
      account: accounts.user,
      icon: User,
      tone: 'bg-aqua/10 text-aqua-deep dark:text-aqua-soft ring-aqua/20',
      title: 'Demo User',
      desc: 'See your own requests, check a new one, and watch what the assistant does — in plain language.',
      cta: 'Continue as Demo User',
    },
    {
      account: accounts.admin,
      icon: ShieldCheck,
      tone: 'bg-royal/10 text-royal-deep dark:text-royal-soft ring-royal/20',
      title: 'Admin',
      desc: 'See every user’s requests, approve or deny the ones waiting, and review the full audit log.',
      cta: 'Continue as Admin',
    },
  ]
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5">
        <img src="/shield.svg" alt="" className="h-10 w-10" />
        <span className="leading-tight">
          <span className="block text-xl font-bold tracking-tight text-ink dark:text-white">Zer0-Neuro</span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-ink/60 dark:text-mist/55">AgentShield</span>
        </span>
      </div>
      <p className="mt-4 max-w-xl text-center text-sm leading-relaxed text-ink/70 dark:text-mist/60">
        AgentShield checks every request before your assistant acts. If a hidden instruction
        in a document or email tries to push it somewhere you did not ask, it gets stopped —
        and you get told why, in plain language.
      </p>

      <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.account.email} className="p-6">
            <button type="button" onClick={() => signIn(c.account)} className="block w-full text-left">
              <span className={`grid h-11 w-11 place-items-center rounded-lg ring-1 ${c.tone}`}>
                <c.icon className="h-6 w-6" />
              </span>
              <span className="mt-3 block text-lg font-bold text-ink dark:text-white">{c.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink/70 dark:text-mist/60">{c.desc}</span>
              <span className="mt-3 block font-mono text-xs text-ink/60 dark:text-mist/60">{c.account.email}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-flame dark:text-aqua-soft">
                {c.cta} <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </Card>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-center text-xs leading-relaxed text-ink/60 dark:text-mist/60">
        Demo accounts — no password, no sign-up. Pick a card to enter.
        Demo — synthetic data only. No real money, email, or data.
        Everything runs in your browser; switching accounts just changes whose panel you see.
      </p>
    </div>
  )
}
