const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  inviteLink: { type: String },  // Unique invite link for each user
  inviteCode: { type: String }, // Add this field
  ctsBalance: { type: Number, default: 1000 },
  invitedFriends: { type: [String], default: [] }, // Array to store invitees' usernames
  totalCTS: { type: Number, default: 0 }, // CTS earned from invites
  completedTasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', default: [] },  
  dailyTasks: {
    type: {
      daysCompleted: { type: Number, default: 0 },
      dateStarted: { type: String, default: "" },
      lastTaskCompletedTime: { type: String, default: "" },
      rewardClaimed: { type: String, default: "" },
      streakResetTime: { type: String, default: "" },
      isActive: { type: Boolean, default: false },
      // lastClaimedReward: { type: String, default: "" },
      maxStreak: { type: Number, default: 0 },
      totalRewardsClaimed: { type: Number, default: 0 },
    },
    default: {}
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;