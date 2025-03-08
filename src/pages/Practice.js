import React, { useState } from 'react';
import { checkDocumentExistence } from '../services/operations/document';
import { getQuestionsByDocumentName } from '../services/operations/question';
import {toast} from "react-hot-toast"
import Exercise from './Exercise';
import { useNavigate } from 'react-router-dom';
const Practice = () => {
  const [documentName, setDocumentName] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate=useNavigate();
  const handleChange = (e) => {
    setDocumentName(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const documentExists = await checkDocumentExistence(documentName);
    if (!documentExists) {
     // alert(`Document '${questionData.category}' does not exist.`);
      return;
    }
   
    try {
        const fetchedQuestions = await getQuestionsByDocumentName(documentName);
        setQuestions(fetchedQuestions);
        navigate('/exercise', { state: { questions: fetchedQuestions } });

        console.log('Fetched questions:', fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error(`Error fetching questions for document '${documentName}'`);
      }
   //navigagte to new page
     
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-lg p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Enter Document Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="documentName">
              Document Name
            </label>
            <input
              type="text"
              id="documentName"
              name="documentName"
              value={documentName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-lg"
              placeholder="Enter the name of the document"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Practice;
