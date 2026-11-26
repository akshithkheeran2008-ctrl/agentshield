import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LogOut, Home, ListChecks, CircleHelp, FlaskConical, LayoutDashboard, Inbox, Users, ScrollText, ShieldCheck, Sun, Moon, Menu, X, LayoutGrid, Monitor, Layers, Info, Cpu } from 'lucide-react'
import { useStore } from '../store.jsx'
import { currentTheme, applyTheme } from '../lib/theme.js'
import { Badge, cx } from './ui.jsx'

function Brand({ home }) {
  return (
    <Link to={home} className="flex items-center gap-2.5" aria-label="AgentShield home">
      <img src="/shield.svg" alt="" className="h-8 w-8" />
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">Zer0-Neuro</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">AgentShield</span>
      </span>
    </Link>
  )
}

const USER_NAV = [
  { to: '/', label: 'My Assistant', icon: Home, end: true },
  { to: '/requests', label: 'My Requests', icon: ListChecks },
  { to: '/lab', label: 'Prompt Lab', icon: FlaskConical },
  { to: '/how-it-works', label: 'How it works', icon: CircleHelp },
]

const ADMIN_OVERVIEW = { to: '/admin/overview', label: 'Product Overview', icon: LayoutGrid }
const ADMIN_CONSOLE = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/queue', label: 'Approval Queue', icon: Inbox },
  { to: '/admin/requests', label: 'All Requests', icon: Users },
  { to: '/admin/simulator', label: 'Attack Simulator', icon: FlaskConical },
  { to: '/admin/agents', label: 'Agent Monitor', icon: Monitor },
  { to: '/admin/policies', label: 'Policies', icon: ShieldCheck },
  { to: '/admin/events', label: 'Events', icon: ScrollText },
]
const ADMIN_INFO = [
  { to: '/admin/architecture', label: 'Architecture', icon: Layers },
  { to: '/admin/about', label: 'About', icon: Info },
]

