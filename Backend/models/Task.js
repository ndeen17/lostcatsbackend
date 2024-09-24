const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  reward: {
    type: Number,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
