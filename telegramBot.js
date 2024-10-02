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
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = chatId; // This is the unique identifier for each user

    // Send welcome message
    const welcomeMessage = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!`;

    const gameUrl = 'https://lost-cats.onrender.com'; // Your live game URL

    // Save user telegramId and other details to backend
    try {
        await axios.post('https://lostcatsbackend.onrender.com/save-user', {
            telegramId: telegramId,
        });
    } catch (error) {
        console.error('Error saving user to backend:', error);
    }

    // Send the welcome message and play button
    await bot.sendMessage(chatId, welcomeMessage);
    await bot.sendMessage(chatId, 'Meow!🐾 welcome to the hood kitty', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Game', web_app: { url: gameUrl } }],
            ],
        },
    });
});

// Handle invite link click
bot.onText(/\/invite/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        // Call backend to generate invite link for this user
        const response = await axios.post('https://lostcatsbackend.onrender.com/generate-invite-link', {
            telegramId: chatId,
        });
        
        const inviteLink = response.data.inviteLink;
        bot.sendMessage(chatId, `Share this link with your friends to earn CTS: ${inviteLink}`);
    } catch (error) {
        console.error('Error generating invite link:', error);
        bot.sendMessage(chatId, 'Failed to generate invite link.');
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
        });
    }
});
