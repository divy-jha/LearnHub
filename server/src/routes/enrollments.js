import { Router } from 'express'
import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import { requireAuth } from '../middleware/auth.js'
import { enrollmentSchema } from '../validation/schemas.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('course').sort({ createdAt: -1 }).lean()
    res.json({ enrollments: enrollments.filter((item) => item.course).map((item) => ({ courseId: item.course.slug, course: { id: item.course.slug, slug: item.course.slug, title: item.course.title, category: item.course.category, level: item.course.level, duration: item.course.duration, icon: item.course.icon, color: item.course.color, description: item.course.description, lessons: item.course.lessons }, progress: item.progress, completedLessons: item.completedLessons, enrolledAt: item.createdAt })) })
  } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const { courseId } = enrollmentSchema.parse(req.body)
    const course = await Course.findOne({ slug: courseId })
    if (!course) return res.status(404).json({ error: 'That course could not be found.' })
    const enrollment = await Enrollment.findOneAndUpdate({ user: req.user._id, course: course._id }, { $setOnInsert: { user: req.user._id, course: course._id } }, { upsert: true, new: true, runValidators: true })
    res.status(201).json({ enrolled: true, progress: enrollment.progress })
  } catch (error) { next(error) }
})

router.post('/:courseId/lessons/:lessonNumber/complete', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseId })
    const lessonNumber = Number(req.params.lessonNumber)
    if (!course || !Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > course.lessons.length) return res.status(404).json({ error: 'That lesson could not be found.' })
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id })
    if (!enrollment) return res.status(403).json({ error: 'Enroll in this course before marking lessons complete.' })
    if (!enrollment.completedLessons.includes(lessonNumber)) enrollment.completedLessons.push(lessonNumber)
    enrollment.completedLessons.sort((a, b) => a - b)
    enrollment.progress = Math.round(enrollment.completedLessons.length / course.lessons.length * 100)
    await enrollment.save()
    res.json({ completedLessons: enrollment.completedLessons, progress: enrollment.progress })
  } catch (error) { next(error) }
})

export default router
