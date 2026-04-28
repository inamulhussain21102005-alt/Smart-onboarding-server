 const express = require('express');
const router = express.Router();
const Workflow = require('../models/Workflow');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// GET all workflows
router.get('/', protect, async (req, res) => {
  try {
    const workflows = await Workflow.find().populate('createdBy', 'name');
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create workflow template
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const workflow = await Workflow.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(workflow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST assign workflow to employee (auto-creates tasks)
router.post('/:id/assign/:employeeId', protect, adminOnly, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

    const tasks = workflow.steps.map(step => ({
      title: step.title,
      description: step.description,
      category: step.category,
      assignedTo: req.params.employeeId,
      assignedBy: req.user._id,
      workflow: workflow._id,
      dueDate: new Date(Date.now() + (step.estimatedDays || 3) * 24 * 60 * 60 * 1000),
      priority: 'medium'
    }));

    await Task.insertMany(tasks);
    workflow.assignedEmployees.push(req.params.employeeId);
    await workflow.save();

    res.json({ message: `Workflow assigned with ${tasks.length} tasks created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE workflow
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Workflow.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workflow deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

