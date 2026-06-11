import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { getBookingsByDate, getBookingsForDay } from '../../server/bookings'
import type { BookingRow } from '../../lib/db'

export const Route = createFileRoute('/admin/calendar')({ component: CalendarPage })

const C = { rose: 'oklch(0.56 0.11 5)', soft: 'oklch(0.93 0.04 5)', deep: 'oklch(0.46 0.13 5)', muted: 'oklch(0.62 0.02 240)', fg: 'oklch(0.22 0.02 240)' }
const STATUS_DOT: Record<string, string> = { pending: '#f59e0b', confirmed: '#10b981', completed: '#8b5cf6', cancelled: '#9ca3af' }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-indexed
  const [dayData, setDayData] = useState<Record<string, { count: number; statuses: string[] }>>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dayBookings, setDayBookings] = useState<BookingRow[]>([])
  const [dayLoading, setDayLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token') ?? ''
    getBookingsByDate({ data: { token, year, month } }).then((rows) => {
      const map: Record<string, { count: number; statuses: string[] }> = {}
      for (const r of rows) {
        const d = r.preferred_date.slice(0, 10)
        map[d] = { count: parseInt(r.count), statuses: r.statuses ? r.statuses.split(',') : [] }
      }
      setDayData(map)
    })
  }, [year, month])

  const loadDay = async (dateStr: string) => {
    setSelectedDate(dateStr)
    setDayLoading(true)
    const token = localStorage.getItem('admin_token') ?? ''
    const rows = await getBookingsForDay({ data: { token, date: dateStr } })
    setDayBookings(rows)
    setDayLoading(false)
  }

  const prevMonth = () => { if (month === 1) { setYear(y => y - 1); setMonth(12) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 12) { setYear(y => y + 1); setMonth(1) } else setMonth(m => m + 1) }

  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const todayStr = now.toISOString().slice(0, 10)

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'Pending',   color: '#92400e', bg: '#fef3c7' },
    confirmed: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5' },
    completed: { label: 'Completed', color: '#5b21b6', bg: '#ede9fe' },
    cancelled: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6' },
  }

  return (
    <AdminShell title="Calendar">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }} className="max-lg:grid-cols-1">
        {/* Calendar */}
        <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${C.soft}` }}>
            <button onClick={prevMonth} style={{ background: 'none', border: `1px solid ${C.soft}`, cursor: 'pointer', padding: '6px 8px', color: C.rose, display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, fontWeight: 400, color: C.deep, margin: 0 }}>
              {MONTHS[month - 1]} {year}
            </h2>
            <button onClick={nextMonth} style={{ background: 'none', border: `1px solid ${C.soft}`, cursor: 'pointer', padding: '6px 8px', color: C.rose, display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {DAYS.map((d) => (
              <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 10, letterSpacing: '0.15em', color: C.muted, borderBottom: `1px solid ${C.soft}` }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} style={{ borderBottom: `1px solid ${C.soft}`, borderRight: (i+1)%7!==0?`1px solid ${C.soft}`:'none', minHeight: 72, background: '#fafaf9' }} />
              const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const data = dayData[dateStr]
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              return (
                <div key={day} onClick={() => loadDay(dateStr)} style={{
                  padding: '8px', minHeight: 72, cursor: 'pointer', transition: 'background 0.15s',
                  background: isSelected ? C.soft : 'white',
                  borderBottom: `1px solid ${C.soft}`,
                  borderRight: (i+1)%7!==0?`1px solid ${C.soft}`:'none',
                  outline: isToday ? `2px solid ${C.rose}` : 'none', outlineOffset: -2,
                }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 600 : 400, color: isToday ? C.rose : C.fg, marginBottom: 4 }}>{day}</div>
                  {data && (
                    <div>
                      <div style={{ fontSize: 10, color: C.rose, fontWeight: 500, marginBottom: 3 }}>{data.count} appt{data.count !== 1 ? 's' : ''}</div>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {data.statuses.map((s) => <div key={s} style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_DOT[s] ?? C.muted }} />)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ padding: '14px 22px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(STATUS_DOT).map(([s, color]) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Day Detail */}
        <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.soft}` }}>
            <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 17, fontWeight: 400, color: C.deep, margin: 0 }}>
              {selectedDate
                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : 'Select a day'}
            </h3>
          </div>
          <div style={{ padding: '16px 20px', minHeight: 200 }}>
            {!selectedDate && <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Click any date on the calendar to view appointments.</p>}
            {selectedDate && dayLoading && <p style={{ fontSize: 13, color: C.muted }}>Loading...</p>}
            {selectedDate && !dayLoading && dayBookings.length === 0 && (
              <p style={{ fontSize: 13, color: C.muted }}>No appointments on this day.</p>
            )}
            {dayBookings.map((b) => {
              const sm = STATUS_META[b.status]
              return (
                <div key={b.id} style={{ padding: '12px 14px', marginBottom: 10, borderLeft: `3px solid ${STATUS_DOT[b.status] ?? C.muted}`, background: '#fafaf9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 500, color: C.fg, fontSize: 14 }}>{b.first_name}</div>
                    <span style={{ display: 'inline-block', padding: '1px 8px', fontSize: 10, background: sm.bg, color: sm.color, borderRadius: 9999 }}>{sm.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{b.service}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {b.preferred_time}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{b.phone}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
