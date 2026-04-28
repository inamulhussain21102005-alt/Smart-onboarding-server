 const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  department: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  steps: [{
    order: Number,
    title: String,
    description: String,
    category: { type: String, enum: ['documentation', 'training', 'setup', 'meeting', 'other'] },
    estimatedDays: Number
  }],
  isTemplate: { type: Boolean, default: true },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Workflow', workflowSchema);

