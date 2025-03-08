const mongoose = require("mongoose");

// Define the Article schema
const coursesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Explore Universe",
      "Astronomy",
      "Astrophysics",
      "Rocket Science",
      "Planetary Science",
      "Space Missions",
      "Cosmology",
    ], // Valid categories
  },
  authorName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  articleSummary: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"], // Valid difficulty levels
  },
  enableComments: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  published: {
    type: Boolean,
    default: false,
  }
});

// Export the Article model
module.exports = mongoose.model("Course", coursesSchema);
