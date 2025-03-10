import React, { useState, useEffect, useRef } from "react";
import { searchRestaurants, searchRestaurantsByCity} from "../services/operations/profile";
import backgroundImage from "../assets/background.jpeg"; // Import the image
import backgroundImage2 from "../assets/background2.jpeg";
import { useNavigate } from "react-router-dom"; // For navigation to new pages
import Navbar2 from "../components/Navbar/Navbar2"
const Home = () => {
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
    <div className="min-h-screen h-screen">
       <Navbar2/>
    <div className="w-full overflow-y-auto">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-5 text-center">
  <h1 className="text-4xl font-bold">RestauVisit</h1>
  <p className="mt-2 text-lg">Discover and Book Your Next Restaurant Visit</p>

  {/* Centering the search bar */}
  <div className="flex justify-center mt-5">
    <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden w-80 md:w-[30rem]">
      <input
        type="text"
        value={query}
        onChange={handleRestaurantSearch}
        placeholder="Search for restaurant, cuisine or a dish"
        className="p-3 w-full text-black border-none outline-none"
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
    className={`absolute mt-14  bg-white border border-gray-300 rounded-lg shadow-md z-10 ${
      restaurantResults.length === 0 ? "hidden" : ""
    }`}
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
              <button
                onClick={() => setSliderOpen(false)}
                className="mt-4 w-fit bg-red-500  py-2 rounded-full hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
            
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder="Enter city name"
              className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none bg-gray-100"
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
</section>


      {/* FEATURES SECTION */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Choose RestauVisit?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 shadow-lg rounded-xl bg-white">
            <h3 className="text-xl font-bold mb-2">Seamless Table Booking</h3>
            <p>Reserve your favorite spot with just a few clicks.</p>
          </div>
          <div className="p-6 shadow-lg rounded-xl bg-white">
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p>Pay online safely using Razorpay integration.</p>
          </div>
          <div className="p-6 shadow-lg rounded-xl bg-white">
            <h3 className="text-xl font-bold mb-2">Real-Time Availability</h3>
            <p>Check seat availability before booking.</p>
          </div>
        </div>
      </section>
{/* 
      FEATURED RESTAURANTS
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-6">Featured Restaurants</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredRestaurants.map((restaurant, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <img src={restaurant.img} alt={restaurant.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-xl font-semibold mt-3">{restaurant.name}</h3>
              <p className="text-gray-500">{restaurant.location}</p>
              <div className="flex items-center justify-center mt-2">
                <FaStar className="text-yellow-500" />
                <span className="ml-1 font-bold">{restaurant.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="italic">"Booking my table was super easy, loved the experience!"</p>
            <h4 className="mt-3 font-semibold">- Rahul M.</h4>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="italic">"Fast checkout and secure payments, highly recommend!"</p>
            <h4 className="mt-3 font-semibold">- Priya S.</h4>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Home;