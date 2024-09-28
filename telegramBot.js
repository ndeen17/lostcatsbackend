const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User'); // Import the User model

// Replace with your actual token
const token = '8132499879:AAGdY59FiOYJmhVbLOehI7BSdu40AcO6-0Q';

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
    const userName = msg.from.username || msg.from.first_name; // Get username or first name
    const firstName = msg.from.first_name; // Get first name

    // Log the user information (for testing)
    console.log(`User Info - Username: ${userName}, First Name: ${firstName}, Chat ID: ${chatId}`);

    // Check if the user already exists in the database
    try {
        let user = await User.findOne({ chatId: chatId.toString() });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({ userName: userName, chatId: chatId.toString() });
            await user.save();
            console.log(`New user registered: ${userName} with Chat ID: ${chatId}`);
        } else {
            console.log(`User already exists: ${userName}`);
        }
    } catch (err) {
        console.error('Error saving user to the database:', err.message);
    }

    // Send welcome message with instructions
    const welcomeMessage = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!

Click the button below to start playing the game.
    `;

    const gameUrl = 'https://lost-cats.onrender.com'; // Your game URL

    // Send the welcome message and play button
    await bot.sendMessage(chatId, welcomeMessage);
    await bot.sendMessage(chatId, 'Click here to play the game!', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Play Game',
                        web_app: { url: gameUrl }
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