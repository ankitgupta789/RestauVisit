import React, { useEffect, useState } from "react";
import { fetchRecentReservations } from "../../services/Restaurants/BookTable"; // Backend function for fetching recent reservations
import { useSelector } from "react-redux";

const RecentBookings = () => {
  const { user } = useSelector((state) => state.profile); // Get user details from Redux
  const userId = user?._id; // Extract user ID
  const [bookings, setBookings] = useState([]); // State for bookings
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetchRecentReservations(userId); // Fetch recent bookings
        setBookings(response.data); // Set bookings in state
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  // Display loading or error message if applicable
  if (loading) {
    return <p className="text-center text-gray-500">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No recent bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between"
            >
              {/* Booking Details */}
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Customer ID:</span> {booking.customerId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Time:</span> {booking.slot}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Guests:</span> {booking.guests}
                </p>
                {/* <p className="text-sm text-gray-600">
                  <span className="font-semibold">Status:</span> {booking.status}
                </p> */}
              </div>

              {/* User Image */}
              <div className="flex-shrink-0 ml-4">
                {booking.userImage ? (
                  <img
                    src={booking.userImage}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentBookings;
