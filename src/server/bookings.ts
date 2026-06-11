import { createServerFn } from '@tanstack/react-start'
import { query, initDb, type BookingRow, type BookingStatus } from '../lib/db'

async function requireAuth(token: string): Promise<number> {
  const { rows } = await query<{ admin_id: number; expires_at: string }>(
    'SELECT admin_id, expires_at FROM sessions WHERE id = $1',
    [token],
  )
  if (!rows.length || new Date(rows[0].expires_at) < new Date()) throw new Error('Unauthorized')
  return rows[0].admin_id
}

export const createBooking = createServerFn({ method: 'POST' })
  .validator((data: {
    firstName: string; phone: string; email?: string; service: string
    date: string; time: string; notes?: string
  }) => data)
  .handler(async ({ data }) => {
    await initDb()
    const { rows } = await query<BookingRow>(
      `INSERT INTO bookings (first_name,phone,email,service,preferred_date,preferred_time,notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [data.firstName, data.phone, data.email||null, data.service, data.date, data.time, data.notes||null],
    )
    return { success: true as const, booking: rows[0] }
  })

export const getBookings = createServerFn({ method: 'POST' })
  .validator((data: {
    token: string; search?: string; status?: string; service?: string
    date?: string; sortBy?: 'newest'|'oldest'|'upcoming'|'status'
    page?: number; pageSize?: number
  }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    const conds: string[] = []
    const params: unknown[] = []
    let p = 1
    if (data.search) {
      conds.push(`(first_name ILIKE $${p} OR phone ILIKE $${p} OR service ILIKE $${p})`)
      params.push(`%${data.search}%`); p++
    }
    if (data.status && data.status !== 'all') { conds.push(`status = $${p}`); params.push(data.status); p++ }
    if (data.service && data.service !== 'all') { conds.push(`service = $${p}`); params.push(data.service); p++ }
    if (data.date) { conds.push(`preferred_date = $${p}`); params.push(data.date); p++ }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''
    const orderMap = { newest:'submitted_at DESC', oldest:'submitted_at ASC', upcoming:'preferred_date ASC,preferred_time ASC', status:'status ASC,preferred_date ASC' }
    const order = orderMap[data.sortBy ?? 'newest']
    const pageSize = data.pageSize ?? 25
    const page = data.page ?? 1
    const offset = (page - 1) * pageSize
    const { rows: countRows } = await query<{ count: string }>(`SELECT COUNT(*) as count FROM bookings ${where}`, params)
    const { rows } = await query<BookingRow>(`SELECT * FROM bookings ${where} ORDER BY ${order} LIMIT $${p} OFFSET $${p+1}`, [...params, pageSize, offset])
    return { bookings: rows, total: parseInt(countRows[0].count), page, pageSize }
  })

export const updateBookingStatus = createServerFn({ method: 'POST' })
  .validator((data: { token: string; id: number; status: BookingStatus }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    const { rows } = await query<BookingRow>(`UPDATE bookings SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *`, [data.status, data.id])
    if (!rows.length) throw new Error('Booking not found')
    return { success: true as const, booking: rows[0] }
  })

export const deleteBooking = createServerFn({ method: 'POST' })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    await query('DELETE FROM bookings WHERE id = $1', [data.id])
    return { success: true as const }
  })

export const getBookingStats = createServerFn({ method: 'POST' })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    const { rows } = await query<{ status: string; count: string }>('SELECT status, COUNT(*) as count FROM bookings GROUP BY status')
    const stats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, upcoming: 0 }
    for (const r of rows) { const c = parseInt(r.count); (stats as Record<string,number>)[r.status] = c; stats.total += c }
    const { rows: up } = await query<{ count: string }>(`SELECT COUNT(*) as count FROM bookings WHERE preferred_date >= CURRENT_DATE AND status IN ('pending','confirmed')`)
    stats.upcoming = parseInt(up[0].count)
    return stats
  })

export const getBookingsByDate = createServerFn({ method: 'POST' })
  .validator((data: { token: string; year: number; month: number }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    const { rows } = await query<{ preferred_date: string; count: string; statuses: string }>(
      `SELECT preferred_date::text, COUNT(*) as count, string_agg(DISTINCT status,',') as statuses
       FROM bookings WHERE EXTRACT(YEAR FROM preferred_date)=$1 AND EXTRACT(MONTH FROM preferred_date)=$2
       GROUP BY preferred_date ORDER BY preferred_date`,
      [data.year, data.month],
    )
    return rows
  })

export const getBookingsForDay = createServerFn({ method: 'POST' })
  .validator((data: { token: string; date: string }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await requireAuth(data.token)
    const { rows } = await query<BookingRow>('SELECT * FROM bookings WHERE preferred_date=$1 ORDER BY preferred_time ASC', [data.date])
    return rows
  })
