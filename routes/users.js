const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    const { userName } = req.body;

     // Log the request body to ensure it's received
     console.log("Received POST request with body:", req.body);

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

// Check if user exists (For frontend verification)
router.get('/check/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName });

        if (user) {
            return res.json({ exists: true });  // Return true if user exists
        } else {
            return res.json({ exists: false }); // Return false if user doesn't exist
        }
    } catch (err) {
        res.status(500).json({ exists: false });
    }
});

module.exports = router;
