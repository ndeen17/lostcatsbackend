const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Use axios to send requests to your backend

// Replace with your actual token (use environment variables in production)
const token = '7862848496:AAGpMgpRBlilVa8Mc8sFZvr6Sm_BipMavWA'; // Always use environment variables for sensitive data
const bot = new TelegramBot(token, { polling: true });

console.log('Telegram Bot is running...');

bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

// Handle /start command
bot.onText(/\/start (.+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const inviteCode = match[1]; // Extract the invite code if present

    if (inviteCode) {
        // If invite code is present, direct the user to the inviteesignup page
        const inviteeSignupUrl = `https://lost-cats.onrender.com//invitee-signup?inviteCode=${inviteCode}`;
        await bot.sendMessage(chatId, 'You have been invited! Please complete your signup:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Complete Signup', web_app: { url: inviteeSignupUrl } }],
                ],
            },
        });
    } else {
        // Send welcome message for new users
        const welcomeMessage = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!`;

const gameUrl = 'https://lost-cats.onrender.com'; // Your live game URL

// Send the welcome message and play button
await bot.sendMessage(chatId, welcomeMessage);
await bot.sendMessage(chatId, 'NODUST!🐾 welcomes you to the hood', {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Play Game', web_app: { url: gameUrl } }],
        ],
    },
});
}
});

bot.on('message', (msg) => {
const chatId = msg.chat.id;
const messageText = msg.text;

if (messageText && !messageText.startsWith('/')) {
    bot.sendMessage(chatId, 'Please press Start to begin.', {
        reply_markup: {
            keyboard: [[{ text: 'Start' }]], 
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}
});