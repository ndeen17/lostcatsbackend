const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your actual token
const token =  '8132499879:AAGdY59FiOYJmhVbLOehI7BSdu40AcO6-0Q';

// Initialize the bot
const bot = new TelegramBot(token, { polling: true });

// Log when the bot is running
console.log('Telegram Bot is running...');

// Error handling for polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

// Function to store the user in the database
const createUserInDatabase = async (userName, chatId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users`, { userName, chatId });
        console.log(`User ${userName} stored in the database.`);
        return response.data;
    } catch (error) {
        console.error("Error storing user in the database:", error.message);
    }
};

// Handle the /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.username || msg.from.first_name; // Get username or first name

    // Log the user information (for testing)
    console.log(`User Info - Username: ${userName}, Chat ID: ${chatId}`);

    // Check if the user already exists in the database
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${chatId}`);
        if (!res.data) {
            console.log(`User not found in the database. Creating a new user: ${userName}`);
            // If the user doesn't exist, create and store the new user in the database
            await createUserInDatabase(userName, chatId);
        } else {
            console.log(`User already exists in the database: ${userName}`);
        }
    } catch (err) {
        console.error('Error checking user in the database:', err.message);
    }

    // Send welcome message with instructions and game URL
    const welcomeMessage = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!

Click the button below to start playing the game.
    `;
    const gameUrl = 'https://lost-cats.onrender.com'; // Replace with your actual game URL

    // Send the welcome message and play button
    await bot.sendMessage(chatId, welcomeMessage);
    await bot.sendMessage(chatId, 'Click here to play the game!', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Play Game',
                        web_app: { url: gameUrl } // Use Web App URL for mini-app integration
                    }
                ]
            ]
        }
    });
});

// Automatically show "Start" button in the custom keyboard
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText !== '/start') {
        // Show the "Start" button if no specific message is sent
        bot.sendMessage(chatId, 'Please press Start to begin.', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Start' }] // Custom "Start" button
                ],
                resize_keyboard: true, // Optional: makes the keyboard fit the screen
                one_time_keyboard: true // Optional: hides the keyboard after one use
            }
        });
    }
});

// Error handling for webhook errors
bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error.code, error.message);
});


