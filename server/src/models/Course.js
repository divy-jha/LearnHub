import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  level: { type: String, required: true, trim: true, maxlength: 40 },
  duration: { type: String, required: true, trim: true, maxlength: 40 },
  icon: { type: String, default: '✦', maxlength: 8 },
  color: { type: String, enum: ['tone-0', 'tone-1', 'tone-2'], default: 'tone-0' },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  lessons: { type: [{ type: String, trim: true, minlength: 2, maxlength: 160 }], validate: [(lessons) => lessons.length >= 1 && lessons.length <= 50, 'A course must have between 1 and 50 lessons.'] },
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
