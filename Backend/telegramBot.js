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

// Handle incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === '/start') {
        const howToPlay = "Welcome to the game! Here's how to play: ..."; // Add your how-to-play guide here.
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
    }
});

// Error handling for webhook errors
bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error.code, error.message);
});
