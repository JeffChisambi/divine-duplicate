import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('sslmode=disable')
        ? false
        : { rejectUnauthorized: false },
    })
  }
  return pool
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[] }> {
  const result = await getPool().query(text, params)
  return { rows: result.rows as T[] }
}

let initialized = false

export async function initDb(): Promise<void> {
  if (initialized) return
  initialized = true

  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(36) PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      service VARCHAR(255) NOT NULL,
      preferred_date DATE NOT NULL,
      preferred_time VARCHAR(10) NOT NULL,
      notes TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','confirmed','completed','cancelled')),
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`)
  await query(`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date)`)
  await query(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`)

  const { rows } = await query<{ id: number }>('SELECT id FROM admins LIMIT 1')
  if (rows.length === 0) {
    const pwd = process.env.ADMIN_PASSWORD || 'admin123'
    const hash = await bcrypt.hash(pwd, 12)
    await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash])
    console.log('[DB] Default admin created — username: admin, password:', pwd)
  }
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingRow {
  id: number
  first_name: string
  phone: string
  email: string | null
  service: string
  preferred_date: string
  preferred_time: string
  notes: string | null
  status: BookingStatus
  submitted_at: string
  updated_at: string
}

export interface AdminRow {
  id: number
  username: string
  password_hash: string
  created_at: string
  updated_at: string
}
