const Question = require('../models/Question');

// Create a new question
exports.createQuestion = async (req, res) => {
  const { category, questionText, option1, option2, option3, option4, correctAnswer } = req.body;

  try {
    const question = await Question.create({
        category,
      questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Error creating question', message: err.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions', message: err.message });
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching question', message: err.message });
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, option1, option2, option3, option4, correctAnswer } = req.body;

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { questionText, option1, option2, option3, option4, correctAnswer },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Error updating question', message: err.message });
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting question', message: err.message });
  }
};
// Get questions by document name (category)
exports.getQuestionsByDocumentName = async (req, res) => {
    const { documentName } = req.query;
    //console.log("document name is ",documentName);
    console.log("hii errro here");
    try {
      const questions = await Question.find({ category: documentName });
      
      if (!questions.length) {
        
        return res.status(404).json({ error: 'No questions found for the given document name' });
      }
      
      res.status(200).json(questions);

    } catch (err) {
        
      res.status(500).json({ error: 'Error fetching questions', message: err.message });
    }
  };