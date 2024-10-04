const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  inviteLink: { type: String, unique: true },  // Unique invite link for each user
  ctsBalance: { type: Number, default: 1000 },
  invitedFriends: { type: [String], default: [] }, // Array to store invitees' usernames
  totalCTS: { type: Number, default: 0 }, // CTS earned from invites           
});

const User = mongoose.model('User', userSchema);
