const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  restaurant_email: { type: String, required: true },
  user_email: { type: String, required: true },
  username: { type: String, required: true },
  review_text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
