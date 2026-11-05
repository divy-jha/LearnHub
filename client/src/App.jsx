import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import CourseLesson from './pages/CourseLesson'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminCourses from './pages/AdminCourses'
import AdminUsers from './pages/AdminUsers'

function NotFound() { return <main className="page-message"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>Looks like a wrong turn.</h1><p>That page isn’t here, but there’s plenty to learn.</p><a className="button button-primary" href="/courses">Browse courses</a></main> }
function App() { return <Routes><Route path="/" element={<Home />} /><Route path="/courses" element={<Courses />} /><Route path="/courses/:id" element={<CourseDetail />} /><Route path="/courses/:id/lessons/:lessonNumber" element={<CourseLesson />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route element={<AdminRoute />}><Route path="/admin/courses" element={<AdminCourses />} /><Route path="/admin/users" element={<AdminUsers />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes> }
export default App
