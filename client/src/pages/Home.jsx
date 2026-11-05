import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { useAuth } from '../state/useAuth'
import { api } from '../utils/api'
import '../App.css'

function Home() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [catalogError, setCatalogError] = useState('')
  useEffect(() => {
    let active = true
    api('/api/courses').then((data) => { if (active) setCourses(data.courses.slice(0, 3)) }).catch((error) => { if (active) setCatalogError(error.message) })
    return () => { active = false }
  }, [])
  return <SiteLayout><main><section className="hero" id="home"><div className="hero-content"><p className="eyebrow">LEARN · GROW · SUCCEED</p><h1>Make room for<br /><span>what’s next.</span></h1><p className="hero-description">Practical courses, clear learning paths, and a little progress every day. Find your next skill and get started.</p><div className="hero-actions"><Link className="button button-primary" to="/courses">Explore courses <span aria-hidden="true">→</span></Link><Link className="button button-quiet" to={user ? '/dashboard' : '/register'}>{user ? 'Go to dashboard' : 'Join LearnHub'}</Link></div><div className="hero-note"><span className="online-dot" /> Your next chapter starts here</div></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-card"><span className="art-kicker">TODAY’S FOCUS</span><strong>Small steps.<br />Real progress.</strong><div className="progress-track"><span /></div><small>Make a little progress today</small></div><div className="floating-note">✦ Keep going!</div></div></section><section className="course-preview section-wrap" id="about"><div className="section-heading"><div><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Skills worth learning</h2></div><Link className="text-link" to="/courses">Browse all courses <span aria-hidden="true">→</span></Link></div>{courses.length ? <div className="course-grid">{courses.map((course, index) => <article className="preview-card" key={course.id}><div className={`preview-icon tone-${index % 3}`}>{course.icon}</div><p className="card-label">{String(index + 1).padStart(2, '0')} · {course.category.toUpperCase()}</p><h3>{course.title}</h3><p>{course.description}</p><Link to={`/courses/${course.id}`}>Explore path <span aria-hidden="true">→</span></Link></article>)}</div> : <p className="inline-message" role={catalogError ? 'alert' : 'status'}>{catalogError ? 'Courses are temporarily unavailable. Visit the catalog to try again.' : 'Loading courses…'}</p>}</section><section className="closing-cta"><p className="eyebrow">YOUR PACE, YOUR PATH</p><h2>Progress looks different<br />for everyone.</h2><p>Pick a course, learn one thing, and build from there.</p><Link className="button button-light" to="/courses">Find your next course <span aria-hidden="true">→</span></Link></section></main></SiteLayout>
}

export default Home
