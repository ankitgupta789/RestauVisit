import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReviews, fetchProfileByUserId } from "../services/Restaurants/RatingReviews";
import Navbar2 from "../components/Navbar/Navbar2"
const ReviewsByUser = () => {
  const [groupedReviews, setGroupedReviews] = useState({});
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviews = await fetchReviews();

        // Group reviews by userId
        const groups = reviews.reduce((acc, review) => {
          const userId = typeof review.userId === "object" && review.userId._id ? review.userId._id : review.userId;
          if (!acc[userId]) acc[userId] = [];
          acc[userId].push(review.rating);
          return acc;
        }, {});
        setGroupedReviews(groups);

        // Fetch user profiles
        const userIds = Object.keys(groups);
        const profileData = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const response = await fetchProfileByUserId(userId);
              const profile = Array.isArray(response.data) ? response.data[0] : response.data;
              return { userId, profile };
            } catch (err) {
              console.error(`Error fetching profile for userId: ${userId}`, err);
              return { userId, profile: null };
            }
          })
        );

        const profileMap = profileData.reduce((acc, { userId, profile }) => {
          acc[userId] = profile || {};
          return acc;
        }, {});
        setProfiles(profileMap);
      } catch (err) {
        console.error(err);
        setError("Error fetching reviews");
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, []);

  const calculateAverage = (ratings) => {
    if (!ratings.length) return 0;
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2);
  };

  const handleRestaurantClick = (userId) => {
    navigate("/searchedRestaurant", {
      state: { userId: userId },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <p className="text-2xl animate-pulse">Loading reviews...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-500 to-orange-600 text-white">
        <p className="text-2xl">{error}</p>
      </div>
    );

  return (
    <>
    <Navbar2/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-700 text-black p-8">
        
      <h1 className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg">
        User Reviews
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.keys(groupedReviews).map((userId) => {
          const profile = profiles[userId] || {};
          const avgRating = calculateAverage(groupedReviews[userId]);

          return (
            <div
              key={userId}
              className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Header section with image and user details */}
              <div className="flex items-center">
                <img
                  src={profile.image || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-white object-cover mr-4"
                />
                <div>
                  <button
                    onClick={() => handleRestaurantClick(userId)}
                    className="text-xl font-semibold text-yellow-300 hover:text-yellow-400 transition duration-300 underline cursor-pointer"
                  >
                    {profile.name || `User ID: ${userId}`}
                  </button>
                  <p className="text-sm text-gray-300">
                    {profile.contactNumber ? `Contact: ${profile.contactNumber}` : "No contact available"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {profile.address || "No address provided"}
                    {profile.city ? `, ${profile.city}` : ""} 
                    {profile.state ? `, ${profile.state}` : ""}
                  </p>
                </div>
              </div>

              {/* Ratings section */}
              <div className="mt-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-3xl ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-400"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="text-sm font-medium bg-yellow-400 text-gray-900 px-3 py-1 rounded-md shadow-md inline-block mt-2">
                  Avg: {avgRating}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default ReviewsByUser;
