import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { api } from '../utils/api'
import { useAuth } from '../state/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEnrollments = useCallback(async () => {
    setLoading(true); setError('')
    try { const data = await api('/api/enrollments'); setEnrollments(data.enrollments) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    api('/api/enrollments').then((data) => { if (active) setEnrollments(data.enrollments) }).catch((err) => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const enrolled = enrollments.filter((item) => item.course)

  return <SiteLayout><main className="dashboard-page"><div className="dashboard-welcome"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Welcome back, <span>{user?.name?.split(' ')[0]}.</span></h1><p>Every lesson is a step forward. Keep your momentum going.</p></div><div className="welcome-mark" aria-hidden="true">✦</div></div><section className="learning-section"><div className="section-heading"><div><p className="eyebrow">YOUR PROGRESS</p><h2>Courses you’re learning</h2></div><Link className="text-link" to="/courses">Find another course <span aria-hidden="true">→</span></Link></div>{loading ? <p className="inline-message" role="status">Loading your courses…</p> : error ? <div className="inline-error" role="alert">{error} <button onClick={loadEnrollments}>Try again</button></div> : enrolled.length ? <div className="learning-grid">{enrolled.map(({ course, progress, completedLessons = [] }) => { const firstIncomplete = course.lessons.findIndex((_, index) => !completedLessons.includes(index + 1)); const nextLesson = firstIncomplete === -1 ? course.lessons.length : firstIncomplete + 1; return <article className="learning-card" key={course.id}><div className={`catalog-art ${course.color}`}><span>{course.icon}</span><small>{course.category.toUpperCase()}</small></div><div className="learning-card-body"><div className="course-meta"><span>{course.level}</span><span>·</span><span>{course.duration}</span></div><h3>{course.title}</h3><p>{progress}% complete</p><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><Link className="text-link" to={`/courses/${course.id}/lessons/${nextLesson}`}>{progress === 100 ? 'Review lessons' : progress ? 'Continue learning' : 'Start learning'} <span aria-hidden="true">→</span></Link></div></article>})}</div> : <div className="empty-state"><span>✦</span><h2>Your learning journey starts here</h2><p>Choose a course that interests you. We’ll keep it here so you can come back anytime.</p><Link className="button button-primary" to="/courses">Explore courses <span aria-hidden="true">→</span></Link></div>}</section></main></SiteLayout>
}
