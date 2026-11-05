import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function AdminRoute() {
  const { user, loading } = useAuth()
  if (loading) return <main className="page-message" role="status">Loading your account…</main>
  return user?.role === 'admin' ? <Outlet /> : <Navigate to={user ? '/dashboard' : '/login'} replace />
}
