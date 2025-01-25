import axios from 'axios';

// Function to fetch notifications
export const getNotifications = async (restaurantEmail, readFlag) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/restauNotify/getNotifications/${restaurantEmail}?readFlag=${readFlag}`
    );

    const notifications = response.data;
    console.log('Notifications fetched successfully:', notifications);
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
