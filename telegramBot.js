const TelegramBot = require('node-telegram-bot-api');

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

// Automatically show "Start" button in the custom keyboard
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === '/start' || messageText === 'Start') {
        const howToPlay = `
Welcome to the Game! 🐾

How to play:
1. Complete tasks to earn points.
2. Climb up the leaderboard.
3. Have fun!

Click the button below to start playing the game.
        `;

        const gameUrl = 'https://lost-cats.onrender.com'; // Your game URL

        bot.sendMessage(chatId, howToPlay)
            .then(() => {
                return bot.sendMessage(chatId, 'Click here to play the game!', {
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
            })
            .then(() => {
                console.log(`Game link sent to chat ${chatId}`);
            })
            .catch((err) => {
                console.error(`Failed to send message to chat ${chatId}:`, err.message);
            });
    } else {
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
