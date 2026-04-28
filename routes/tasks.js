 const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET all tasks (admin sees all, employee sees own)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'employee' ? { assignedTo: req.user._id } : {};
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update task status
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Employees can only update their own tasks' status
    if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (req.body.status === 'completed') req.body.completedAt = new Date();
    Object.assign(task, req.body);
    await task.save();

    // Update employee onboarding progress
    if (req.body.status === 'completed') {
      const allTasks = await Task.find({ assignedTo: task.assignedTo });
      const completed = allTasks.filter(t => t.status === 'completed').length;
      const progress = Math.round((completed / allTasks.length) * 100);
      await User.findByIdAndUpdate(task.assignedTo, { onboardingProgress: progress });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

