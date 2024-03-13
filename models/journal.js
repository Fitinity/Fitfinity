const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const journalEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [imageSchema],
  // Add the mood
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

module.exports = { JournalEntry };
