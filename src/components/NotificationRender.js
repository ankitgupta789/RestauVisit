import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { markBookingAsSeen,getOrdersByUserId } from '../services/Restaurants/BookTable'

const NotificationRender = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.profile);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const unseenNotifications = await getOrdersByUserId(user._id); // Fetch unseen notifications
        if (unseenNotifications) {
          setNotifications(unseenNotifications); // Update state with the fetched notifications
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);
  useEffect(() => {
    const restaurantEmail = user._id;
    console.log('Joining room with email:', restaurantEmail);

    const socket = io('http://localhost:4000'); // Replace with your backend server URL
    console.log('Client socket connected');

    socket.emit('join-order-room', restaurantEmail);

    // Listen for the booking-table event
    socket.on('booking-table', (data) => {
      console.log('New booking table notification received:', data);
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    // Cleanup when the component unmounts
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  const handleMarkAsDone = async (id) => {
    try {
      await markBookingAsSeen(id); // Calling the function from the other file
      // Update the notifications state to remove the marked notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      console.error('Error marking notification as done:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h1>
      <div className="space-y-4 overflow-y-auto h-[calc(100vh-200px)] pb-20">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-600 text-sm">Notification #{index + 1}</p>
              <p className="text-gray-900 font-medium mb-2">
                <strong>Booking Details:</strong>
              </p>
              <div className="text-gray-800 space-y-1">
                <p><strong>Name:</strong> {notification.name}</p>
                <p><strong>Guests:</strong> {notification.guests}</p>
                <p><strong>Slot:</strong> {notification.slot}</p>
                <p><strong>Status:</strong> {notification.status}</p>
                <p><strong>Amount:</strong> ₹{(notification.amount / 100).toFixed(2)}</p>
                <p><strong>Currency:</strong> {notification.currency}</p>
              </div>
              <button
                onClick={() => handleMarkAsDone(notification._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Mark as Done
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationRender;
