import axios from 'axios';

// Function to get all menu items for a restaurant by email
export const getAllReviews = async (email) => {
  try {
    
    const response = await axios.get(`http://localhost:4000/api/v1/review/getAllReviews/${email}`);

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
export const addReview = async (restaurant_email,user_email,username, review_text, rating) => {
    try {
      const newReview = {
        restaurant_email,
        user_email,
        username,
        review_text,
        rating,
      };
  
      console.log(`Adding new review for restaurant: ${restaurant_email}`);
      
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