const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Start farming
router.post('/farm', async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = Date.now(); // Use Date.now() for timestamp comparison
        if (user.lastFarmingTime && now - user.lastFarmingTime.getTime() < 9 * 60 * 60 * 1000) {
            const remainingTime = 9 * 60 * 60 * 1000 - (now - user.lastFarmingTime.getTime());
            return res.status(400).json({ message: `You can farm again after ${Math.ceil(remainingTime / (60 * 60 * 1000))} hours.` });
        }

        // Update the last farming time
        user.lastFarmingTime = new Date(now);
        await user.save();

        res.status(200).json({ message: 'Farming started. You can claim your reward after 9 hours.' });
    } catch (error) {
        console.error("Error during farming:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Claim farming reward
router.post('/claim', async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = Date.now();
        if (!user.lastFarmingTime || now - user.lastFarmingTime.getTime() < 9 * 60 * 60 * 1000) {
            const remainingTime = 9 * 60 * 60 * 1000 - (now - user.lastFarmingTime.getTime());
            return res.status(400).json({ message: `You cannot claim the reward yet. Please wait ${Math.ceil(remainingTime / (60 * 60 * 1000))} more hours.` });
        }

        // Add reward to user's balance and reset last farming time
        user.ctsBalance += 1000;
        user.lastFarmingTime = null; // Reset last farming time after claim
        await user.save();

        res.status(200).json({ message: 'You have claimed 1000 CTS!', newBalance: user.ctsBalance });
    } catch (error) {
        console.error("Error during claiming CTS:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
