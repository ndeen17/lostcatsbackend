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

        // Generate unique invite code
        const uniqueCode = Math.random().toString(36).substr(2, 9);
        user.inviteLink = `https://t.me/notdustbot?profile/invite/${uniqueCode}`; // Store the generated link
        await user.save();
        
        res.status(200).json({ inviteLink: user.inviteLink });
    } catch (error) {
        console.error("Error generating invite link:", error);
        res.status(500).json({ message: "Failed to generate invite link." });
    }
});

// Endpoint for invitees to sign up using invite link
router.post('/accept-invite/:inviteCode', async (req, res) => {
    const { inviteCode } = req.params;
    const { userName } = req.body;

    try {
        // Find the inviter by searching for the user who generated the invite
        const inviter = await User.findOne({ inviteLink: { $regex: inviteCode } });

        if (!inviter) {
            return res.status(400).json({ message: "Invalid invite link." });
        }

        // Check if the invitee is already a user
        let invitee = await User.findOne({ userName });

        if (!invitee) {
            // Create a new user for the invitee
            invitee = new User({ userName, ctsBalance: 1000 });
            await invitee.save();
        } else {
            return res.status(400).json({ message: "Invitee already exists." });
        }

        // Reward the inviter with CTS for the successful invite
        inviter.totalCTS += REWARD_AMOUNT;
        inviter.ctsBalance += REWARD_AMOUNT;
        await inviter.save();

        res.status(200).json({ message: `Successfully accepted invite. ${REWARD_AMOUNT} CTS awarded to the inviter.` });
    } catch (error) {
        console.error("Error accepting invite:", error);
        res.status(500).json({ message: "Failed to accept invite." });
    }
});

// Endpoint to get user invite data
router.get('/invite-data', async (req, res) => {
    const { userName } = req.query;

    try {
        const user = await User.findOne({ userName }).select('inviteLink totalCTS');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            inviteLink: user.inviteLink,
            ctsEarned: user.totalCTS,
        });
    } catch (error) {
        console.error("Error fetching invite data:", error);
        res.status(500).json({ message: "Failed to load invite data." });
    }
});

module.exports = router;
