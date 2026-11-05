import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { api } from '../utils/api'

const blankForm = { slug: '', title: '', category: '', level: 'Beginner', duration: '', icon: '✦', color: 'tone-0', description: '', lessons: '' }

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState(blankForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadCourses = useCallback(async () => {
    setLoading(true); setError('')
    try { const data = await api('/api/courses'); setCourses(data.courses) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    api('/api/courses').then((data) => { if (active) setCourses(data.courses) }).catch((err) => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  function change(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  function beginEdit(course) {
    setEditing(course.id)
    setForm({ slug: course.id, title: course.title, category: course.category, level: course.level, duration: course.duration, icon: course.icon, color: course.color, description: course.description, lessons: course.lessons.join('\n') })
    setNotice(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function resetForm() { setEditing(null); setForm(blankForm); setError(''); setNotice('') }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    const data = { ...form, lessons: form.lessons.split('\n').map((lesson) => lesson.trim()).filter(Boolean) }
    if (!editing) data.slug = form.slug || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    else delete data.slug
    try {
      const result = await api(editing ? `/api/courses/${encodeURIComponent(editing)}` : '/api/courses', { method: editing ? 'PATCH' : 'POST', body: data })
      setNotice(`${result.course.title} ${editing ? 'updated' : 'created'}.`); setEditing(null); setForm(blankForm); await loadCourses()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function remove(course) {
    if (!window.confirm(`Delete “${course.title}” and its enrollments?`)) return
    setError(''); setNotice('')
    try { await api(`/api/courses/${encodeURIComponent(course.id)}`, { method: 'DELETE' }); setNotice(`${course.title} deleted.`); await loadCourses() } catch (err) { setError(err.message) }
  }

  return <SiteLayout><main className="admin-page"><div className="admin-heading"><p className="eyebrow">COURSE ADMINISTRATION</p><h1>Manage learning paths</h1><p>Create, update, and remove courses in the LearnHub catalog.</p></div><nav className="admin-tabs" aria-label="Administration"><span aria-current="page">Courses</span><Link to="/admin/users">Users</Link></nav><section className="admin-form-card"><div className="section-heading"><div><p className="eyebrow">{editing ? 'EDIT COURSE' : 'NEW COURSE'}</p><h2>{editing ? 'Update course details' : 'Add a course'}</h2></div></div><form className="admin-form" onSubmit={submit}><label>Course title<input name="title" value={form.title} onChange={change} required minLength={3} maxLength={120} /></label>{!editing && <label>URL slug <input name="slug" value={form.slug} onChange={change} placeholder="Leave blank to generate from title" pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>}<div className="admin-form-row"><label>Category<input name="category" value={form.category} onChange={change} required minLength={2} maxLength={80} /></label><label>Level<input name="level" value={form.level} onChange={change} required minLength={2} maxLength={40} /></label><label>Duration<input name="duration" value={form.duration} onChange={change} placeholder="4 weeks" required minLength={2} maxLength={40} /></label></div><label>Description<textarea name="description" value={form.description} onChange={change} required minLength={10} maxLength={1000} rows={3} /></label><div className="admin-form-row"><label>Icon<input name="icon" value={form.icon} onChange={change} required minLength={1} maxLength={8} /></label><label>Card color<select name="color" value={form.color} onChange={change}><option value="tone-0">Indigo</option><option value="tone-1">Teal</option><option value="tone-2">Violet</option></select></label></div><label>Lessons <span className="admin-hint">One lesson title per line, up to 50 lessons.</span><textarea name="lessons" value={form.lessons} onChange={change} required rows={6} placeholder={'Introduction\nCore concepts\nPractice'} /></label>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="success-message" role="status">{notice}</p>}<div className="admin-form-actions"><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create course'} <span aria-hidden="true">→</span></button>{editing && <button className="button button-quiet" type="button" onClick={resetForm}>Cancel edit</button>}</div></form></section><section className="admin-list"><div className="section-heading"><div><p className="eyebrow">DATABASE CATALOG</p><h2>Courses ({courses.length})</h2></div></div>{loading ? <p className="inline-message" role="status">Loading courses…</p> : courses.length ? <div className="admin-course-list">{courses.map((course) => <article className="admin-course-row" key={course.id}><div><span className="course-meta">{course.category} · {course.level}</span><h3>{course.title}</h3><p>{course.lessons.length} lessons · {course.duration}</p></div><div className="admin-row-actions"><button className="admin-edit" onClick={() => beginEdit(course)}>Edit</button><button className="admin-delete" onClick={() => remove(course)}>Delete</button></div></article>)}</div> : <div className="empty-state"><h2>No courses yet</h2><p>Create the first course using the form above.</p></div>}</section></main></SiteLayout>
}
