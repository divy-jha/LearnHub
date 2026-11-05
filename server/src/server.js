import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { randomBytes, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import enrollmentRoutes from './routes/enrollments.js'
import userRoutes from './routes/users.js'
import User from './models/User.js'
import Course from './models/Course.js'
import { seedCourses } from './data/seedCourses.js'
import { ZodError } from 'zod'

const scrypt = promisify(scryptCallback)
const app = express()
const port = Number(process.env.PORT || 3000)
const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!mongoUri) throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure MongoDB.')
if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.startsWith('replace-with-')) throw new Error('Set JWT_SECRET to a private random value of at least 32 characters.')

const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((origin) => origin.trim())
app.disable('x-powered-by')
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(Object.assign(new Error('Origin is not allowed by CORS.'), { status: 403 })) }))
app.use(express.json({ limit: '25kb' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/users', userRoutes)
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }))
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error.status === 403 && error.message === 'Origin is not allowed by CORS.') return res.status(403).json({ error: error.message })
  if (error instanceof ZodError) return res.status(400).json({ error: 'Please check the submitted fields.', issues: error.issues.map(({ path, message }) => ({ field: path.join('.'), message })) })
  if (error.code === 11000) return res.status(409).json({ error: 'A record with that email or course slug already exists.' })
  if (error.name === 'ValidationError' || error.type === 'entity.parse.failed') return res.status(400).json({ error: 'The submitted data is invalid.' })
  console.error(error)
  res.status(500).json({ error: 'The server could not complete that request.' })
})

async function seedCatalog() {
  await Promise.all(seedCourses.map((course) => Course.updateOne({ slug: course.slug }, { $setOnInsert: course }, { upsert: true })))
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email && !password) return
  if (!email || !password || password.length < 12 || password.startsWith('replace-with-')) throw new Error('Set both ADMIN_EMAIL and a private ADMIN_PASSWORD (at least 12 characters) to enable course administration.')
  const user = await User.findOne({ email })
  if (user?.role === 'admin') return
  if (user) throw new Error('ADMIN_EMAIL is already registered as a learner. Choose another email or promote the account using trusted MongoDB administration.')
  const passwordSalt = randomBytes(16).toString('hex')
  const passwordHash = (await scrypt(password, passwordSalt, 64)).toString('hex')
  await User.create({ name: 'LearnHub Admin', email, passwordSalt, passwordHash, role: 'admin' })
}

await mongoose.connect(mongoUri)
await seedCatalog()
await seedAdmin()
app.listen(port, () => console.log(`LearnHub API listening on http://localhost:${port}`))

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await mongoose.disconnect(); process.exit(0) })
