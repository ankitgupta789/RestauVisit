import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client'; // Make sure you have socket.io-client installed

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [newOrder, setNewOrder] = useState(null); // To capture the latest order
  const { user } = useSelector((state) => state.profile);
  useEffect(() => {
    // Create a socket connection to the server
    const socket = io('http://localhost:4000');

    // Join the room based on restaurant's email (you can customize this to your needs)
    const restaurantEmail = user.email; // Replace with actual restaurant email
    socket.emit('join-order-room', restaurantEmail);

    // Listen for incoming order notifications
    socket.on('order-notification', (newNotification) => {
      // Handle new order notification
      console.log("New order received: ", newNotification);
      setNewOrder(newNotification); // Store the new order
      setOrders((prevOrders) => [...prevOrders, newNotification]); // Add new order to the orders list
    });

    // Cleanup when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Render the orders
  return (
    <div>
      <h1>My Orders</h1>

      {/* Display the latest order */}
      {newOrder && (
        <div>
          <h3>New Order: {newOrder.orderId}</h3>
          <p>Items: {newOrder.items.map((item) => item.itemId).join(', ')}</p>
          <p>Total Amount: {newOrder.totalAmount}</p>
          <p>Status: {newOrder.paymentStatus}</p>
        </div>
      )}

      {/* Display list of all orders */}
      <div>
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId}>
              <h3>Order ID: {order.orderId}</h3>
              <p>Items: {order.items.map((item) => item.itemId).join(', ')}</p>
              <p>Total Amount: {order.totalAmount}</p>
              <p>Status: {order.paymentStatus}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
