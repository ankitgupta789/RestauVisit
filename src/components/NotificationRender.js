import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';


const NotificationRender = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.profile);
  useEffect(() => {
    // Establish a connection to the Socket.IO server
    const restaurantEmail = user._id;
    console.log("Joining room with email:", restaurantEmail);
    const socket = io('http://localhost:4000'); // Replace with your backend server URL

    console.log("Client socket connected");

    
    socket.emit('join-order-room', restaurantEmail);
    // Listen for the booking-table event
    socket.on('booking-table', (data) => {
      console.log('New booking table notification received:', data);

      // Update the notifications state with the new data
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    // Cleanup when the component unmounts
    return () => {
        console.log("Disconnecting socket...");
        socket.disconnect();
      };
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>Booking Details:</strong> {JSON.stringify(notification)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationRender;
