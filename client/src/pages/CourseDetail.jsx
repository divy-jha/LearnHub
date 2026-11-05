import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { api } from '../utils/api'
import { useAuth } from '../state/useAuth'

export default function CourseDetail() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const [courseResult, setCourseResult] = useState({ slug: null, course: null, error: '', loading: true })
  const [enrollmentResult, setEnrollmentResult] = useState({ slug: null, enrollment: null, error: '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    api(`/api/courses/${encodeURIComponent(id)}`).then((data) => { if (active) setCourseResult({ slug: id, course: data.course, error: '', loading: false }) }).catch((error) => { if (active) setCourseResult({ slug: id, course: null, error: error.message, loading: false }) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!user || authLoading) return
    let active = true
    api('/api/enrollments').then((data) => { if (active) setEnrollmentResult({ slug: id, enrollment: data.enrollments.find((item) => item.courseId === id) || null, error: '' }) }).catch((error) => { if (active) setEnrollmentResult({ slug: id, enrollment: null, error: error.message }) })
    return () => { active = false }
  }, [authLoading, id, user])

  const course = courseResult.slug === id ? courseResult.course : null
  const enrollment = user && enrollmentResult.slug === id ? enrollmentResult.enrollment : null
  const completed = enrollment?.completedLessons || []
  const nextLesson = course?.lessons.findIndex((_, index) => !completed.includes(index + 1)) ?? -1
  const continueAt = nextLesson === -1 ? course?.lessons.length : nextLesson + 1

  async function enroll() {
    setBusy(true); setMessage('')
    try {
      await api('/api/enrollments', { method: 'POST', body: { courseId: course.id } })
      setEnrollmentResult({ slug: id, enrollment: { courseId: id, progress: 0, completedLessons: [] }, error: '' })
      setMessage('You’re enrolled. Your learning path is ready.')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }

  if (courseResult.loading || courseResult.slug !== id) return <SiteLayout><main className="page-message" role="status">Loading course…</main></SiteLayout>
  if (!course) return <SiteLayout><main className="page-message"><p className="eyebrow">COURSE NOT FOUND</p><h1>{courseResult.error || 'This learning path isn’t here.'}</h1><Link className="text-link" to="/courses">Back to courses →</Link></main></SiteLayout>

  return <SiteLayout><main className="detail-page"><Link className="back-link" to="/courses">← All courses</Link><section className="detail-hero"><div><p className="eyebrow">{course.category.toUpperCase()} · {course.level.toUpperCase()}</p><h1>{course.title}</h1><p>{course.description}</p><div className="detail-actions">{authLoading ? <span className="course-meta">Checking your account…</span> : !user ? <Link className="button button-primary" to="/register">Create an account to start <span aria-hidden="true">→</span></Link> : enrollment ? <Link className="button button-primary" to={`/courses/${course.id}/lessons/${continueAt}`}>{nextLesson === -1 ? 'Review lessons' : completed.length ? 'Continue learning' : 'Start your first lesson'} <span aria-hidden="true">→</span></Link> : <button className="button button-primary" onClick={enroll} disabled={busy}>{busy ? 'Joining…' : 'Enroll in this course'} <span aria-hidden="true">→</span></button>}<span className="course-meta">{course.duration} · {course.lessons.length} lessons</span></div>{enrollmentResult.slug === id && enrollmentResult.error && <p className="form-error" role="alert">{enrollmentResult.error}</p>}{message && <p className="success-message" role="status">{message}</p>}{enrollment && <p className="detail-progress">{enrollment.progress}% complete · {completed.length} of {course.lessons.length} lessons finished</p>}</div><div className={`detail-art ${course.color}`} aria-hidden="true">{course.icon}</div></section><section className="curriculum"><div><p className="eyebrow">THE LEARNING PATH</p><h2>What you’ll explore</h2></div><ol>{course.lessons.map((lesson, index) => <li key={`${index}-${lesson}`}><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span><span>{lesson}</span>{completed.includes(index + 1) ? <span className="lesson-complete-label">Complete ✓</span> : enrollment ? <Link className="lesson-open-link" to={`/courses/${course.id}/lessons/${index + 1}`}>Open lesson →</Link> : <span className="lesson-duration">Lesson {index + 1}</span>}</li>)}</ol></section></main></SiteLayout>
}
