import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { api } from '../utils/api'
import { useAuth } from '../state/useAuth'

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const loadUsers = useCallback(async () => {
    setLoading(true); setError('')
    try { const data = await api('/api/users'); setUsers(data.users) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    api('/api/users').then((data) => { if (active) setUsers(data.users) }).catch((err) => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function remove(target) {
    if (!window.confirm(`Delete the account for ${target.name}? Their enrollments and progress will also be removed.`)) return
    setError(''); setNotice('')
    try { await api(`/api/users/${encodeURIComponent(target.id)}`, { method: 'DELETE' }); setUsers((current) => current.filter((item) => item.id !== target.id)); setNotice(`${target.name} was deleted.`) } catch (err) { setError(err.message) }
  }

  return <SiteLayout><main className="admin-page"><div className="admin-heading"><p className="eyebrow">USER ADMINISTRATION</p><h1>Manage learners</h1><p>Review accounts and remove users when needed. Deleting an account also removes its enrollments and saved progress.</p></div><nav className="admin-tabs" aria-label="Administration"><Link to="/admin/courses">Courses</Link><span aria-current="page">Users</span></nav>{notice && <p className="success-message" role="status">{notice}</p>}{error && <p className="form-error" role="alert">{error} <button className="admin-retry" onClick={loadUsers}>Try again</button></p>}{loading ? <p className="inline-message" role="status">Loading accounts…</p> : users.length ? <div className="admin-course-list">{users.map((item) => <article className="admin-course-row" key={item.id}><div><span className="course-meta">{item.role === 'admin' ? 'Administrator' : 'Learner'} · Joined {new Date(item.createdAt).toLocaleDateString()}</span><h3>{item.name} {item.id === user?.id && <span className="admin-you">You</span>}</h3><p>{item.email}</p></div><div className="admin-row-actions">{item.id !== user?.id && <button className="admin-delete" onClick={() => remove(item)}>Delete user</button>}</div></article>)}</div> : <div className="empty-state"><h2>No user accounts yet</h2></div>}</main></SiteLayout>
}
