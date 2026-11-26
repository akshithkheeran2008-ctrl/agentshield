import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Shield, LogOut, Home, ListChecks, CircleHelp, FlaskConical, LayoutDashboard, Inbox, Users, ScrollText, ShieldCheck, Sun, Moon, Menu, X, LayoutGrid, Monitor, Layers, Info } from 'lucide-react'
import { useStore } from '../store.jsx'
import { currentTheme, applyTheme } from '../lib/theme.js'

function Brand({ home }) {
  return (
    <Link to={home} className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Shield className="h-6 w-6" />
      </span>
      <span className="leading-tight">
        <span className="block text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Zer0-Neuro</span>
        <span className="block text-xs font-semibold text-blue-700 dark:text-blue-400">AgentShield</span>
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
      className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
    >
      <n.icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{n.label}</span>
      {n.to === '/admin/queue' && awaiting > 0 && (
        <span className="ml-1 shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">{awaiting}</span>
      )}
    </NavLink>
  )
}

function NavSection({ label, nav, awaiting, onNavigate }) {
  return (
    <div>
      <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <nav className="space-y-1" aria-label="Main">
        {nav.map((n) => (
          <NavItem key={n.to} n={n} awaiting={awaiting} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}

function AdminNav({ awaiting, onNavigate }) {
  return (
    <div className="space-y-5">
      <nav className="space-y-1" aria-label="Product">
        <NavItem n={ADMIN_OVERVIEW} awaiting={awaiting} onNavigate={onNavigate} />
      </nav>
      <NavSection label="Security Console" nav={ADMIN_CONSOLE} awaiting={awaiting} onNavigate={onNavigate} />
      <NavSection label="Information" nav={ADMIN_INFO} awaiting={awaiting} onNavigate={onNavigate} />
    </div>
  )
}

function SidebarFooter({ session, isAdmin, initials, theme, setTheme, signOut, threatLevel }) {
  const threatTone =
    threatLevel === 'HIGH'
      ? 'text-red-600 dark:text-red-400'
      : threatLevel === 'MEDIUM'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-700 dark:text-emerald-400'
  return (
    <div className="mt-auto space-y-3 px-4 pb-5 pt-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" /> System Status
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">All systems operational</p>
        {isAdmin && (
          <dl className="mt-2 space-y-1 border-t border-slate-200 dark:border-slate-700 pt-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Engine</dt>
              <dd className="font-semibold text-slate-700 dark:text-slate-300">In-browser</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">AgentShield Environment</dt>
              <dd className="font-semibold text-slate-700 dark:text-slate-300">SANDBOX</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">System</dt>
              <dd className="font-semibold text-emerald-700 dark:text-emerald-400">PROTECTED</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Threat Level</dt>
              <dd className={`font-bold ${threatTone}`}>{threatLevel}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{initials}</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-200">{session?.name}</span>
            <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">{session?.email}</span>
          </span>
          {!isAdmin && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              User
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="mt-2.5 rounded-full bg-violet-100 dark:bg-violet-900/40 px-2.5 py-1 text-center text-[11px] font-bold text-violet-800 dark:text-violet-300">
            ZN Zer0-Neuro SOC Analyst
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="btn btn-ghost flex-1 !px-2 !py-1.5 text-xs"
            onClick={() => setTheme(applyTheme(theme === 'dark' ? 'light' : 'dark'))}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button type="button" className="btn btn-ghost flex-1 !px-2 !py-1.5 text-xs" onClick={signOut} title="Sign out / switch account">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">AgentShield v1.0 · Zer0-Neuro</p>
    </div>
  )
}

export default function Layout() {
  const { session, signOut, store } = useStore()
  const [theme, setTheme] = useState(currentTheme)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = session?.role === 'admin'
  const nav = USER_NAV
  const sectionLabel = 'Your Account'
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
  const footerProps = { session, isAdmin, initials, theme, setTheme, signOut, threatLevel }
  const navContent = isAdmin
    ? <AdminNav awaiting={awaiting} />
    : <NavSection label={sectionLabel} nav={nav} awaiting={awaiting} />

  return (
    <div className="flex min-h-screen">
      {/* Fixed left sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-[#050b18] lg:flex">
        <div className="px-4 pb-2 pt-5">
          <Brand home={isAdmin ? '/admin' : '/'} />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {navContent}
        </div>
        <SidebarFooter {...footerProps} />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#050b18] px-4 py-3 lg:hidden">
          <Brand home={isAdmin ? '/admin' : '/'} />
          <button
            type="button"
            className="btn btn-ghost !px-3"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#050b18] px-4 py-4 lg:hidden">
            {isAdmin ? <AdminNav awaiting={awaiting} onNavigate={() => setMobileOpen(false)} /> : <NavSection label={sectionLabel} nav={nav} awaiting={awaiting} onNavigate={() => setMobileOpen(false)} />}
            <div className="mt-4">
              <SidebarFooter {...footerProps} />
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-700 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Demo — synthetic data only. No real money, email, or data. All checks run in your browser.
        </footer>
      </div>
    </div>
  )
}
