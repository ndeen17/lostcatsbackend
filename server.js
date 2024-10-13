// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const inviteRoutes = require('./routes/invite');

// Import Telegram bot (ensure the correct path is used)
require('./telegramBot'); // Adjust the path if necessary

dotenv.config(); // Load environment variables

console.log('MongoDB URI:', process.env.MONGODB_URI); // Log MongoDB URI for debugging

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allows requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)  // Using environment variable for MongoDB URI
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/tasks', taskRoutes); // Task routes
app.use('/users', userRoutes); // User routes
app.use('/leaderboard', leaderboardRoutes); // Leaderboard routes
app.use('/invite', inviteRoutes); // Invite routes

// Webhook route for Telegram bot
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  const bot = require('./telegramBot'); // Import the bot instance from telegramBot.js
  bot.processUpdate(req.body); // Process incoming updates from Telegram
  res.sendStatus(200); // Send a 200 OK response to Telegram
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
