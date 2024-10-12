const express = require('express');
const router = express.Router();
const User = require('../models/User');

const REWARD_AMOUNT = 500;

// Endpoint to generate an invite link
router.post('/generate-invite-link', async (req, res) => {
    const { userName } = req.body;
    try {
        let user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.inviteLink) {
            return res.status(200).json({ inviteLink: user.inviteLink });
        }
        const uniqueCode = Math.random().toString(36).substr(2, 9);
        user.inviteLink = `https://t.me/notdustbot?start=${uniqueCode}`;
        user.inviteCode = uniqueCode; // Store the invite code separately
        await user.save();
        res.status(200).json({ inviteLink: user.inviteLink });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate invite link." });
    }
});

module.exports = router;

// Invitee Sign-Up with the invite code
router.post('/accept-invite/:inviteCode', async (req, res) => {
    const { inviteCode } = req.params;
    const { userName } = req.body;

    try {
        // Find the inviter by invite code
        let inviter = await User.findOne({ inviteCode });
        if (!inviter) {
            return res.status(404).json({ message: "Invite link not found." });
        }

        // Check if the invitee is already in the invitedFriends array
        if (inviter.invitedFriends.includes(userName)) {
            return res.status(400).json({ message: "User already invited." });
        }

        // Add the invitee's username to the invitedFriends array
        inviter.invitedFriends.push(userName);

        // Reward the inviter with 600 NDT
        inviter.ctsBalance = (inviter.ctsBalance || 0) + 600;
        inviter.totalCTS = (inviter.totalCTS || 0) + 600;

        // Save the changes to the inviter's document
        await inviter.save();

        res.status(200).json({ message: "Invite accepted and inviter rewarded." });
    } catch (error) {
        res.status(500).json({ message: "Failed to accept invite." });
    }
});

// Endpoint to get invite data
router.get('/invite-data/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const inviteData = {
            invitedFriends: user.invitedFriends,
            totalCTS: user.totalCTS
        };

        res.status(200).json(inviteData);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch invite data." });
    }
});

module.exports = router;