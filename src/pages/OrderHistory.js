import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/order"; // Import the function to fetch orders
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const userId = user._id;
  const navigate=useNavigate();
  const handleRestaurantClick = (userId) => {
    navigate("/searchedRestaurant", {
      state: { userId: userId }, // Pass the email via state
    });
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getUserOrders(userId);
        // Sort orders by date in descending order (most recent first)
        const sortedOrders = fetchedOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-700 mt-5">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-5">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center text-gray-500 mt-5">No orders found for this user.</div>;
  }

  return (
    <div className="w-full mx-auto p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-lg shadow-md p-5 mb-6 bg-white"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Order ID: <span className="text-blue-600">{order.orderId}</span>
          </h3>
          <p className="text-gray-600 mt-2">
            <strong>Total Amount:</strong> <span className="text-green-600">₹{order.totalAmount}</span>
          </p>
          <p className="text-gray-600">
            <strong>Payment Status:</strong>{" "}
            <span className={order.paymentStatus === "Completed" ? "text-green-600" : "text-red-600"}>
              {order.paymentStatus}
            </span>
          </p>
          <p className="text-gray-600">
            <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-700">Items:</h4>
            <ul className="mt-2 space-y-4">
              {order.items.map((restaurant, index) => (
                <li key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                  <p className="text-gray-700 font-semibold">
    Restaurant site:{" "}
    <button
      onClick={() => handleRestaurantClick(restaurant.restaurantEmail)}
      className="text-indigo-600 underline hover:text-indigo-800"
    >
      Visit
    </button>
  </p>
                  <ul className="mt-2 space-y-2">
                    {restaurant.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex justify-between">
                        <span className="text-gray-600">
                          {item.name} - {item.quantity} x ₹{item.price}
                        </span>
                        <span className="text-gray-700 font-medium">₹{item.quantity * item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-800 font-bold mt-2">
                    Subtotal: <span className="text-green-600">₹{restaurant.subTotal}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
