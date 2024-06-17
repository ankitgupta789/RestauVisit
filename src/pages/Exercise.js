import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Exercise = () => {
  const location = useLocation();
  const questions = location.state?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    setIsQuizCompleted(true);
    setShowConfirmation(false);
  };

  const handleCancelFinish = () => {
    setShowConfirmation(false);
  };

  if (isQuizCompleted) {
    // Filter the questions to only include those that have been answered
    const answeredQuestions = questions.filter((_, index) => userAnswers[index] !== undefined);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-3xl p-8 bg-white rounded-md shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">Quiz Completed!</h2>
          <div className="overflow-y-auto max-h-[25rem]">
            {answeredQuestions.length > 0 ? (
              answeredQuestions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{`Question ${questions.indexOf(question) + 1}: ${question.questionText}`}</p>
                  <p className="text-green-600">{`Correct Answer: ${question.correctAnswer}`}</p>
                  <p className={`text-${userAnswers[questions.indexOf(question)] === question.correctAnswer ? 'green' : 'red'}-600`}>
                    {`Your Answer: ${userAnswers[questions.indexOf(question)]}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-red-600 text-center">No questions were answered.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-3xl min-h-[40rem] p-8 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Question {currentQuestionIndex + 1}</h2>
        <p className="mb-4">{currentQuestion.questionText}</p>
        <div className="mb-4">
          {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, index) => (
            <div key={index} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name={`answer-${currentQuestionIndex}`}
                  value={option}
                  onChange={handleAnswerChange}
                  checked={userAnswers[currentQuestionIndex] === option}
                  className="form-radio"
                />
                <span className="ml-2">{option}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-gray-600"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
          <button
            onClick={() => setShowConfirmation(true)}
            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Finish
          </button>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to finish the quiz?</h3>
            <div className="flex justify-end">
              <button
                onClick={handleCancelFinish}
                className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishQuiz}
                className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
