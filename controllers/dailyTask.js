const User = require('../models/User'); // Adjust path as needed

// Get the current daily tasks data for a user
const getDailyTasks = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.dailyTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDailyTaskStreak = async (req, res) => {
    try {
      const { userName } = req.params;
      const { rewardClaimed } = req.body; // rewardClaimed from the request body (string value)
  
      console.log(rewardClaimed)
      // Convert rewardClaimed from string to a number for calculations
      const rewardClaimedAmount = parseFloat(rewardClaimed);
 console.log(rewardClaimedAmount)
  
      // Find user by userName
      const user = await User.findOne({ userName });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const dailyTasks = user.dailyTasks;
  
      const now = Date.now(); // Current timestamp in milliseconds
  
      // Case 1: No task has been started yet
      if (dailyTasks.dateStarted === "") {
        dailyTasks.daysCompleted = 0;
        dailyTasks.dateStarted = now.toString(); // Set the dateStarted to current timestamp
        dailyTasks.isActive = true;
        dailyTasks.rewardClaimed = rewardClaimed; // Store as a string
        dailyTasks.totalRewardsClaimed += rewardClaimedAmount; // Add to total rewards (as number)
      }
      // Case 2: More than 24 hours have passed since the last task completion
      else if ((now - dailyTasks.lastTaskCompletedTime) > 86400000) {
        dailyTasks.daysCompleted = 0; // Reset the streak
        dailyTasks.isActive = false; // Mark streak as broken
        dailyTasks.rewardClaimed = rewardClaimed; // Store as string
        dailyTasks.totalRewardsClaimed += rewardClaimedAmount; // Add to total rewards (as number)
      }
      // Case 3: Reward not claimed yet (Optional)
      else if (!dailyTasks.rewardClaimed) {
        dailyTasks.rewardClaimed = rewardClaimed; // Store rewardClaimed as string
        dailyTasks.totalRewardsClaimed += rewardClaimedAmount; // Add to total rewards
      }
      // Case 4: User tries to claim rewards multiple times in a day (Optional)
      else if (rewardClaimed === dailyTasks.rewardClaimed) {
        return res.status(400).json({ message: "Reward already claimed today" });
      }
      // Case 5: Ongoing streak, increment daysCompleted and continue tracking
      else {
        dailyTasks.daysCompleted += 1;
        dailyTasks.isActive = true;
        dailyTasks.rewardClaimed = rewardClaimed; // Store rewardClaimed as string
        dailyTasks.totalRewardsClaimed += rewardClaimedAmount; // Add to total rewards
      }
  
      // Update the last task completed time
      dailyTasks.lastTaskCompletedTime = now; // Use `now` directly as the timestamp
  
      // Update maxStreak if necessary
      if (dailyTasks.daysCompleted > dailyTasks.maxStreak) {
        dailyTasks.maxStreak = dailyTasks.daysCompleted;
      }
  
      // Save the updated user data to the database
      await user.save();
  
      // Send back the updated dailyTasks data
      res.json(dailyTasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Claim the reward for the current streak
const claimReward = async (req, res) => {
  try {
    const { userName } = req.params;
    const { rewardClaimed } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dailyTasks = user.dailyTasks;

    // Check if the reward has already been claimed for the day
    if (dailyTasks.rewardClaimed) {
      return res.status(400).json({ message: 'Reward already claimed today' });
    }

    // Mark the reward as claimed and update other data
    dailyTasks.rewardClaimed = rewardClaimed;
    dailyTasks.totalRewardsClaimed += 1;
    dailyTasks.lastClaimedReward = Date.now().toString(); // Save the current timestamp

    // Save the updated user data
    await user.save();

    res.json(dailyTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset the daily streak (e.g., when the streak time expires or the user is inactive)
const resetStreak = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset the streak
    user.dailyTasks.daysCompleted = 0;
    user.dailyTasks.rewardClaimed = false;
    user.dailyTasks.lastClaimedReward = "";
    user.dailyTasks.isActive = false; // Mark the streak as inactive

    // Save the updated user data
    await user.save();

    res.json({ message: 'Streak has been reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDailyTasks,
  updateDailyTaskStreak,
  claimReward,
  resetStreak,
};
