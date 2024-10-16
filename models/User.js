const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  inviteLink: { type: String },  // Unique invite link for each user
  inviteCode: { type: String }, // Add this field
  ctsBalance: { type: Number, default: 1000 },
  invitedFriends: { type: [String], default: [] }, // Array to store invitees' usernames
  totalCTS: { type: Number, default: 0 }, // CTS earned from invites
  completedTasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', default: [] } // Add this field         
});

const User = mongoose.model('User', userSchema);
module.exports = User;