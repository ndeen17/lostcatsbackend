const mongoose = require('mongoose');

// Define the structure of a task
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true // Every task needs a description
  },
  reward: {
    type: Number,
    required: true // Each task gives a reward in CTS
  }
  
});

// Create a model from the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
