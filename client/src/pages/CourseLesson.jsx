import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { lessonMaterials } from '../data/lessonMaterials'
import { lessonQuizzes } from '../data/lessonQuizzes'
import { api } from '../utils/api'
import { useAuth } from '../state/useAuth'

function LessonBody({ course, lessonNumber, material, quiz, enrollment, onEnrollmentChange }) {
  const lessonIndex = lessonNumber - 1
  const lessonTitle = course.lessons[lessonIndex]
  const completedLessons = enrollment?.completedLessons || []
  const isComplete = completedLessons.includes(lessonNumber)
  const [selected, setSelected] = useState(null)
  const [answerCorrect, setAnswerCorrect] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function checkAnswer(event) { event.preventDefault(); if (selected !== null) setAnswerCorrect(selected === quiz.correct) }
  async function markComplete() {
    setSaving(true); setError('')
    try {
      const result = await api(`/api/enrollments/${course.id}/lessons/${lessonNumber}/complete`, { method: 'POST' })
      onEnrollmentChange({ ...enrollment, completedLessons: result.completedLessons, progress: result.progress })
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const allDone = completedLessons.length === course.lessons.length
  return <><div className="lesson-heading"><div><p className="eyebrow">LESSON {String(lessonNumber).padStart(2, '0')} OF {String(course.lessons.length).padStart(2, '0')}</p><h1>{lessonTitle}</h1><p>{course.title} <span>·</span> {course.duration}</p></div><div className="lesson-progress"><span>{enrollment.progress}% complete</span><div className="progress-track"><span style={{ width: `${enrollment.progress}%` }} /></div></div></div><article className="lesson-content"><p className="lesson-intro">{material.intro}</p><section><h2>The key idea</h2><p>{material.keyIdea}</p></section><section className="lesson-exercise"><span className="eyebrow">TRY IT YOURSELF</span><p>{material.exercise}</p></section><form className="lesson-quiz" onSubmit={checkAnswer}><p className="eyebrow">QUICK KNOWLEDGE CHECK</p><h2>{quiz.question}</h2><div className="quiz-options">{quiz.options.map((option, index) => <label className={`quiz-option ${selected === index ? 'selected' : ''} ${answerCorrect === true && index === quiz.correct ? 'correct' : ''}`} key={option}><input type="radio" name="lesson-answer" value={index} checked={selected === index} onChange={() => { setSelected(index); setAnswerCorrect(null) }} /><span>{option}</span></label>)}</div>{answerCorrect === false && <p className="quiz-feedback incorrect" role="status">Not quite. {quiz.explanation}</p>}{answerCorrect === true && <p className="quiz-feedback correct" role="status">That’s right. {quiz.explanation}</p>}{answerCorrect !== true && <button className="button button-quiet quiz-submit" type="submit" disabled={selected === null}>Check answer <span aria-hidden="true">→</span></button>}</form><div className="lesson-actions">{lessonNumber > 1 && <Link className="button button-quiet" to={`/courses/${course.id}/lessons/${lessonNumber - 1}`}>← Previous lesson</Link>}<div className="lesson-action-right">{!isComplete && <button className="button button-primary" disabled={saving || answerCorrect !== true} onClick={markComplete}>{saving ? 'Saving…' : 'Mark lesson complete'} <span aria-hidden="true">✓</span></button>}{isComplete && <span className="lesson-complete-label">Lesson complete ✓</span>}{isComplete && lessonNumber < course.lessons.length && <Link className="button button-primary" to={`/courses/${course.id}/lessons/${lessonNumber + 1}`}>Next lesson <span aria-hidden="true">→</span></Link>}{allDone && <Link className="button button-primary" to="/dashboard">Course complete · Dashboard <span aria-hidden="true">→</span></Link>}</div></div>{error && <p className="form-error" role="alert">{error}</p>}</article><aside className="lesson-sidebar"><p className="eyebrow">IN THIS COURSE</p><ol>{course.lessons.map((title, index) => <li key={`${index}-${title}`}><Link className={index + 1 === lessonNumber ? 'current' : ''} to={`/courses/${course.id}/lessons/${index + 1}`}><span>{completedLessons.includes(index + 1) ? '✓' : String(index + 1).padStart(2, '0')}</span>{title}</Link></li>)}</ol></aside></>
}

export default function CourseLesson() {
  const { id, lessonNumber: lessonParam } = useParams()
  const lessonNumber = Number(lessonParam)
  const lessonIndex = lessonNumber - 1
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [courseResult, setCourseResult] = useState({ slug: null, course: null, loading: true, error: '' })
  const [enrollmentResult, setEnrollmentResult] = useState({ slug: null, enrollment: null, loading: true, error: '' })

  useEffect(() => {
    let active = true
    api(`/api/courses/${encodeURIComponent(id)}`).then((data) => { if (active) setCourseResult({ slug: id, course: data.course, loading: false, error: '' }) }).catch((error) => { if (active) setCourseResult({ slug: id, course: null, loading: false, error: error.message }) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!user || authLoading) return
    let active = true
    api('/api/enrollments').then((data) => { if (active) setEnrollmentResult({ slug: id, enrollment: data.enrollments.find((item) => item.courseId === id) || null, loading: false, error: '' }) }).catch((error) => { if (active) setEnrollmentResult({ slug: id, enrollment: null, loading: false, error: error.message }) })
    return () => { active = false }
  }, [authLoading, id, user])

  const course = courseResult.slug === id ? courseResult.course : null
  const enrollment = enrollmentResult.slug === id ? enrollmentResult.enrollment : null
  const hasLesson = course && Number.isInteger(lessonNumber) && lessonNumber >= 1 && lessonNumber <= course.lessons.length
  const lessonTitle = hasLesson ? course.lessons[lessonIndex] : ''
  const material = lessonMaterials[id]?.[lessonIndex] || (hasLesson ? { intro: `${lessonTitle} is part of your ${course.title} learning path. Work through the idea at your own pace, then use the activity to apply it.`, keyIdea: `Focus on the main concept in “${lessonTitle}” and connect it to the other ideas in ${course.title}.`, exercise: `Write a short explanation of “${lessonTitle}” in your own words and give one practical example.` } : null)
  const quiz = lessonQuizzes[id]?.[lessonIndex] || (hasLesson ? { question: `Which statement best describes “${lessonTitle}”?`, options: [`It introduces a core idea in ${course.title}.`, 'It is unrelated to the subject.', 'It describes account settings.'], correct: 0, explanation: 'The lesson title is part of the core learning path for this course.' } : null)

  if (courseResult.loading || courseResult.slug !== id) return <SiteLayout><main className="page-message" role="status">Loading lesson…</main></SiteLayout>
  if (!course || !hasLesson) return <SiteLayout><main className="page-message"><p className="eyebrow">LESSON NOT FOUND</p><h1>{courseResult.error || 'That lesson isn’t here.'}</h1><Link className="text-link" to="/courses">Browse courses →</Link></main></SiteLayout>

  return <SiteLayout><main className="lesson-page"><Link className="back-link" to={`/courses/${course.id}`}>← {course.title}</Link>{authLoading || (user && (enrollmentResult.loading || enrollmentResult.slug !== id)) ? <p className="inline-message" role="status">Loading your lesson…</p> : !user ? <section className="lesson-access"><p className="eyebrow">YOUR LEARNING PATH</p><h1>Log in to open this lesson.</h1><p>Sign in to save your progress and continue learning.</p><Link className="button button-primary" to="/login" state={{ from: location.pathname }}>Log in to continue →</Link></section> : enrollmentResult.error ? <div className="inline-error" role="alert">{enrollmentResult.error}</div> : !enrollment ? <section className="lesson-access"><p className="eyebrow">{course.title.toUpperCase()}</p><h1>Join this course to begin.</h1><p>Your lesson progress will be saved to your dashboard.</p><Link className="button button-primary" to={`/courses/${course.id}`}>View course and enroll →</Link></section> : <LessonBody key={`${course.id}-${lessonNumber}`} course={course} lessonNumber={lessonNumber} material={material} quiz={quiz} enrollment={enrollment} onEnrollmentChange={(next) => setEnrollmentResult({ slug: id, enrollment: next, loading: false, error: '' })} />}</main></SiteLayout>
}
