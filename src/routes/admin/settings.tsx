import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { changePassword, validateSession } from '../../server/auth'

export const Route = createFileRoute('/admin/settings')({ component: SettingsPage })

const C = { rose: 'oklch(0.56 0.11 5)', soft: 'oklch(0.93 0.04 5)', deep: 'oklch(0.46 0.13 5)', muted: 'oklch(0.62 0.02 240)', fg: 'oklch(0.22 0.02 240)' }

function SettingsPage() {
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState<{ type: 'success'|'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box', padding: '11px 14px', fontSize: 14, color: C.fg,
    border: `1px solid ${focused ? C.rose : C.soft}`, outline: 'none', background: 'white', transition: 'border-color 0.2s',
  })
  const [focusField, setFocusField] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!oldPw || !newPw || !confirmPw) { setMsg({ type: 'error', text: 'All fields are required.' }); return }
    if (newPw !== confirmPw) { setMsg({ type: 'error', text: 'New passwords do not match.' }); return }
    if (newPw.length < 8) { setMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return }
    const token = localStorage.getItem('admin_token') ?? ''
    setLoading(true)
    try {
      const res = await changePassword({ data: { token, oldPassword: oldPw, newPassword: newPw } })
      if (res.success) {
        setMsg({ type: 'success', text: 'Password changed successfully. Please use your new password next time you sign in.' })
        setOldPw(''); setNewPw(''); setConfirmPw('')
      } else {
        setMsg({ type: 'error', text: res.error ?? 'Failed to change password.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminShell title="Settings">
      <div style={{ maxWidth: 520 }}>
        {/* Security card */}
        <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', marginBottom: 20 }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.soft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={17} color={C.rose} strokeWidth={1.5} />
            <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 17, fontWeight: 400, color: C.deep, margin: 0 }}>
              Change Password
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { id: 'old', label: 'CURRENT PASSWORD', value: oldPw, onChange: setOldPw },
                { id: 'new', label: 'NEW PASSWORD',     value: newPw, onChange: setNewPw },
                { id: 'con', label: 'CONFIRM NEW PASSWORD', value: confirmPw, onChange: setConfirmPw },
              ].map(({ id, label, value, onChange }) => (
                <div key={id}>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', color: C.rose, marginBottom: 7 }}>{label}</label>
                  <input
                    type="password" value={value} onChange={(e) => onChange(e.target.value)}
                    style={inputStyle(focusField === id)}
                    onFocus={() => setFocusField(id)} onBlur={() => setFocusField('')}
                  />
                </div>
              ))}

              {msg && (
                <div style={{
                  padding: '11px 14px', fontSize: 13,
                  background: msg.type === 'success' ? '#d1fae5' : '#fff1f1',
                  color: msg.type === 'success' ? '#065f46' : '#be123c',
                  border: `1px solid ${msg.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
                }}>
                  {msg.text}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                padding: '13px', fontSize: 11, letterSpacing: '0.2em',
                color: 'white', background: loading ? C.muted : C.rose,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: 9999, transition: 'background 0.2s',
              }}>
                {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
            </div>
          </form>
        </div>

        {/* Info card */}
        <div style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', padding: '20px 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 15, fontWeight: 400, color: C.deep, margin: '0 0 14px' }}>Security Notes</h3>
          {[
            'Passwords are hashed with bcrypt (cost factor 12).',
            'Sessions expire after 24 hours.',
            'After a password change, all other active sessions are invalidated.',
            'After 5 failed login attempts, the account is rate-limited for 15 minutes.',
            'The admin portal is not linked from the public website.',
          ].map((note, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 12, color: C.muted, alignItems: 'flex-start' }}>
              <span style={{ color: C.rose, flexShrink: 0 }}>—</span>
              {note}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
