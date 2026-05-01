const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','hr','manager','employee'], default: 'employee' },
  department: { type: String },
  position: { type: String },
  joinDate: { type: Date, default: Date.now },
  phone: { type: String },
  status: { type: String, enum: ['active','onboarding','inactive'], default: 'onboarding' },
  onboardingProgress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
