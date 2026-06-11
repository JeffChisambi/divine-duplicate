import { createServerFn } from '@tanstack/react-start'
import bcrypt from 'bcryptjs'
import { query, initDb, type AdminRow } from '../lib/db.server'

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export const loginAdmin = createServerFn({ method: 'POST' })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    await initDb()
    if (!checkRateLimit(data.username)) {
      return { success: false as const, error: 'Too many attempts. Wait 15 minutes.' }
    }
    const { rows } = await query<AdminRow>('SELECT * FROM admins WHERE username = $1', [data.username])
    if (!rows.length) return { success: false as const, error: 'Invalid credentials.' }
    const valid = await bcrypt.compare(data.password, rows[0].password_hash)
    if (!valid) return { success: false as const, error: 'Invalid credentials.' }
    loginAttempts.delete(data.username)
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await query('INSERT INTO sessions (id, admin_id, expires_at) VALUES ($1, $2, $3)', [
      token, rows[0].id, expiresAt.toISOString(),
    ])
    return { success: true as const, token, username: rows[0].username }
  })

export const validateSession = createServerFn({ method: 'POST' })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) return { valid: false as const }
    await initDb()
    const { rows } = await query<{ admin_id: number; username: string; expires_at: string }>(
      `SELECT s.admin_id, a.username, s.expires_at
       FROM sessions s JOIN admins a ON s.admin_id = a.id WHERE s.id = $1`,
      [data.token],
    )
    if (!rows.length) return { valid: false as const }
    if (new Date(rows[0].expires_at) < new Date()) {
      await query('DELETE FROM sessions WHERE id = $1', [data.token])
      return { valid: false as const }
    }
    return { valid: true as const, adminId: rows[0].admin_id, username: rows[0].username }
  })

export const logoutAdmin = createServerFn({ method: 'POST' })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await initDb()
    await query('DELETE FROM sessions WHERE id = $1', [data.token])
    return { success: true as const }
  })

export const changePassword = createServerFn({ method: 'POST' })
  .inputValidator((data: { token: string; oldPassword: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    await initDb()
    const { rows: sessions } = await query<{ admin_id: number }>(
      'SELECT admin_id FROM sessions WHERE id = $1 AND expires_at > NOW()',
      [data.token],
    )
    if (!sessions.length) return { success: false as const, error: 'Unauthorized' }
    const { rows: admins } = await query<AdminRow>('SELECT * FROM admins WHERE id = $1', [sessions[0].admin_id])
    if (!admins.length) return { success: false as const, error: 'Admin not found' }
    if (!(await bcrypt.compare(data.oldPassword, admins[0].password_hash)))
      return { success: false as const, error: 'Current password is incorrect' }
    if (data.newPassword.length < 8)
      return { success: false as const, error: 'New password must be at least 8 characters' }
    const hash = await bcrypt.hash(data.newPassword, 12)
    await query('UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, sessions[0].admin_id])
    await query('DELETE FROM sessions WHERE admin_id = $1 AND id != $2', [sessions[0].admin_id, data.token])
    return { success: true as const }
  })
