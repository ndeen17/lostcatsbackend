const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

let currentUserName = null;

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


// Set current user (simplified)
router.post('/set-current-user', (req, res) => {
    const { userName } = req.body;
    console.log("Received request body:", req.body); // Log the request body
    if (!userName) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Set the current user in the in-memory variable
    currentUserName = userName;
    console.log("Setting current user to:", userName);
    res.json({ message: 'Current user set successfully', userName });
});

// Get current user (simplified)
router.get('/current', async (req, res) => {
    try {
        if (!currentUserName) {
            return res.status(404).json({ message: 'Current user not set' });
        }
        const user = await User.findOne({ userName: currentUserName });
        console.log("Fetched user:", user); // Log the fetched user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ userName: user.userName });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    const { ctsBalance, taskType, day } = req.body;

    console.log(req.body)

    try {
        const user = await User.findOneAndUpdate({ userName }, { ctsBalance }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(taskType !== null){
           res.json({...user, taskType:taskType, day:day, status:true});
        }else{
            res.json({...user, taskType:"Others",status:true})
        }
     
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message,status:false });
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
