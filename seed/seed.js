const mongoose = require('mongoose');
const {JournalEntry}  = require('../models/journal')// Assuming your model is defined in a separate file

mongoose.connect('mongodb://127.0.0.1:27017/fitfinity')
    .then(() => console.log('Connected!'));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Sample data to insert
const sampleJournalEntries = [
    {
        author: '6158f52d96cb291b56b0a497', // Assuming this is a valid ObjectId for an existing user
        title: 'First Entry',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        images: [
            { url: 'https://example.com/image1.jpg', filename: 'image1.jpg' },
            { url: 'https://example.com/image2.jpg', filename: 'image2.jpg' }
        ],
        createdAt: new Date('2024-03-17T12:00:00Z')
    },
    {
        author: '6158f52d96cb291b56b0a497',
        title: 'Second Entry',
        content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        images: [
            { url: 'https://example.com/image3.jpg', filename: 'image3.jpg' },
            { url: 'https://example.com/image4.jpg', filename: 'image4.jpg' }
        ],
        createdAt: new Date('2024-03-18T12:00:00Z')
    }
];

// Insert sample data
JournalEntry.insertMany(sampleJournalEntries)
    .then(docs => {
        console.log('Sample data inserted successfully:', docs);
    })
    .catch(err => {
        console.error('Error inserting sample data:', err);
    });

  