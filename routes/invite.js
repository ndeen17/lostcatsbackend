const express = require('express');
const router = express.Router();
const User = require('../models/User');

const REWARD_AMOUNT = 500;

// Endpoint to generate an invite link
router.post('/generate-invite-link', async (req, res) => {
    const { userName } = req.body;
    console.log("Received POST request with body:", req.body); 
    try {
        let user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const uniqueCode = Math.random().toString(36).substr(2, 9);
        user.inviteLink = `https://t.me/notdustbot?profile/invite/${uniqueCode}`;
        await user.save();
        res.status(200).json({ inviteLink: user.inviteLink });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate invite link." });
    }
});

// Invitee Sign-Up with the invite code
router.post('/accept-invite/:inviteCode', async (req, res) => {
    const { inviteCode } = req.params;
    const { userName } = req.body;

    try {
        const inviter = await User.findOne({ inviteLink: { $regex: inviteCode } });
        if (!inviter) {
            return res.status(400).json({ message: "Invalid invite link." });
        }

        let invitee = await User.findOne({ userName });
        if (!invitee) {
            invitee = new User({ userName, ctsBalance: 1000 });
            await invitee.save();
        } else {
            return res.status(400).json({ message: "Invitee already exists." });
        }

        inviter.totalCTS += REWARD_AMOUNT;
        inviter.ctsBalance += REWARD_AMOUNT;
        await inviter.save();

        res.status(200).json({ message: `Successfully accepted invite. ${REWARD_AMOUNT} CTS awarded to the inviter.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to accept invite." });
    }
});

module.exports = router;
