const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  ctsBalance: { type: Number, default: 1000 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;