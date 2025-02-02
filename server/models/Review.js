const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user being reviewed
    ref: "User",
    required: true,
  },
  commenterId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user writing the review
    ref: "User",
    required: true,
  },
  username: { type: String, required: true },
  review_text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who upvoted the review
  downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who downvoted the review
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Array of reply reviews
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
