import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CalendarDays, CheckCircle2, Clock, XCircle, Sparkles, BookOpen } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { getBookingStats, getBookings } from '../../server/bookings'
import type { BookingRow } from '../../lib/db'

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
})

const C = { rose: 'oklch(0.56 0.11 5)', soft: 'oklch(0.93 0.04 5)', deep: 'oklch(0.46 0.13 5)', muted: 'oklch(0.62 0.02 240)', fg: 'oklch(0.22 0.02 240)' }

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#92400e', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5' },
  completed: { label: 'Completed', color: '#5b21b6', bg: '#ede9fe' },
  cancelled: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6' },
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', fontSize: 11, letterSpacing: '0.05em',
      background: m.bg, color: m.color, borderRadius: 9999, fontWeight: 500,
    }}>{m.label}</span>
  )
}

function StatCard({ label, value, Icon, accent }: { label: string; value: number; Icon: React.ElementType; accent: string }) {
  return (
    <div style={{
      background: 'white', padding: '20px 22px', borderLeft: `3px solid ${accent}`,
      boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: C.muted, marginBottom: 10 }}>{label}</div>
          <div style={{ fontSize: 32, fontFamily: 'var(--font-serif,serif)', color: C.deep, lineHeight: 1 }}>{value}</div>
        </div>
        <div style={{ padding: 10, background: C.soft, borderRadius: 8 }}>
          <Icon size={18} color={accent} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, upcoming: 0 })
  const [recent, setRecent] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token') ?? ''
    Promise.all([
      getBookingStats({ data: { token } }),
      getBookings({ data: { token, sortBy: 'newest', pageSize: 6 } }),
    ]).then(([s, b]) => {
      setStats(s)
      setRecent(b.bookings)
      setLoading(false)
    }).catch(console.error)
  }, [])

  const statCards = [
    { label: 'TOTAL BOOKINGS',   value: stats.total,     Icon: BookOpen,      accent: C.rose },
    { label: 'PENDING',          value: stats.pending,   Icon: Clock,         accent: '#f59e0b' },
    { label: 'CONFIRMED',        value: stats.confirmed, Icon: CheckCircle2,  accent: '#10b981' },
    { label: 'COMPLETED',        value: stats.completed, Icon: Sparkles,      accent: '#8b5cf6' },
    { label: 'CANCELLED',        value: stats.cancelled, Icon: XCircle,       accent: '#9ca3af' },
    { label: 'UPCOMING',         value: stats.upcoming,  Icon: CalendarDays,  accent: C.deep },
  ]

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: 13 }}>Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
            {statCards.map((c) => <StatCard key={c.label} {...c} />)}
          </div>

          {/* Recent Bookings */}
          <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            <div style={{
              padding: '18px 24px', borderBottom: `1px solid ${C.soft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 17, fontWeight: 400, color: C.deep, margin: 0 }}>
                Recent Bookings
              </h2>
              <button onClick={() => navigate({ to: '/admin/bookings' })} style={{
                fontSize: 11, letterSpacing: '0.12em', color: C.rose,
                background: 'none', border: 'none', cursor: 'pointer',
              }}>VIEW ALL →</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {recent.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
                  No bookings yet. They'll appear here as clients submit requests.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.soft }}>
                      {['Client', 'Service', 'Date', 'Time', 'Status'].map((h) => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, letterSpacing: '0.15em', color: C.muted, fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((b, i) => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${C.soft}`, background: i % 2 === 0 ? 'white' : '#fafaf9' }}>
                        <td style={{ padding: '12px 16px', color: C.fg, fontWeight: 500 }}>{b.first_name}</td>
                        <td style={{ padding: '12px 16px', color: C.muted }}>{b.service}</td>
                        <td style={{ padding: '12px 16px', color: C.muted }}>
                          {new Date(b.preferred_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 16px', color: C.muted }}>{b.preferred_time}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
}
