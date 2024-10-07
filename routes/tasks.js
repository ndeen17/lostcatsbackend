const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for ObjectId
const Task = require('../models/Task'); // Ensure correct path
const User = require('../models/User');

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && (id.length === 24);
};

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find(); // Get all tasks from the database
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark a task as completed (update user, don't delete task)
router.post('/complete/:id', async (req, res) => {
  const { userName } = req.body;
  const taskId = req.params.id; // Expecting taskId to be a string

  // Validate the task ID
  if (!isValidObjectId(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID format' });
  }

  try {
    // Use valid ObjectId
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the task has already been completed by this user
    // Assuming completedTasks is stored as an array of strings in the user model
    if (user.completedTasks.includes(taskId)) { // Compare directly with taskId as a string
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Update user's CTS balance and add task to completed list
    user.ctsBalance += task.reward;
    user.completedTasks.push(taskId); // Push taskId as a string
    await user.save();

    res.json({ message: 'Task completed successfully', newBalance: user.ctsBalance });
  } catch (error) {
    console.error("Error in completing task:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
