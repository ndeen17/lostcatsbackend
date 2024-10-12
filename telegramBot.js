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

    try {
        if (!inviteCode) {
            // Handle users without an invite code
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
            console.log('Sent welcome message to chatId:', chatId); // Log the message sending
        } else {
            // Handle users with an invite code
            const inviteeSignupUrl = `https://lost-cats.onrender.com/invitee-signup?inviteCode=${inviteCode}`;
            await bot.sendMessage(chatId, 'You have been invited! Please complete your signup:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Complete Signup', web_app: { url: inviteeSignupUrl } }],
                    ],
                },
            });
            console.log('Sent invite signup message to chatId:', chatId); // Log the message sending
        }
    } catch (error) {
        console.error('Error handling /start command:', error);
        await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
    }
});

// Handle other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    console.log('Received message:', messageText); // Log the received message

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