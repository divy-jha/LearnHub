import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer (.+)$/i)?.[1]
  if (!token) return res.status(401).json({ error: 'Please log in to continue.' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'learnhub' })
    const user = await User.findById(payload.sub).select('_id name email role')
    if (!user) return res.status(401).json({ error: 'Your account is no longer available.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Your session is invalid or has expired. Please log in again.' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access is required.' })
  next()
}
