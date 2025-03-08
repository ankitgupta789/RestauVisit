// Function to call the addTable API
import axios from 'axios';

export const addTable = async (restaurantId, capacity) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/api/v1/table/add-table', 
      {
        restaurantId,
        capacity,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      console.log('Table added successfully:', response.data.table);
      return response.data.table; // Return the added table if needed
    }
  } catch (error) {
    console.error('Error adding table:', error.response?.data?.message || error.message);
    alert(error.response?.data?.message || 'Failed to add table.');
  }
};
export const fetchTables = async (restaurantId) => {
    try {
        console.log(restaurantId,"printing id sent by the user");
      if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
      }
  
      // Make a GET request to the backend
      const response = await axios.get(
        `http://localhost:4000/api/v1/table/getTables?restaurantId=${restaurantId}`
      );
  
      // Handle the response
      console.log('Tables fetched successfully:', response.data.tables);
      return response.data.tables; // Return the tables data
    } catch (error) {
      console.error('Error fetching tables:', error.message);
  
      // Optional: You can throw the error to handle it in the calling code
      throw error;
    }
  };
  

export const markSlotAsBooked = async (tableId, timeSlot, userName) => {
  try {
    console.log(tableId,timeSlot,userName);
    const response = await axios.post('http://localhost:4000/api/v1/table/markBooked', {
      tableId,
      timeSlot,
      userName,
    });

    if (response.status === 200) {
      
      return response.data;
    } else {
      alert('Failed to book the slot. Please try again.');
      return null;
    }
  } catch (error) {
    console.error('Error booking slot:', error);
    alert('An error occurred while booking the slot. Please try again.');
    return null;
  }
};
export const markSlotAsUnBooked = async (tableId, timeSlot) => {
    try {
      console.log(tableId,timeSlot);
      const response = await axios.post('http://localhost:4000/api/v1/table/unmarkBooked', {
        tableId,
        timeSlot
      });
  
      if (response.status === 200) {
        
        return response.data;
      } else {
        alert('Failed to unbook the slot. Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Error unbooking slot:', error);
      alert('An error occurred while unbooking the slot. Please try again.');
      return null;
    }
  };
  

  // Function to check slot availability
 export const checkSlotAvailability = async (timeSlot, capacity) => {
    try {
      // Validate input
      if (!timeSlot || !capacity) {
        return { success: false, message: 'Time slot and capacity are required.' };
      }
  
      // API Req
      const response = await axios.post('http://localhost:4000/api/v1/table/checkSlotAvailability', {
        timeSlot,
        capacity,
      });
  
      // Handle res
      if (response.status === 200) {
        const { available, message, totalAvailableCapacity } = response.data;
  
        return {
          success: true,
          available,
          message,
          totalAvailableCapacity,
        };
      }
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong.',
      };
    }
  };
  
 
  