import React, { useState, useEffect, useRef } from "react";
import { searchRestaurants, searchRestaurantsByCity} from "../services/operations/profile";
import backgroundImage from "../assets/background.jpeg"; // Import the image
import backgroundImage2 from "../assets/background2.jpeg";
import { useNavigate } from "react-router-dom"; // For navigation to new pages

const SearchBar = () => {
  const [query, setQuery] = useState(""); // User input for restaurant name
  const [restaurantResults, setRestaurantResults] = useState([]); // Search results for restaurants by name
  const [cityQuery, setCityQuery] = useState(""); // User input for city search
  const [cityResults, setCityResults] = useState([]); // Search results for restaurants by city
  const [debounceTimer, setDebounceTimer] = useState(null); // Timer for debouncing
  const [sliderOpen, setSliderOpen] = useState(false); // State to control the slider visibility

  const sliderRef = useRef(null); // Reference to the slider element
  const navigate = useNavigate(); // Navigation function

  // Handle search for restaurant name
  const handleRestaurantSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(async () => {
      if (value.trim()) {
        const data = await searchRestaurants(value); // Search by restaurant name
        setRestaurantResults(data); // Update results for restaurant search
      } else {
        setRestaurantResults([]); // Clear results if input is empty
      }
    }, 300); // 300ms debounce delay

    setDebounceTimer(newTimer);
  };

  // Handle search for city
  const handleCitySearch = (e) => {
    const value = e.target.value;
    setCityQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(async () => {
      if (value.trim()) {
        const data = await searchRestaurantsByCity(value); // Search by city
        setCityResults(data); // Update results for city search
      } else {
        setCityResults([]); // Clear results if input is empty
      }
    }, 300); // 300ms debounce delay

    setDebounceTimer(newTimer);
  };

  const handleClickOutside = (e) => {
    // Close the slider if the click is outside of it
    if (sliderRef.current && !sliderRef.current.contains(e.target)) {
      setSliderOpen(false);
    }
  };

  const handleRestaurantClick = (userId) => {
    navigate("/searchedRestaurant", {
      state: { userId: userId }, // Pass the email via state
    });
  };
  useEffect(() => {
    // Add event listener for detecting clicks outside the slider
    if (sliderOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sliderOpen]);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-start justify-center text-center"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported image
      }}
    >
      <div className="relative max-w-xl w-full mt-16">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Discover the best food & drinks in Your Area!
        </h1>

        {/* Search Bar Container */}
        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={handleRestaurantSearch}
            placeholder="Search for restaurant, cuisine or a dish"
            className="flex-1 p-3 text-sm focus:outline-none"
          />

          {/* Search Icon */}
          <button className="px-4 bg-red-500 text-white rounded-r-full hover:bg-red-600 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17.65 17a9 9 0 111.4-1.4 9 9 0 01-1.4 1.4z"
              />
            </svg>
          </button>
        </div>

        {/* Display Results for Restaurant, Cuisine, or Dish */}
        <div
          className={`absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10 ${restaurantResults.length === 0 ? "hidden" : ""}`}
        >
          {restaurantResults.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {restaurantResults.map((restaurant) => (
                <li key={restaurant._id} className="p-3">
                  <button
                    onClick={() => handleRestaurantClick(restaurant.userId)}
                    className="w-full text-left font-semibold text-blue-600 hover:underline"
                  >
                    {restaurant.name} - {restaurant.city}, {restaurant.state}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            query && <p className="p-3 text-sm text-gray-500">No results found</p>
          )}
        </div>
      </div>

      {/* Button to Open City Search Slider */}
      <button
        onClick={() => setSliderOpen(!sliderOpen)}
        className="absolute top-16 right-8 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
      >
        Search by City
      </button>

      {/* Slider for City Search */}
      <div
        ref={sliderRef}
        className={`fixed top-0 right-0 w-3/4 sm:w-1/3 h-full p-6 z-20 transform transition-all ${
          sliderOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundImage: `url(${backgroundImage2})`, // Apply background image to the slider
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Search by City</h2>
        <input
          type="text"
          value={cityQuery}
          onChange={handleCitySearch}
          placeholder="Enter city name"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
        {/* Display City Search Results */}
        <div className="mt-4">
          {cityResults.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto bg-white">
              {cityResults.map((restaurant) => (
                <li key={restaurant._id} className="p-3">
                  <button
                    onClick={() => handleRestaurantClick(restaurant.userId)}
                    className="w-full text-left font-semibold text-blue-600 hover:underline"
                  >
                    {restaurant.name} - {restaurant.city}, {restaurant.state}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            cityQuery && <p className="p-3 text-sm text-gray-500">No results found</p>
          )}
        </div>
        <button
          onClick={() => setSliderOpen(false)}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
