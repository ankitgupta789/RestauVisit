import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchReviews = async () => {
  try {
    console.log("reached-->")
    const response = await axios.get(
      `${BASE_URL}/getall/reviews` // Replace with your actual backend URL if needed
    );
    console.log(response.data, "all reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};


const BASE_URL1 = `${BASE_URL}/profile`; // Adjust if needed

export const fetchProfileByUserId = async (userId) => {
    

  try {
    console.log("Fetching profile for userId:", userId);
    
    const response = await axios.get(`${BASE_URL1}/getProfileById/${userId}`);
    
    console.log(response.data, "Fetched profile data");
   
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw error;
  }
};

