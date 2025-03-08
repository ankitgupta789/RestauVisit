import axios from 'axios';

// Function to fetch notifications
export const getNotifications = async (restaurantEmail, readFlag) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/restauNotify/getNotifications/${restaurantEmail}?readFlag=${readFlag}`
    );

    const notifications = response.data;
    // console.log('Notifications fetched successfully:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};


// Function to update notification status
export const updateNotificationStatus = async (notificationId, data) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/restauNotify/markAsRead/${notificationId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error; // Handle this appropriately in your application
  }
};

export const fetchNotifications = async (restaurantEmail) => {
  try {
    // API endpoint to fetch notifications
    
    const url = `http://localhost:4000/api/v1/restauNotify/getRecentNotifications/${restaurantEmail}`;
    
    // Make the GET request
    const response = await axios.get(url);

    // Return the notifications from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications. Please try again later.");
  }
};



export const fetchNotificationStats = async (restaurantEmail, duration) => {
  try {
    
    const response = await axios.get(`http://localhost:4000/api/v1/restauNotify/notificationsstats/${restaurantEmail}`, {
      params: { duration },
    });
    return response.data; // returns { notificationCount, totalRevenue }
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    throw new Error("Failed to fetch notification stats");
  }
};


export const fetchGraphData = async (restaurantEmail, duration) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/restauNotify/graph/${restaurantEmail}`,
      {
        params: { duration }, // Passing duration as a query parameter
      }
    );
    return response.data; // Return the data to be used in the component
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return null;
  }
};

