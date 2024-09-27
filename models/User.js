const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  ctsBalance: { type: Number, default: 0 },
  lastFarmingTime: { type: Date }, // New field to track last farming time
  chatId: { type: String, required: true, unique: true } // New field for chat ID
});

const User = mongoose.model('User', userSchema);

module.exports = User;