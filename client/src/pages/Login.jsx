import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../state/useAuth'

function Login() {
  const { login, user } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  async function submit(event) { event.preventDefault(); setError(''); setBusy(true); try { await login(email, password); navigate(location.state?.from || '/dashboard', { replace: true }) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <AuthLayout title="Good to see you again." description="Log in to pick up where your learning left off."><form className="auth-form" onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><label htmlFor="password">Password</label><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required /><label className="check-row"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Show password</label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'} <span aria-hidden="true">→</span></button></form><p className="auth-switch">New to LearnHub? <Link to="/register">Create an account</Link></p></AuthLayout>
}
export default Login
