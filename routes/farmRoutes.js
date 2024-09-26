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

        const now = new Date();
        if (user.lastFarmingTime && now - user.lastFarmingTime < 9 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'You can farm again after 9 hours' });
        }

        // Update the last farming time
        user.lastFarmingTime = now;
        await user.save();

        res.status(200).json({ message: 'Farming started. You can claim your reward after 9 hours.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        const now = new Date();
        if (!user.lastFarmingTime || now - user.lastFarmingTime < 9 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'You cannot claim the reward yet' });
        }

        // Add reward to user's balance
        user.ctsBalance += 1000;
        user.lastFarmingTime = null; // Reset last farming time
        await user.save();

        res.status(200).json({ message: 'You have claimed 1000 CTS!', newBalance: user.ctsBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
