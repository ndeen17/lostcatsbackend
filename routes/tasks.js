const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const UserTask = require('../models/UserTask');

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && (id.length === 24);
};

// GET all tasks that are not completed by the user
router.get('/', async (req, res) => {
  const { userName } = req.query; // Expecting userName to be passed as a query parameter

  try {
    // Fetch completed tasks for the user
    const completedTasks = await UserTask.find({ userName }).select('taskId');
    const completedTaskIds = completedTasks.map(task => task.taskId);

    // Get all tasks that are not in the user's completedTasks list
    const tasks = await Task.find({ _id: { $nin: completedTaskIds } });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark a task as completed (store in UserTask collection)
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
    const existingUserTask = await UserTask.findOne({ userName, taskId });
    if (existingUserTask) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Create a new UserTask entry
    const userTask = new UserTask({ userName, taskId });
    await userTask.save();

    // Update user's CTS balance
    user.ctsBalance += task.reward;
    await user.save();

    res.json({ message: 'Task completed successfully', newBalance: user.ctsBalance });
  } catch (error) {
    console.error("Error in completing task:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;