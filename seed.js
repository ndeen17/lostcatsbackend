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
        { _id: new mongoose.Types.ObjectId(), task: 'Follow us on Twitter', reward: 600, url: 'https://x.com/NotdustClan' },
        { _id: new mongoose.Types.ObjectId(), task: 'Follow Our Instagram page', reward: 500, url: 'https://www.instagram.com/notdustclan?igsh=MWlxc2J2bHp2YnBocA==' },
        { _id: new mongoose.Types.ObjectId(), task: 'Follow Our Facebook page', reward: 500, url: 'https://lost-cats.onrender.com' },
        { _id: new mongoose.Types.ObjectId(), task: 'Play our Game', reward: 500, url: 'https://lost-cats.onrender.com' }

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
