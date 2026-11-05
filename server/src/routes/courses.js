import { Router } from 'express'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { createCourseSchema, updateCourseSchema } from '../validation/schemas.js'

const router = Router()
const toCourse = (course) => ({ id: course.slug, slug: course.slug, title: course.title, category: course.category, level: course.level, duration: course.duration, icon: course.icon, color: course.color, description: course.description, lessons: course.lessons })

router.get('/', async (req, res, next) => {
  try { const courses = await Course.find().sort({ title: 1 }).lean(); res.json({ courses: courses.map(toCourse) }) } catch (error) { next(error) }
})

router.get('/:slug', async (req, res, next) => {
  try { const course = await Course.findOne({ slug: req.params.slug }).lean(); if (!course) return res.status(404).json({ error: 'Course not found.' }); res.json({ course: toCourse(course) }) } catch (error) { next(error) }
})

router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try { const data = createCourseSchema.parse(req.body); const course = await Course.create(data); res.status(201).json({ course: toCourse(course) }) } catch (error) { next(error) }
})

router.patch('/:slug', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = updateCourseSchema.parse(req.body)
    const course = await Course.findOneAndUpdate({ slug: req.params.slug }, { $set: data }, { new: true, runValidators: true })
    if (!course) return res.status(404).json({ error: 'Course not found.' })
    res.json({ course: toCourse(course) })
  } catch (error) { next(error) }
})

router.delete('/:slug', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ slug: req.params.slug })
    if (!course) return res.status(404).json({ error: 'Course not found.' })
    await Enrollment.deleteMany({ course: course._id })
    res.json({ deleted: true, slug: course.slug })
  } catch (error) { next(error) }
})

export default router
