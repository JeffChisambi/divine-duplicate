import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { loginAdmin } from '../../server/auth'

export const Route = createFileRoute('/admin/login')({
  component: LoginPage,
})

const C = { rose: 'oklch(0.56 0.11 5)', soft: 'oklch(0.93 0.04 5)', deep: 'oklch(0.46 0.13 5)', muted: 'oklch(0.62 0.02 240)' }

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) { setError('Please enter your credentials.'); return }
    setLoading(true); setError('')
    try {
      const res = await loginAdmin({ data: { username: username.trim(), password } })
      if (res.success) {
        localStorage.setItem('admin_token', res.token)
        navigate({ to: '/admin/' } as never)
      } else {
        setError(res.error ?? 'Login failed.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.soft,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-sans,sans-serif)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 32, color: C.deep, letterSpacing: '-0.01em', lineHeight: 1 }}>
            Olivia's Nails
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: C.rose, marginTop: 8 }}>ADMIN ACCESS</div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', padding: '36px 36px 32px', boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 18, fontWeight: 400, color: C.deep, margin: '0 0 24px' }}>
            Sign in to Dashboard
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', color: C.rose, marginBottom: 6 }}>
                USERNAME
              </label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                autoComplete="username" autoFocus
                style={{
                  width: '100%', padding: '11px 14px', fontSize: 14, color: C.deep,
                  border: `1px solid ${C.soft}`, outline: 'none', background: 'white',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = C.rose)}
                onBlur={e => (e.target.style.borderColor = C.soft)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', color: C.rose, marginBottom: 6 }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '11px 40px 11px 14px', fontSize: 14, color: C.deep,
                    border: `1px solid ${C.soft}`, outline: 'none', background: 'white',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = C.rose)}
                  onBlur={e => (e.target.style.borderColor = C.soft)}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.muted,
                }}>
                  {showPw ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#fff1f1', border: '1px solid #fecdd3', fontSize: 13, color: '#be123c' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '13px', fontSize: 11, letterSpacing: '0.2em',
              color: 'white', background: loading ? C.muted : C.rose,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', borderRadius: 9999,
            }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: C.muted }}>
          This page is for authorised staff only.
        </p>
      </div>
    </div>
  )
}
