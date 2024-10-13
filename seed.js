require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Ensure the path is correct

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
})
.then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing tasks
    await Task.deleteMany({});

    // Define your tasks
    const tasks = [
        { _id: new mongoose.Types.ObjectId(), task: 'Join our Community', reward: 1000, url: 'https://t.me/NotdustClan' },
        { _id: new mongoose.Types.ObjectId(), task: 'Follow us on Twitter', reward: 600, url: 'https://twitter.com' },
        // Add more tasks as needed
    ];

    // Seed tasks into the database
    await Task.insertMany(tasks);
    console.log("Tasks seeded");

    // Disconnect from the database
    mongoose.disconnect();
})
.catch(err => {
    console.error("Error connecting to MongoDB", err);
});
