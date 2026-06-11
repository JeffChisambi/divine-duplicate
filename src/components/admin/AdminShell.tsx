import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, CalendarCheck, Calendar, Settings, LogOut, Menu } from 'lucide-react'
import { validateSession, logoutAdmin } from '../../server/auth'

const C = {
  rose: 'oklch(0.56 0.11 5)',
  soft: 'oklch(0.93 0.04 5)',
  deep: 'oklch(0.46 0.13 5)',
  muted: 'oklch(0.62 0.02 240)',
  fg: 'oklch(0.22 0.02 240)',
  bg: '#f8f7f6',
}

const NAV = [
  { to: '/admin/', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Bookings', Icon: CalendarCheck, exact: false },
  { to: '/admin/calendar', label: 'Calendar', Icon: Calendar, exact: false },
  { to: '/admin/settings', label: 'Settings', Icon: Settings, exact: false },
]

export interface AdminShellProps {
  children: ReactNode
  title: string
}

export function AdminShell({ children, title }: AdminShellProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('admin_token') ?? '') : ''
    if (!token) { navigate({ to: '/admin/login' }); return }
    validateSession({ data: { token } })
      .then((r) => {
        if (!r.valid) { localStorage.removeItem('admin_token'); navigate({ to: '/admin/login' }) }
        else { setUsername(r.username ?? ''); setLoading(false) }
      })
      .catch(() => { localStorage.removeItem('admin_token'); navigate({ to: '/admin/login' }) })
  }, [])

  const logout = async () => {
    const token = localStorage.getItem('admin_token') ?? ''
    await logoutAdmin({ data: { token } }).catch(() => {})
    localStorage.removeItem('admin_token')
    navigate({ to: '/admin/login' })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.soft }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 26, color: C.deep, letterSpacing: '-0.01em' }}>Olivia's Nails</div>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: C.rose, marginTop: 6 }}>LOADING...</div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'var(--font-sans,sans-serif)' }}>
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 240, background: 'white', borderRight: `1px solid ${C.soft}`,
        display: 'flex', flexDirection: 'column', transition: 'transform 0.25s ease',
        transform: open ? 'translateX(0)' : undefined,
      }} className={!open ? 'max-md:-translate-x-full' : ''}>
        <div style={{ padding: '26px 24px 20px', borderBottom: `1px solid ${C.soft}` }}>
          <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, color: C.deep, lineHeight: 1.2 }}>
            Olivia's Nails
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: C.rose, marginTop: 4 }}>ADMIN PORTAL</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV.map(({ to, label, Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to)
            return (
              <button key={to} onClick={() => { navigate({ to }); setOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 11, width: '100%',
                padding: '10px 24px', fontSize: 13, color: active ? C.deep : C.muted,
                background: active ? C.soft : 'transparent',
                borderLeft: `3px solid ${active ? C.rose : 'transparent'}`,
                border: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none',
                borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: active ? C.rose : 'transparent',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <Icon size={15} strokeWidth={1.6} />
                {label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.soft}` }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
            Signed in as <span style={{ color: C.deep, fontWeight: 500 }}>{username}</span>
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '8px 12px', fontSize: 11, letterSpacing: '0.12em',
            color: C.rose, background: 'transparent', border: `1px solid ${C.soft}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <LogOut size={13} strokeWidth={1.6} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="md:ml-[240px]" style={{ flex: 1, minWidth: 0 }}>
        <header style={{
          height: 58, background: 'white', borderBottom: `1px solid ${C.soft}`,
          display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button className="md:hidden" onClick={() => setOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.deep }}>
            <Menu size={20} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, fontWeight: 400, color: C.deep, margin: 0, flex: 1 }}>
            {title}
          </h1>
          <span style={{ fontSize: 11, color: C.muted, letterSpacing: '0.06em' }}>
            {new Date().toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </header>
        <main style={{ padding: '28px 28px 48px' }}>{children}</main>
      </div>
    </div>
  )
}
