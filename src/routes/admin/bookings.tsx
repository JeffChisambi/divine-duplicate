import { useEffect, useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, ChevronDown, Trash2, RefreshCw } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { getBookings, updateBookingStatus, deleteBooking } from '../../server/bookings'
import type { BookingRow, BookingStatus } from '../../lib/db.server'

export const Route = createFileRoute('/admin/bookings')({ component: BookingsPage })

const C = { rose: 'oklch(0.56 0.11 5)', soft: 'oklch(0.93 0.04 5)', deep: 'oklch(0.46 0.13 5)', muted: 'oklch(0.62 0.02 240)', fg: 'oklch(0.22 0.02 240)' }

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#92400e', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5' },
  completed: { label: 'Completed', color: '#5b21b6', bg: '#ede9fe' },
  cancelled: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6' },
}

const SERVICES = ['Gel Manicure', 'Classic Manicure', 'Gel Extensions', 'Nail Art', 'Pedicure', 'Gel Pedicure', 'Gel Removal']
const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return <span style={{ display: 'inline-block', padding: '2px 10px', fontSize: 11, background: m.bg, color: m.color, borderRadius: 9999, fontWeight: 500 }}>{m.label}</span>
}

function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'newest'|'oldest'|'upcoming'|'status'>('newest')
  const [detail, setDetail] = useState<BookingRow | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [statusEdit, setStatusEdit] = useState<{ id: number; current: BookingStatus } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const PAGE_SIZE = 20

  const load = useCallback(async (p = 1) => {
    const token = localStorage.getItem('admin_token') ?? ''
    setLoading(true)
    try {
      const res = await getBookings({ data: { token, search: search||undefined, status: statusFilter, service: serviceFilter, sortBy, page: p, pageSize: PAGE_SIZE } })
      setBookings(res.bookings); setTotal(res.total); setPage(p)
    } finally { setLoading(false) }
  }, [search, statusFilter, serviceFilter, sortBy])

  useEffect(() => { load(1) }, [load])

  const handleStatusUpdate = async (id: number, status: BookingStatus) => {
    const token = localStorage.getItem('admin_token') ?? ''
    setActionLoading(true)
    try {
      await updateBookingStatus({ data: { token, id, status } })
      setStatusEdit(null)
      if (detail && detail.id === id) setDetail({ ...detail, status })
      load(page)
    } finally { setActionLoading(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const token = localStorage.getItem('admin_token') ?? ''
    setActionLoading(true)
    try { await deleteBooking({ data: { token, id: deleteId } }); setDeleteId(null); load(page) }
    finally { setActionLoading(false) }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', fontSize: 12, color: C.fg,
    border: `1px solid ${C.soft}`, outline: 'none', background: 'white',
    transition: 'border-color 0.2s',
  }

  return (
    <AdminShell title="Bookings">
      {/* Filters */}
      <div style={{ background: 'white', padding: '18px 20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or service…"
              style={{ ...inputStyle, paddingLeft: 32, width: '100%', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = C.rose)} onBlur={e => (e.target.style.borderColor = C.soft)} />
          </div>
          {[
            { value: statusFilter, onChange: setStatusFilter, options: [['all','All Statuses'], ...STATUSES.map((s) => [s, STATUS_META[s].label])] },
            { value: serviceFilter, onChange: setServiceFilter, options: [['all','All Services'], ...SERVICES.map((s) => [s, s])] },
            { value: sortBy, onChange: (v: string) => setSortBy(v as typeof sortBy), options: [['newest','Newest First'],['oldest','Oldest First'],['upcoming','Upcoming First'],['status','By Status']] },
          ].map(({ value, onChange, options }, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <select value={value} onChange={(e) => onChange(e.target.value)}
                style={{ ...inputStyle, paddingRight: 28, appearance: 'none', cursor: 'pointer', minWidth: 140 }}>
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
          ))}
          <button onClick={() => load(1)} style={{ padding: '8px 14px', background: C.soft, border: 'none', cursor: 'pointer', color: C.rose, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <RefreshCw size={13} />REFRESH
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: C.muted }}>
          {total} booking{total !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: C.muted, fontSize: 13 }}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: C.muted, fontSize: 13 }}>No bookings found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 680 }}>
            <thead>
              <tr style={{ background: C.soft }}>
                {['#', 'Client', 'Service', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, letterSpacing: '0.15em', color: C.muted, fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${C.soft}`, background: i % 2 === 0 ? 'white' : '#fafaf9' }}>
                  <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12 }}>{b.id}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ color: C.fg, fontWeight: 500 }}>{b.first_name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{b.phone}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: C.muted, maxWidth: 160 }}>{b.service}</td>
                  <td style={{ padding: '12px 14px', color: C.muted, whiteSpace: 'nowrap' }}>
                    {new Date(b.preferred_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 14px', color: C.muted, whiteSpace: 'nowrap' }}>{b.preferred_time}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setDetail(b)} style={{ padding: '5px 10px', fontSize: 11, border: `1px solid ${C.soft}`, background: 'white', color: C.rose, cursor: 'pointer' }}>View</button>
                      <button onClick={() => setStatusEdit({ id: b.id, current: b.status })} style={{ padding: '5px 10px', fontSize: 11, border: `1px solid ${C.soft}`, background: 'white', color: C.muted, cursor: 'pointer' }}>Status</button>
                      <button onClick={() => setDeleteId(b.id)} style={{ padding: '5px 10px', fontSize: 11, border: `1px solid #fee2e2`, background: '#fff1f1', color: '#be123c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => load(p)} style={{
              width: 34, height: 34, fontSize: 12, border: `1px solid ${p === page ? C.rose : C.soft}`,
              background: p === page ? C.rose : 'white', color: p === page ? 'white' : C.muted, cursor: 'pointer',
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <Modal onClose={() => setDetail(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, color: C.deep, margin: '0 0 20px', fontWeight: 400 }}>Booking Details</h3>
          {([
            ['Client', detail.first_name], ['Phone', detail.phone], ['Email', detail.email || '—'],
            ['Service', detail.service], ['Date', new Date(detail.preferred_date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
            ['Time', detail.preferred_time], ['Notes', detail.notes || '—'],
            ['Submitted', new Date(detail.submitted_at).toLocaleString('en-ZA')],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.soft}`, fontSize: 13 }}>
              <span style={{ width: 90, fontSize: 10, letterSpacing: '0.15em', color: C.muted, flexShrink: 0, paddingTop: 1 }}>{k.toUpperCase()}</span>
              <span style={{ color: C.fg, flex: 1 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.12em', color: C.muted }}>STATUS:</span>
            <StatusBadge status={detail.status} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
            {STATUSES.filter((s) => s !== detail.status).map((s) => (
              <button key={s} disabled={actionLoading} onClick={async () => { await handleStatusUpdate(detail.id, s); setDetail({ ...detail, status: s }) }} style={{
                padding: '7px 14px', fontSize: 11, letterSpacing: '0.1em',
                background: STATUS_META[s].bg, color: STATUS_META[s].color,
                border: 'none', cursor: 'pointer',
              }}>MARK {s.toUpperCase()}</button>
            ))}
          </div>
        </Modal>
      )}

      {/* Status Update Modal */}
      {statusEdit && (
        <Modal onClose={() => setStatusEdit(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, color: C.deep, margin: '0 0 20px', fontWeight: 400 }}>Update Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STATUSES.map((s) => (
              <button key={s} disabled={actionLoading} onClick={() => handleStatusUpdate(statusEdit.id, s)} style={{
                padding: '12px 16px', textAlign: 'left', fontSize: 13,
                background: s === statusEdit.current ? STATUS_META[s].bg : 'white',
                border: `1px solid ${s === statusEdit.current ? STATUS_META[s].color : C.soft}`,
                color: STATUS_META[s].color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {s === statusEdit.current && <span>✓</span>}
                <StatusBadge status={s} />
                {s === statusEdit.current && <span style={{ fontSize: 11, color: C.muted }}>(current)</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <Modal onClose={() => setDeleteId(null)}>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, color: C.deep, margin: '0 0 12px', fontWeight: 400 }}>Delete Booking?</h3>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 24px' }}>This action cannot be undone. The booking record will be permanently removed.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '11px', fontSize: 12, border: `1px solid ${C.soft}`, background: 'white', color: C.muted, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleDelete} disabled={actionLoading} style={{ flex: 1, padding: '11px', fontSize: 12, background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer' }}>
              {actionLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const C2 = { soft: 'oklch(0.93 0.04 5)' }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '28px 28px 24px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
        {children}
      </div>
    </div>
  )
}
