import { Router } from 'express'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { loginSchema, registerSchema } from '../validation/schemas.js'

const router = Router()
const scrypt = promisify(scryptCallback)
const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role })
const signToken = (user) => jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, issuer: 'learnhub', expiresIn: '7d' })

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)
    const email = data.email.toLowerCase()
    if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' })
    const passwordSalt = randomBytes(16).toString('hex')
    const passwordHash = (await scrypt(data.password, passwordSalt, 64)).toString('hex')
    const user = await User.create({ name: data.name, email, passwordSalt, passwordHash, role: 'user' })
    res.status(201).json({ token: signToken(user), user: safeUser(user) })
  } catch (error) { next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await User.findOne({ email: data.email.toLowerCase() })
    if (!user) return res.status(401).json({ error: 'Email or password is incorrect.' })
    const supplied = await scrypt(data.password, user.passwordSalt, 64)
    const expected = Buffer.from(user.passwordHash, 'hex')
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return res.status(401).json({ error: 'Email or password is incorrect.' })
    res.json({ token: signToken(user), user: safeUser(user) })
  } catch (error) { next(error) }
})

router.get('/me', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }))
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const profileSchema = registerSchema.pick({ name: true, email: true }).strict()
    const data = profileSchema.parse(req.body)
    const email = data.email.toLowerCase()
    if (await User.exists({ email, _id: { $ne: req.user._id } })) return res.status(409).json({ error: 'An account with this email already exists.' })
    req.user.name = data.name
    req.user.email = email
    await req.user.save()
    res.json({ user: safeUser(req.user) })
  } catch (error) { next(error) }
})
export default router
