const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Start farming
router.post('/start-farming', async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set the start time for farming
        user.farmingStartTime = new Date();
        await user.save();

        res.status(200).json({ message: 'Farming started' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Claim reward
router.post('/claim-reward', async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();
        const startTime = new Date(user.farmingStartTime);

        // Check if 9 hours have passed
        const hoursPassed = (now - startTime) / (1000 * 60 * 60);
        if (hoursPassed < 9) {
            return res.status(400).json({ message: 'Farming is not completed yet' });
        }

        // Update CTS balance and clear farming start time
        user.ctsBalance += 1000;
        user.farmingStartTime = null;
        await user.save();

        res.status(200).json({ message: 'Reward claimed', ctsBalance: user.ctsBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
