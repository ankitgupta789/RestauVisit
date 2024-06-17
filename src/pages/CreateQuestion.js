import React, { useState } from 'react';
// import { createQuestion } from './questionService'; // Adjust the import path based on your project structure
import { createQuestion } from '../services/operations/question';
import { checkDocumentExistence } from '../services/operations/document';
const CreateQuestion = () => {
  const [questionData, setQuestionData] = useState({
    category: '', // New field for category
    questionText: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
  });
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example validation logic (you can add more detailed validation as needed)
    if (
      ! questionData.category.trim()||
      !questionData.questionText.trim() ||
      !questionData.option1.trim() ||
      !questionData.option2.trim() ||
      !questionData.option3.trim() ||
      !questionData.option4.trim() ||
      !questionData.correctAnswer.trim()
    ) {
      alert('Please fill out all fields');
      return;
    }
     // Check if the document exists before proceeding to create the question
     const documentExists = await checkDocumentExistence(questionData.category);
     if (!documentExists) {
      // alert(`Document '${questionData.category}' does not exist.`);
       return;
     }
    createQuestion(questionData);
    setQuestionData({
            category: '',
            questionText: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: '',
          });

    // try {
    //   const newQuestion = await createQuestion(questionData);
    //   console.log('Question created:', newQuestion);
    //   // Reset form after submission
    //   setQuestionData({
    //     category: '',
    //     questionText: '',
    //     option1: '',
    //     option2: '',
    //     option3: '',
    //     option4: '',
    //     correctAnswer: '',
    //   });
    // } catch (error) {
    //   console.error('Error creating question:', error);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-md shadow-md overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Question</h2>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-screen">
          <div className="mb-0 flex justify-between">
            <label className="text-gray-900 block text-gray-700 mb-2">Document Name from which it belongs to:</label>
            <input
              type="text"
              name="category"
              value={questionData.category}
              onChange={handleChange}
              className="w-1/2 p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Question Text</label>
            <input
              type="text"
              name="questionText"
              value={questionData.questionText}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Option 1</label>
            <input
              type="text"
              name="option1"
              value={questionData.option1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Option 2</label>
            <input
              type="text"
              name="option2"
              value={questionData.option2}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Option 3</label>
            <input
              type="text"
              name="option3"
              value={questionData.option3}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Option 4</label>
            <input
              type="text"
              name="option4"
              value={questionData.option4}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <div className="mb-1">
            <label className="text-blue-200 block text-gray-700 mb-2">Correct Answer</label>
            <input
              type="text"
              name="correctAnswer"
              value={questionData.correctAnswer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required // Make the field required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Create Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
