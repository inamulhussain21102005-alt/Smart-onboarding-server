const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch(err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
