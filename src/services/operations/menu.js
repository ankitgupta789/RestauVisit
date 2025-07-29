import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
// Function to get all menu items for a restaurant by email
export const getAllItems = async (userId) => {
  try {
    console.log(`Fetching menu items for restaurant email: ${userId}`);
    
    const response = await axios.get(`${BASE_URL}/menu/getAllItems/${userId}`);

    // Check if menu items exist
    if (response.data && response.data.length > 0) {
      console.log("Menu items retrieved:", response.data);
      return response.data; // Return the list of menu items
    } else {
      console.log("No menu items found for this restaurant.");
      return []; // Return an empty array if no items are found
    }
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to add a new menu item for a restaurant
export const addItem = async (user, name, description, price, category, image_url, preparation_time, availability, restaurant_email) => {
  try {
    const newMenuItem = {
      name,
      description,
      price,
      category,
      image_url,
      preparation_time,
      availability,
      restaurant_email
    };

    console.log(`Adding new menu item for restaurant: ${restaurant_email}`);
    
    const response = await axios.post(
      `${BASE_URL}/menu/addItem`,
      { ...newMenuItem, user } // Sending user data and menu item data
    );

    if (response.status === 201) {
      console.log("Menu item added:", response.data);
      return response.data; // Return the new menu item
    }
  } catch (error) {
    console.error("Error adding menu item:", error);
    return null; // Return null if there's an error
  }
};

// Function to edit an existing menu item by ID
export const editItem = async (user, id, updatedData) => {
  try {
    console.log(updatedData,"data to be updated");
    const response = await axios.put(
      `${BASE_URL}/menu/editItem/${id}`,
      { ...updatedData, user } // Send user data along with the updated data
    );

    if (response.status === 200) {
      console.log("Menu item updated:", response.data);
      return response.data; // Return the updated menu item
    }
  } catch (error) {
    console.error("Error editing menu item:", error);
    return null; // Return null if there's an error
  }
};

// Function to delete a menu item by ID
export const deleteItem = async (user, id) => {
  try {
    console.log(`Deleting menu item with ID: ${id}`);
    
    const response = await axios.delete(
      `${BASE_URL}/menu/deleteItem/${id}`,
      {
        data: { user } // Send user data to verify authorization
      }
    );

    if (response.status === 200) {
      console.log("Menu item deleted:", response.data);
      return response.data; // Return success message
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return null; // Return null if there's an error
  }
};
export const searchMenuItems = async (userId, query) => {
    try {
      console.log(`Searching menu items for restaurant userId: ${userId} with query: ${query}`);
      
      const response = await axios.get(
        `${BASE_URL}/menu/search/${userId}?query=${query}`
      );
  
      if (response.data && response.data.length > 0) {
        console.log("Search results:", response.data);
        return response.data; // Return the search results
      } else {
        console.log("No menu items found for the given query.");
        return []; // Return an empty array if no items are found
      }
    } catch (error) {
      console.error("Error searching menu items:", error);
      return []; // Return an empty array in case of an error
    }
  };
  export const fetchItemsByIds = async (itemIds) => {
    try {
      console.log(`Fetching menu items for item IDs:`, itemIds);
  
      // Ensure itemIds is an array
      if (!Array.isArray(itemIds)) {
        throw new Error("The 'itemIds' parameter must be an array.");
      }
      console.log(itemIds,"ids sent from the frontend");
      // Call the backend API
      const response = await axios.get(`${BASE_URL}/menu/getItemsByIds`, { params: { itemIds }, });
      console.log(response.data,"response for the cart");
      // Check if menu items exist
      
        return response.data; // Return the list of menu items
     
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return []; // Return an empty array in case of an error
    }
  };