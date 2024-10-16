const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && (id.length === 24);
};

// GET all tasks and completed tasks for the user
router.get('/', async (req, res) => {
  const { userName } = req.query;

  try {
    const user = await User.findOne({ userName }).populate('completedTasks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ _id: { $nin: user.completedTasks.map(task => task._id) } });
    res.json({ tasks, completedTasks: user.completedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark a task as completed
router.post('/complete/:id', async (req, res) => {
  const { userName } = req.body;
  const taskId = req.params.id;

  if (!isValidObjectId(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID format' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    user.completedTasks.push(taskId);
    user.ctsBalance += task.reward;
    await user.save();

    res.json({ message: 'Task completed successfully', newBalance: user.ctsBalance });
  } catch (error) {
    console.error("Error in completing task:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;