function NavItem({ n, awaiting, onNavigate }) {
  return (
    <NavLink
      key={n.to}
      to={n.to}
      end={n.end}
      onClick={onNavigate}
      className={({ isActive }) => cx('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
        isActive ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200')}
    >
      <n.icon size={16} />
      <span className="min-w-0 flex-1 truncate">{n.label}</span>
      {n.to === '/admin/queue' && awaiting > 0 && (
        <span className="ml-auto rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">{awaiting}</span>
      )}
    </NavLink>
  )
}

function NavSection({ label, nav, awaiting, onNavigate }) {
  return (
    <div>
      <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-600">{label}</div>
      <nav className="space-y-0.5" aria-label="Main">
        {nav.map((n) => (
          <NavItem key={n.to} n={n} awaiting={awaiting} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}

function AdminNav({ awaiting, onNavigate }) {
  return (
    <div className="space-y-0.5">
      <nav className="space-y-0.5" aria-label="Product">
        <NavItem n={ADMIN_OVERVIEW} awaiting={awaiting} onNavigate={onNavigate} />
      </nav>
      <NavSection label="Security Console" nav={ADMIN_CONSOLE} awaiting={awaiting} onNavigate={onNavigate} />
      <NavSection label="Information" nav={ADMIN_INFO} awaiting={awaiting} onNavigate={onNavigate} />
    </div>
  )
}

function Sidebar({ open, onClose, isAdmin, awaiting, threatLevel, session, initials, children }) {
  return (
    <>
      <div className={cx('fixed inset-0 z-30 bg-black/60 lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside className={cx('fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0f1c]/95 backdrop-blur transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')} aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between px-5">
          <Brand home={isAdmin ? '/admin' : '/'} />
          <button className="text-slate-400 lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {isAdmin ? <AdminNav awaiting={awaiting} onNavigate={onClose} /> : <NavSection label="Your Account" nav={USER_NAV} awaiting={awaiting} onNavigate={onClose} />}
        </nav>
        <div className="m-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">System Status</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200"><span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />All Systems Operational</div>
          {isAdmin && (
            <dl className="mt-2 space-y-1 border-t border-slate-200 dark:border-white/[0.06] pt-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500"><Cpu size={12} />Engine: <span className="font-semibold text-slate-700 dark:text-slate-300">In-browser</span></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500 dark:text-slate-500">AgentShield Environment</dt><dd className="font-semibold text-slate-700 dark:text-slate-300">SANDBOX</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500 dark:text-slate-500">System</dt><dd className="font-semibold text-emerald-600 dark:text-emerald-400">PROTECTED</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500 dark:text-slate-500">Threat Level</dt><dd className={cx('font-bold', threatLevel === 'HIGH' ? 'text-red-600 dark:text-red-400' : threatLevel === 'MEDIUM' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}>{threatLevel}</dd></div>
            </dl>
          )}
        </div>
        {children}
      </aside>
    </>
  )
}

function SidebarAccount({ session, isAdmin, initials }) {
  return (
    <div className="mx-3 mb-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blue-600 text-[11px] font-bold text-white">{initials}</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{session?.name}</span>
          <span className="block truncate text-[10px] text-slate-500 dark:text-slate-500">{session?.email}</span>
        </span>
        {!isAdmin && (
          <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-500/20">User</span>
        )}
      </div>
      {isAdmin && (
        <div className="mt-2.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-center text-[11px] font-bold text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-500/20">
          ZN Zer0-Neuro SOC Analyst
        </div>
      )}
      <p className="mt-2.5 text-center text-[11px] font-medium text-slate-500 dark:text-slate-500">AgentShield v1.0 · Zer0-Neuro</p>
    </div>
  )
}

function TopBar({ onMenu, threatLevel, theme, setTheme, signOut }) {
  const threatValue = threatLevel === 'HIGH' ? 'HIGH' : threatLevel === 'MEDIUM' ? 'MEDIUM' : 'SAFE'
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#070b14]/80 px-4 backdrop-blur md:px-6">
      <button className="text-slate-500 dark:text-slate-400 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="hidden text-sm font-semibold text-slate-900 dark:text-white sm:block">AgentShield</div>
      <div className="hidden items-center gap-2 md:flex">
        <span className="text-xs text-slate-500 dark:text-slate-500">Environment</span><Badge value="INFO">SANDBOX</Badge>
        <span className="ml-2 text-xs text-slate-500 dark:text-slate-500">System</span><Badge value="SAFE" dot>PROTECTED</Badge>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <span className="hidden text-xs text-slate-500 dark:text-slate-500 sm:inline">Threat Level</span>
        <Badge value={threatValue}>{threatLevel}</Badge>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
          onClick={() => setTheme(applyTheme(theme === 'dark' ? 'light' : 'dark'))}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
          onClick={signOut}
          title="Sign out / switch account"
          aria-label="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}

export default function Layout() {
  const { session, signOut, store } = useStore()
  const [theme, setTheme] = useState(currentTheme)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const isAdmin = session?.role === 'admin'
  const awaiting = store.requests.filter((r) => r.status === 'awaiting').length
  const awaitingReqs = store.requests.filter((r) => r.status === 'awaiting')
  const threatLevel = awaitingReqs.some((r) => r.scan.score >= 60)
    ? 'HIGH'
    : awaitingReqs.some((r) => r.scan.score >= 30)
      ? 'MEDIUM'
      : 'LOW'
  const initials = isAdmin
    ? 'ZN'
    : (session?.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} isAdmin={isAdmin} awaiting={awaiting} threatLevel={threatLevel} session={session} initials={initials}>
        <SidebarAccount session={session} isAdmin={isAdmin} initials={initials} />
      </Sidebar>
      <div className="min-w-0 overflow-x-clip lg:pl-64">
        <TopBar onMenu={() => setOpen(true)} threatLevel={threatLevel} theme={theme} setTheme={setTheme} signOut={signOut} />
        <main key={loc.pathname} className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 dark:border-white/[0.06] py-4 text-center text-xs text-slate-500 dark:text-slate-500">
          Demo — synthetic data only. No real money, email, or data. All checks run in your browser.
        </footer>
      </div>
    </div>
  )
}
