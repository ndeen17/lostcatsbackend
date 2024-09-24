// routes/leaderboard.js
const express = require('express');
const User = require('../models/User'); // Ensure the path is correct
const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
    try {
        // Fetch all users sorted by ctsBalance
        const users = await User.find().sort({ ctsBalance: -1 }).exec();
        const leaderboard = users.map(user => ({
            userName: user.userName,
            score: user.ctsBalance
        }));
        res.json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
