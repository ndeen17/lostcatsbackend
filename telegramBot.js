const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// Replace with your actual token (use environment variables in production)
const token = '8132499879:AAGdY59FiOYJmhVbLOehI7BSdu40AcO6-0Q'; // Use environment variable for security

// Initialize the bot
const bot = new TelegramBot(token, { polling: true });

// Log when the bot is running
console.log('Telegram Bot is running...');

// Error handling for polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

// Handle the /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // Send welcome message with instructions
    const welcomeMessage = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!`;

    const gameUrl = 'https://lost-cats.onrender.com'; // Your live game URL
    const communityUrl = 'https://t.me/your_telegram_community'; // Replace with your Telegram community link
    const groupUrl = 'https://t.me/your_telegram_group'; // Replace with your Telegram group link

    // Send the welcome message and play button
    await bot.sendMessage(chatId, welcomeMessage);
    await bot.sendMessage(chatId, 'Meow!🐾 welcome to the hood kitty', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Game', web_app: { url: gameUrl } }],
                [{ text: 'Join Community', url: communityUrl }], // Button for the Telegram community
                [{ text: 'Join Group', url: groupUrl }] // Button for the Telegram group
            ]
        }
    });
});

// Automatically show "Start" button if no command is recognized
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Check if the message is not a command
    if (messageText && !messageText.startsWith('/')) {
        // Show the "Start" button if no specific command is sent
        bot.sendMessage(chatId, 'Please press Start to begin.', {
            reply_markup: {
                keyboard: [[{ text: 'Start' }]], // Custom "Start" button
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});

// Error handling for webhook errors
bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error.code, error.message);
});
