import axios from 'axios';

// Function to get all menu items for a restaurant by email
export const getAllReviews = async (userId) => {
  try {
    //  console.log("hello",userId);
    const response = await axios.get(`http://localhost:4000/api/v1/review/getAllReviews/${userId}`);

    // Check if menu items exist
    if (response.data && response.data.length > 0) {
      return response.data; // Return the list of menu items
    } else {
      console.log("No review found for this restaurant.");
      return []; // Return an empty array if no items are found
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to add a new menu item for a restaurant
export const addReview = async (userId,commenterId,username, review_text, rating) => {
    try {
      const newReview = {
        userId,
        commenterId,
        username,
        review_text,
        rating,
      };
  
      console.log(`Adding new review for restaurant: ${userId}`);
      
      const response = await axios.post(
        "http://localhost:4000/api/v1/review/addReview", // Adjusted API endpoint for reviews
        newReview // Sending the review data to the server
      );
  
      if (response.status === 201) {
        console.log("Review added:", response.data);
        return response.data; // Return the newly added review
      }
    } catch (error) {
      console.error("Error adding review:", error);
      return null; // Return null if there's an error
    }
  };
  

// Function to edit an existing menu item by ID
export const editReview = async (user, id, updatedData) => {
    try {
      console.log(updatedData, "data to be updated");
      console.log(id,"id sent is");
      
      const response = await axios.put(
        `http://localhost:4000/api/v1/review/editReview/${id}`, // Adjusted API endpoint for editing reviews
        { ...updatedData, user } // Send user data along with the updated review data
      );
  
      if (response.status === 200) {
        console.log("Review updated:", response.data);
        return response.data; // Return the updated review
      }
    } catch (error) {
      console.error("Error editing review:", error);
      return null; // Return null if there's an error
    }
  };
  

// Function to delete a menu item by ID
export const deleteReview = async (user, id) => {
    try {
      console.log(`Deleting review with ID: ${id}`);
      
      const response = await axios.delete(
        `http://localhost:4000/api/v1/review/deleteReview/${id}`, // Adjusted API endpoint for deleting reviews
        {
          data: { user } // Send user data to verify authorization
        }
      );
  
      if (response.status === 200) {
        console.log("Review deleted:", response.data);
        return response.data; // Return success message
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      return null; // Return null if there's an error
    }
  };
  
export const upvoteReview = async (reviewId,userId) => {
    try {
        const response = await axios.put(`http://localhost:4000/api/v1/review/upvote/${reviewId}`,{userId:userId});
        return response.data; // Returns updated upvotes & downvotes count
    } catch (error) {
        console.error("Error upvoting review:", error.response?.data || error.message);
        throw error;
    }
};

export const downvoteReview = async (reviewId,userId) => {
    try {
        const response = await axios.put(`http://localhost:4000/api/v1/review/downvote/${reviewId}`,{userId:userId});
        return response.data; // Returns updated upvotes & downvotes count
    } catch (error) {
        console.error("Error downvoting review:", error.response?.data || error.message);
        throw error;
    }
};
// api.js

// Function to add a reply to a review
export const addReply = async (userId, reviewId, text,username) => {
  try {
    // Make the POST request to the backend
    // console.log(userId,reviewId,replyText,username,"data sent")
    const response = await axios.post(`http://localhost:4000/api/v1/reply/addReply/${reviewId}`, {
      userId,
      text,
      username
    });
    return response.data; // Return the updated review object
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error; // Rethrow error to be handled in the calling function
  }
};

export const getReplies = async (reviewId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/reply/getReplies/${reviewId}`);
    console.log("Replies:", response.data);
    return response.data; // Return replies to use in state if needed
  } catch (error) {
    console.error("Error fetching replies:", error.response?.data || error.message);
  }
};

