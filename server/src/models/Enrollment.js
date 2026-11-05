import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: { type: [{ type: Number, min: 1 }], default: [] },
  progress: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true })
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

export default mongoose.model('Enrollment', enrollmentSchema)
