import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function SiteLayout({ children }) {
  const { user, logout } = useAuth()
  return <div className="site-shell"><header className="navbar"><Link className="logo" to="/" aria-label="LearnHub home"><span className="logo-mark">L</span>learn<span>hub</span></Link><nav className="nav-links" aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/courses">Courses</NavLink><a href="/#about">About</a></nav><div className="nav-buttons">{user ? <>{user.role === 'admin' && <Link className="nav-dashboard" to="/admin/courses">Manage courses</Link>}<Link className="nav-dashboard" to="/dashboard">My learning</Link><button className="nav-text-button" onClick={logout}>Log out</button></> : <><Link className="nav-login" to="/login">Log in</Link><Link className="button button-small" to="/register">Get started <span aria-hidden="true">→</span></Link></>}</div></header>{children}<footer className="site-footer"><Link className="logo" to="/"><span className="logo-mark">L</span>learn<span>hub</span></Link><p>Learn something new. Every single day.</p><span>© {new Date().getFullYear()} LearnHub</span></footer></div>
}
