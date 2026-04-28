 const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'overdue'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  completedAt: { type: Date },
  category: { type: String, enum: ['documentation', 'training', 'setup', 'meeting', 'other'], default: 'other' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

