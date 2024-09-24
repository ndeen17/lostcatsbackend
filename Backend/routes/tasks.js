const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a task as completed and remove it from the database
router.post('/complete/:id', async (req, res) => {
  const { userName } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's CTS balance
    user.ctsBalance += task.reward;
    await user.save();

    // Remove the task from the database
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task completed successfully', newBalance: user.ctsBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
