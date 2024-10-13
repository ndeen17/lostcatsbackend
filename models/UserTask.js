const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTask = mongoose.model('UserTask', userTaskSchema);

module.exports = UserTask;