const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  ctsBalance: { type: Number, default: 1000 },
  totalCTS: { type: Number, default: 0 }, // Total CTS earned from invites
  inviteCount: { type: Number, default: 0 }, // Count of invited friends
});

const User = mongoose.model('User', userSchema);

module.exports = User;
