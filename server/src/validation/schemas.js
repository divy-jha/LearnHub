import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
}).strict()

export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict()
const courseFields = {
  title: z.string().trim().min(3).max(120),
  category: z.string().trim().min(2).max(80),
  level: z.string().trim().min(2).max(40),
  duration: z.string().trim().min(2).max(40),
  icon: z.string().trim().min(1).max(8).optional(),
  color: z.enum(['tone-0', 'tone-1', 'tone-2']).optional(),
  description: z.string().trim().min(10).max(1000),
  lessons: z.array(z.string().trim().min(2).max(160)).min(1).max(50),
}
export const createCourseSchema = z.object({ slug: z.string().trim().min(3).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), ...courseFields }).strict()
export const updateCourseSchema = z.object(courseFields).partial().strict().refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update.')
export const enrollmentSchema = z.object({ courseId: z.string().trim().min(1).max(80) }).strict()
export const userIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'User id is invalid.')
