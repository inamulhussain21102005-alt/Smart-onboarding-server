const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET all employees
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single employee
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add employee
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, department, position, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const employee = await User.create({ 
      name, email, password, 
      department, position, 
      phone, role: 'employee' 
    });
    res.status(201).json({ ...employee._doc, password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update employee
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).select('-password');
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE employee
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
