import axios from 'axios';

import {toast} from "react-hot-toast"
const BASE_URL = process.env.REACT_APP_BASE_URL;
// Function to create a new question
export const createQuestion = async (questionData) => {
  try {

    const response = await axios.post(`${BASE_URL}/question/createQuestion`, questionData);
    toast.success("Question saved successfully");
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const getQuestionsByDocumentName = async (documentName) => {
    try {
        console.log("document name is",documentName)
      const response = await axios.get(`${BASE_URL}/question/getQuestionsByDocumentName`, {
        params: { documentName }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error("Error fetching questions");
      throw error;
    }
  };