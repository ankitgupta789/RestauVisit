const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user
    ref: "User", // The name of the model being referenced
    required: true,
  },
  commenterId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user
    ref: "User", // The name of the model being referenced
    required: true,
  },
  username: { type: String, required: true },
  review_text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
