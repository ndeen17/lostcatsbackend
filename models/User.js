const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  ctsBalance: { type: Number, default: 0 },
  lastFarmingTime: { type: Date }, // New field to track last farming time
});

const User = mongoose.model('User', userSchema);

module.exports = User;