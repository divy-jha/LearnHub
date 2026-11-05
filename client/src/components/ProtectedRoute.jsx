import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../state/useAuth'
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <main className="page-message" role="status">Loading your learning space…</main>
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}
