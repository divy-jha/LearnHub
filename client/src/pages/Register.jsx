import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../state/useAuth'

function Register() {
  const { register, user } = useAuth(); const navigate = useNavigate()
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  async function submit(event) { event.preventDefault(); setError(''); setBusy(true); try { await register(name, email, password); navigate('/dashboard', { replace: true }) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <AuthLayout kicker="START YOUR LEARNING JOURNEY" title="Create your account" description="Save your progress and make space for a new skill."><form className="auth-form" onSubmit={submit}><label htmlFor="name">Your name</label><input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required minLength={2} maxLength={80} /><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} /><p className="field-hint">Use at least 8 characters.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <span aria-hidden="true">→</span></button></form><p className="auth-switch">Already learning with us? <Link to="/login">Log in</Link></p></AuthLayout>
}
export default Register
