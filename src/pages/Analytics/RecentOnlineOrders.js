import React from 'react'
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import {fetchNotifications} from "../../services/NotificationRoutes/restauNotify"
import { fetchItemsByIds } from '../../services/operations/menu';
const ITEMS_PER_PAGE = 5; // Number of notifications per page


const RecentOnlineOrders = () => {
  const { user } = useSelector((state) => state.profile);
  const restaurantEmail = user._id;
 
  const [notifications, setNotifications] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
 
  useEffect(() => {
    
    const loadNotifications = async () => {
      try {
        const fetchedNotifications = await fetchNotifications(restaurantEmail);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [restaurantEmail]);

  const toggleExpand = async (index, items) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      if (!itemDetails[index]) {
        const itemIds = items.map((item) => item.itemId);
        try {
          const fetchedItems2 = await fetchItemsByIds(itemIds);
          const fetchedItems = fetchedItems2.data;

          const mergedItems = fetchedItems.map((item) => {
            const correspondingItem = items.find((i) => i.itemId === item._id);
            return {
              ...item,
              quantity: correspondingItem ? correspondingItem.quantity : 0,
            };
          });

          const totalAmount = mergedItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          setItemDetails((prev) => ({
            ...prev,
            [index]: { items: mergedItems, totalAmount },
          }));
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      }
      setExpandedIndexes((prev) => [...prev, index]);
    }
  };

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE); // Total number of pages

  const displayedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6 bg-white bg-opacity-80 p-2 rounded-lg shadow-lg relative overflow-y-auto">
    {/* Notifications Section */}
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-black mb-1">
        Recent Online Orders
      </h3>
      {loading ? (
        <p className="text-gray-600">Loading notifications...</p>
      ) : notifications.length > 0 ? (
        <div>
          {displayedNotifications.map((notification, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-2 rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold">User ID:</span>{" "}
                {notification.userId}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created At:</span>{" "}
                {notification.createdAt}
              </p>
              <button
                onClick={() => toggleExpand(index, notification.items)}
                className="text-blue-500 mt-3 hover:underline"
              >
                {expandedIndexes.includes(index) ? "Show Less" : "Show More"}
              </button>
              {expandedIndexes.includes(index) && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg p-4 mt-2 rounded-lg z-10">
                  <ul className="mt-4 space-y-3">
                    {(itemDetails[index]?.items || []).map(
                      (item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="border-b border-gray-300 pb-2"
                        >
                          <h4 className="text-lg text-black font-semibold">
                            {item.name}
                          </h4>
                          <p className="text-gray-500">{item.description}</p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Quantity:</span>{" "}
                            {item.quantity}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Price:</span> ₹
                            {item.price}
                          </p>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="text-lg font-bold text-green-600 mt-4">
                    Total Amount: ₹{itemDetails[index]?.totalAmount || 0}
                  </p>
                </div>
              )}
            </div>
          ))}
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No notifications available</p>
      )}
    </div>

    {/* Recent Bookings Section */}
   
  </div>
  )
}

export default RecentOnlineOrders
