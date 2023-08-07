const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const todoSchema = new Schema({
  userId: { type: String, required: true },
  tmdbId: { type: String, required: true },
  reviewBody: { type: String, required: true },
  rating: { type: Number, required: true },
  createdDate: { type: Date, default: Date.now }
});

const Review = mongoose.model("review", todoSchema);
module.exports = Review;