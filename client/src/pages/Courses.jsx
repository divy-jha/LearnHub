import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { api } from '../utils/api'

function Courses() {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { api('/api/courses').then((data) => setCourses(data.courses)).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])
  const categories = ['All', ...new Set(courses.map((course) => course.category))]
  const filtered = useMemo(() => courses.filter((course) => (category === 'All' || course.category === category) && `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(query.toLowerCase())), [category, courses, query])
  return <SiteLayout><main className="catalog-page"><div className="catalog-heading"><p className="eyebrow">LEARN SOMETHING THAT MOVES YOU</p><h1>Find your next<br /><span>learning path.</span></h1><p>Thoughtful courses designed to help you build skills one step at a time.</p></div><div className="catalog-tools"><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search courses" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search courses" /></label>{courses.length > 0 && <div className="filter-row" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>}</div>{loading ? <p className="inline-message" role="status">Loading courses…</p> : error ? <div className="empty-state" role="alert"><h2>Courses couldn’t load</h2><p>{error}</p><button className="button button-primary" onClick={() => window.location.reload()}>Try again</button></div> : filtered.length ? <div className="catalog-grid">{filtered.map((course) => <article className="catalog-card" key={course.id}><div className={`catalog-art ${course.color}`}><span>{course.icon}</span><small>{course.category.toUpperCase()}</small></div><div className="catalog-card-body"><div className="course-meta"><span>{course.level}</span><span>·</span><span>{course.duration}</span></div><h2>{course.title}</h2><p>{course.description}</p><Link className="text-link" to={`/courses/${course.id}`}>View learning path <span aria-hidden="true">→</span></Link></div></article>)}</div> : <div className="empty-state"><span>⌕</span><h2>{courses.length ? 'No courses found' : 'Courses are on their way'}</h2><p>{courses.length ? 'Try another search or choose a different category.' : 'Check back soon for new learning paths.'}</p>{courses.length > 0 && <button className="button button-primary" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</button>}</div>}</main></SiteLayout>
}
export default Courses
