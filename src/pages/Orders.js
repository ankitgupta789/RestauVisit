import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import {getNotifications,updateNotificationStatus} from '../services/NotificationRoutes/restauNotify';
import { fetchItemsByIds } from '../services/operations/menu'; // Import a function to fetch menu item details
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar/Navbar2';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchNotificationsWithMenuDetails = async () => {
      try {
        
        const fetchedNotifications = await getNotifications(user._id,false); // Fetch notifications
        console.log('Fetched notifications:', fetchedNotifications);

        // Extract unique menu item IDs from notifications
        const menuItemIds = [
          ...new Set(
            fetchedNotifications.flatMap((notification) =>
              notification.items.map((item) => item.itemId)
            )
          ),
        ];

        // Fetch menu item details
        const menuItems = await fetchItemsByIds(menuItemIds);
        console.log('Fetched menu items:', menuItems);

        // Map menu item details to notifications
        const updatedNotifications = fetchedNotifications.map((notification) => {
          const updatedItems = notification.items.map((item) => ({
            ...item,
            ...menuItems.data.find((menuItem) => menuItem._id === item.itemId), // Match menu item details
          }));
          return { ...notification, items: updatedItems };
        });

        // Sort notifications by createdAt in descending order
        updatedNotifications.sort(
          (b, a) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error('Error fetching notifications or menu items:', error);
      }
    };

    fetchNotificationsWithMenuDetails();

    // Create a socket connection to the server
    const socket = io('http://localhost:4000');

    // Join the room based on restaurant's email
    const restaurantEmail = user._id;
    socket.emit('join-order-room', restaurantEmail);

    // Listen for incoming order notifications
    socket.on('order-notification', (newNotification) => {
      console.log('New notification received: ', newNotification);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]); // Add the new notification to the top
      fetchNotificationsWithMenuDetails();
      toast.success('New notification received!');
    });

    // Cleanup when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Handler function to mark a notification as done
  const handleMarkAsDone = async (notificationId) => {
    try {
      await updateNotificationStatus(notificationId, { isRead: true }); // API call to update notification
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      toast.success('Notification marked as done!');
    } catch (error) {
      console.error('Error marking notification as done:', error);
      toast.error('Failed to mark as done!');
    }
  };

  return (
    <>
      <Navbar/>
      <div className="w-screen h-screen p-6 overflow-y-auto bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Notifications</h1>

        {/* Display list of all notifications */}
        <div>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg shadow-md p-4 mb-4 bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Order ID: {notification.orderId}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}
                </p>
                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">Items:</p>
                  <ul className="list-disc pl-5">
                    {notification.items.map((item, idx) => (
                      <li key={idx} className="text-gray-600 mb-2">
                        <p>
                          <strong>Name:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Description:</strong> {item.description || 'N/A'}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{item.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-medium text-gray-800">
                  <strong>Total Amount:</strong> ₹
                  {notification.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}
                </p>
                <p className="mt-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-medium ${
                      notification.isRead ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {notification.isRead ? 'Read' : 'Unread'}
                  </span>
                </p>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsDone(notification._id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark as Done
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
