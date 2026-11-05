import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('learnhub-token')))
  useEffect(() => {
    if (!localStorage.getItem('learnhub-token')) return
    api('/api/auth/me').then((data) => setUser(data.user)).catch(() => localStorage.removeItem('learnhub-token')).finally(() => setLoading(false))
  }, [])
  async function login(email, password) { const data = await api('/api/auth/login', { method: 'POST', body: { email, password } }); localStorage.setItem('learnhub-token', data.token); setUser(data.user); return data.user }
  async function register(name, email, password) { const data = await api('/api/auth/register', { method: 'POST', body: { name, email, password } }); localStorage.setItem('learnhub-token', data.token); setUser(data.user); return data.user }
  function logout() { localStorage.removeItem('learnhub-token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
