const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
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

const gymSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [imageSchema],
  price: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
});

const Gym = mongoose.model("Gym", gymSchema);

module.exports = { Gym };
