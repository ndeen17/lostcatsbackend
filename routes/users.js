const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    const { userName } = req.body;

    // Removed the duplicate username check
    try {
        const user = new User({ userName });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user by username
router.get('/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user's CTS balance
router.patch('/:userName', async (req, res) => {
    const { userName } = req.params;
    const { ctsBalance } = req.body;

    try {
        const user = await User.findOneAndUpdate({ userName }, { ctsBalance }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
