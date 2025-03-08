const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the related article
    required: true,
  },
  commenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who made the comment
    required: true,
  },
  commenterName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    get: function (value) {
      return value;  // Avoid recursively calling the getter itself
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: { getters: true }
});

module.exports = mongoose.model('Comment', commentSchema);
