const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the question
const questionSchema = new Schema({
    category: {
        type: String,
        required: true,
      },
  questionText: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema and export it
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
