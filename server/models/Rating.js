const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Rating schema
const ratingSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId, // Reference to User collection
    required: true,
    ref: 'User'
  },
  article_id: {
    type: Schema.Types.ObjectId, // Reference to Article collection
    required: true,
    ref: 'Course'
  },
  rating: {
    type: Number, // Rating value (e.g., 1-5 scale)
    required: true,
    min: 1,
    max: 5
  },
  created_at: {
    type: Date,
    default: Date.now // Automatically set the creation date
  },
  updated_at: {
    type: Date
  }
}, {
  // Automatically manage createdAt and updatedAt fields
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure that each user can rate an article only once
ratingSchema.index({ user_id: 1, article_id: 1 }, { unique: true });

// Compile the schema into a model and export it
module.exports = mongoose.model('Rating', ratingSchema);
