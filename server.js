const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');

require('./telegramBot'); // Adjust the path if necessary


dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI); // Log the URI


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {  // Change MONGO_URI to MONGODB_URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/tasks', taskRoutes); // Task routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/leaderboard', leaderboardRoutes); // Leaderboard routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
