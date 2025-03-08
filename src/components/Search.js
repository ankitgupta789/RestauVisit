import React, { useState, useEffect, useRef } from "react";
import { searchRestaurants, searchRestaurantsByCity } from "../services/operations/profile";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { Button } from "@chakra-ui/react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [sliderOpen, setSliderOpen] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sliderOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sliderOpen]);

  const handleClickOutside = (e) => {
    if (sliderRef.current && !sliderRef.current.contains(e.target)) {
      setSliderOpen(false);
    }
  };

  return (
    <div className="h-screen min-h-screen ">
      <Navbar />
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold  mb-6 drop-shadow-lg">
          Discover the Best Food & Drinks!
        </h1>

        {/* Search Bar Container */}
        <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full shadow-lg w-[400px] p-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, cuisine..."
            className="flex-1 bg-transparent placeholder-gray-300 focus:outline-none px-3"
          />
          <button className="px-4 bg-teal-500  rounded-full hover:bg-teal-600 transition">
            🔍
          </button>
        </div>

        {/* Display Results */}
        {restaurantResults.length > 0 && (
          <div className="absolute top-[60%] w-[400px] bg-white bg-opacity-90 rounded-lg shadow-lg mt-4 max-h-60 overflow-y-auto">
            <ul>
              {restaurantResults.map((restaurant) => (
                <li key={restaurant._id} className="p-3 border-b border-gray-200">
                  <button
                    onClick={() => navigate("/searchedRestaurant", { state: { userId: restaurant.userId } })}
                    className="text-blue-600 hover:underline"
                  >
                    {restaurant.name} - {restaurant.city}, {restaurant.state}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* City Search Slider Button */}
        <button
          onClick={() => setSliderOpen(!sliderOpen)}
          className="absolute top-20 right-8 px-4 py-2 bg-richblue-100 rounded-full hover:bg-richblue-200 transition shadow-lg"
        >
          Search by City
        </button>


        {/* Slider for City Search */}
        <div
          ref={sliderRef}
          className={`fixed top-0 right-0 w-80 h-full p-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl transform transition-all ${
            sliderOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center gap-1">
            <div className="text-xl font-semibold  mb-4">Search by City</div>
            <Button
              onClick={() => setSliderOpen(false)}
              className="mt-4 w-fit bg-red-500  py-2 rounded-full hover:bg-red-600 transition"
            >
              Close
            </Button>
          </div>
          
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Enter city name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
          />
          {/* Display City Search Results */}
          {cityResults.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto bg-white rounded-lg shadow-md">
              <ul>
                {cityResults.map((restaurant) => (
                  <li key={restaurant._id} className="p-3 border-b border-gray-200">
                    <button
                      onClick={() => navigate("/searchedRestaurant", { state: { userId: restaurant.userId } })}
                      className="text-blue-600 hover:underline"
                    >
                      {restaurant.name} - {restaurant.city}, {restaurant.state}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Close Button */}
          
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
