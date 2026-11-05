import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Enrollment from '../models/Enrollment.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { userIdSchema } from '../validation/schemas.js'

const router = Router()
router.use(requireAuth, requireAdmin)

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('_id name email role createdAt').sort({ createdAt: -1 }).lean()
    res.json({ users: users.map((user) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })) })
  } catch (error) { next(error) }
})

router.delete('/:userId', async (req, res, next) => {
  try {
    const userId = userIdSchema.parse(req.params.userId)
    if (new mongoose.Types.ObjectId(userId).equals(req.user._id)) return res.status(400).json({ error: 'You cannot delete your own administrator account.' })
    const user = await User.findByIdAndDelete(userId).select('_id name email')
    if (!user) return res.status(404).json({ error: 'User not found.' })
    await Enrollment.deleteMany({ user: user._id })
    res.json({ deleted: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) { next(error) }
})

export default router
