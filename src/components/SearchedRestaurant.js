import React, { useEffect, useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../services/operations/profile"; // Importing the function for fetching restaurant data
import { getAllImages } from "../services/operations/photos"; // Importing the function for fetching photos' URLs
import { searchMenuItems, getAllItems } from "../services/operations/menu"; // Function to query menu items
import { useSelector } from "react-redux";
import { addReview,getAllReviews,editReview,deleteReview } from "../services/operations/Review";
import { addToCart } from "../services/operations/cart";
import Reserve from "./Reserve";
import RestauReviews from "./Reviews/RestauReviews";

const SearchedRestaurant = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { user } = useSelector((state) => state.profile);
  const email="ankitguptamanheru@gmail.com";
  // State to hold restaurant data
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    about: "",
    city: "",
    state: "",
    contactNumber: "",
    photos: [],
  });

  // State for menu items and search
  const [allMenuItems, setAllMenuItems] = useState([]); // All menu items (unfiltered)
  const [menuItems, setMenuItems] = useState([]); // Currently displayed menu items (filtered or unfiltered)
  const [searchQuery, setSearchQuery] = useState("");

  // State for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);

  //Review Handling states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState([]); // To store the list of reviews

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Calculate the items for the current page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = menuItems.slice(startIndex, endIndex);
  const [menuOpen, setMenuOpen] = useState(null); // Track which menu is open (by review ID)

  const handleMenuToggle = (reviewId) => {
    setMenuOpen(menuOpen === reviewId ? null : reviewId);
  };
  const [editingReview, setEditingReview] = useState(null); // Track the review being edited
  const [editedText, setEditedText] = useState(""); // Track the edited review text
  const [editedData, setEditedData] = useState({ review_text: "", rating: 0 });
  // Total number of pages
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);
  const [userProfiles, setUserProfiles] = useState({});
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
     const username=user.firstName+" "+user.lastName;
     
     const commenterId=user._id;
    const response = await addReview(userId,commenterId,username ,reviewText, rating); // Calls the `addReview` function
    if (response) {
      setReviews((prevReviews) => [...prevReviews, response]); // Add new review to the state
      setReviewText(""); // Reset form
      setRating("");
    }
    fetchAllReviews();
  };
  // Fetch restaurant data and photos
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!userId) {
        setError("No email provided.");
        setLoading(false);
        return;
      }

      try {
        // Fetch restaurant data
        const restaurantDetails = await getProfile(userId);

        // Fetch photos' URLs using a separate API call
        const photoUrls = await getAllImages(userId);

        // Ensure Cloudinary URL formatting
        const cloudinaryImages = photoUrls.map((url) => {
          if (!url.includes("cloudinary")) {
            console.warn("URL is not from Cloudinary:", url);
            return ""; // Return an empty string for invalid URLs
          }
          return `${url}?auto=format&fit=crop`; // Ensure proper Cloudinary formatting
        });

        // Update restaurant data state
        setRestaurantData({
          ...restaurantDetails,
          photos: cloudinaryImages,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurant data or photos.");
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [email]);

  // Fetch all menu items or search menu items based on query
  const fetchMenuItems = async (query) => {
    try {
      let items;
      if (query) {
        items = await searchMenuItems(userId, query); // Fetch based on search query
      } else {
        items = await getAllItems(userId); // Fetch all items if no query
      }

      // Store all items in both states initially
      setAllMenuItems(items);
      setMenuItems(items);

      // Extract unique categories from items
      const uniqueCategories = [...new Set(items.map((item) => item.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  // Filter items based on category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filteredItems = allMenuItems.filter((item) => item.category === category);
      setMenuItems(filteredItems);
    } else {
      setMenuItems(allMenuItems); // Reset to all items if no category is selected
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = allMenuItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setMenuItems(filteredItems);
  };

  // Fetch all menu items initially
  const fetchAllReviews = async () => {
    try {
      // Wait for getAllReviews to return the data
      const data = await getAllReviews(userId); 

      // Log the data to the console before setting it
      console.log('Fetched reviews:', data);

      // Set the data to the reviews state
      setReviews(data);

    } catch (error) {
      // Handle any errors that might occur during the fetch
      console.error('Error fetching reviews:', error);
    }
  };
  const fetchUserProfiles = async () => {
    const profiles = {};
    for (const review of reviews) {
      if (review.commenterId) {
        const profilePicture = await getProfile(review.commenterId);
        if (profilePicture) {
          profiles[review.commenterId] = profilePicture;
        }
      }
    }
    setUserProfiles(profiles);
    console.log(profiles,"prfile fetched are");
  };
  
  // Run fetchAllReviews once when the component is mounted or when email changes
  useEffect(() => {
    if (userId) {
      console.log("is it called");
      fetchAllReviews();
    }
  }, [userId]); 
  useEffect(() => {
    if (userId) {
      fetchMenuItems(); // Initial fetch when component loads
    }
  }, [userId]);
  useEffect(() => {
    if (reviews.length > 0) {
      fetchUserProfiles();
    }
  }, [reviews]);
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const { name, about, city, state, contactNumber, photos,image } = restaurantData;

  // Function to open the modal
  const openModal = (index) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to navigate to the next photo
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Function to navigate to the previous photo
  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };
  const handleEdit2 = (review) => {
    setEditingReview(review._id);
    setEditedData({
      review_text: review.review_text, // Pre-fill with current text
      rating: review.rating, // Pre-fill with current rating
    });
    setMenuOpen(null); // Close the menu
  };


  // Cancel editing
  const handleCancel = () => {
    setEditingReview(null);
    setEditedData({ review_text: "", rating: 0 });
  };
  
  const handleEdit = async (reviewId) => {
    const updatedData =editedData // Example updated data
    
    const response = await editReview(user, reviewId, updatedData);
    if (response) {
      console.log("Review successfully updated:", response);
      // Optionally, refresh reviews here or update state

      setEditingReview(null);
      setEditedData({ review_text: "", rating: 0 });
      handleCancel();
      fetchAllReviews();
    }
   
    setMenuOpen(null); // Close the menu
  };
  

  // Handle delete action
  const handleDelete = async (reviewId) => {
    const response = await deleteReview(user, reviewId);
    if (response) {
      console.log("Review successfully deleted:", response);
      // Optionally, refresh reviews here or update state
    }
    setMenuOpen(null); // Close the menu
    fetchAllReviews();
  };
 //clicking the Add Cart button
  const handleClickCart = async (itemId) => {
    try {
      // Assuming you have the user's ID stored somewhere (e.g., in local storage or context)
      const userId = user._id; // Replace with your actual user ID fetching logic
  
      // Call the addToCart function
      await addToCart(userId, itemId);
  
      // Optionally, update the UI or show a success message
      console.log("Item added to cart!");
    } catch (error) {
      console.error("Error in handleClickCart:", error);
    }
  };
  

  return (
    <div className="bg-blue-25 min-h-[11/12] p-6 overflow-y-auto">
      {/* Restaurant Info and Photos Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
  {/* Main Flex Container */}
  <div className="flex">
    {/* Left Section (Restaurant Info and Images) */}
    <div className="pr-6 w-3/4">
      {/* Restaurant Info Section */}
      <div className="flex items-start mb-8">
        {/* Restaurant Info (Left side) */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{name}</h1>
          <p className="text-lg text-gray-600 mb-4">{about || "No description available."}</p>
          <p className="text-md text-gray-700 mb-2">
            <span className="font-semibold">Location:</span> {city}, {state}
          </p>
          <p className="text-md text-gray-700 mb-4">
            <span className="font-semibold">Contact:</span> {contactNumber || "Not available"}
          </p>

          {/* Buttons for Navigation */}
          <div className="flex gap-4 mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => scrollToSection(menuRef)}
            >
              View Menu
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => scrollToSection(reviewsRef)}
            >
              View Reviews
            </button>
          </div>
        </div>

        {/* Restaurant Image (Right side of Info Section) */}
        <div className="w-1/3 ml-8">
          <img
            src={image || "/default-image.jpg"} // Display the image or fallback to default
            alt="Restaurant"
            className="w-64 h-64 object-cover rounded-full shadow-md"
          />
        </div>
      </div>

      {/* Photos Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos && photos.length > 0 ? (
          photos.map((photo, index) => (
            <img
              key={index}
              src={photo || "/default-image.jpg"} // Fallback if the URL is invalid or empty
              alt={`Restaurant Image ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(index)}
            />
          ))
        ) : (
          <p className="text-gray-600">No photos available.</p>
        )}
      </div>
    </div>

    {/* Right Section (Table Booking System) */}
    <div className="flex-1 pl-6 border-l border-gray-200 w-1/4">
      <Reserve  userId={userId}/>
    </div>
  </div>
</div>

<h1 ref={menuRef} className="text-2xl font-semibold mb-4">Our Menu</h1>
      {/* Bottom Section Divided Into 3 Parts */}
      <div ref={menuRef} className=" bg-pure-greys-100 flex flex-row gap-8">
        {/* Categories Section */}
        <div className="w-1/4 bg-blue-50 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
          <ul className="list-disc ml-6">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <li
                  key={index}
                  className={`text-gray-700 cursor-pointer ${
                    selectedCategory === category ? "font-bold" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No categories available.</p>
            )}
          </ul>
        </div>
{/* All Fetched Items Section */}
<div className="w-3/4 bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Items</h2>
  {menuItems.length > 0 ? (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map((item, index) => (
          <div key={index} className="relative bg-white shadow-lg rounded-lg p-4">
            {/* Menu Item Image */}
            <img
              src={`${item.image_url}?auto=format&fit=crop`}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <span
              className={`absolute top-2 left-2 text-sm font-bold px-3 py-1 rounded-lg ${
                item.availability ? "bg-caribbeangreen-100 text-white" : "bg-pink-200 text-white"
              }`}
            >
              {item.availability ? "Available" : "Unavailable"}
            </span>
            <h3 className="text-xl font-semibold text-gray-800 mt-2">
              {item.name}
            </h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-gray-800 font-semibold mt-2">
              ${item.price}
            </p>
            
            {/* Add to Cart Button */}
            {item.availability && (
              <button
                className="mt-4 w-full py-2 bg-caribbeangreen-500 text-white font-semibold rounded-lg hover:bg-caribbeangreen-600"
                onClick={() => handleClickCart(item._id)} // Call the addToCart function
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center mt-4">
        <button
          className={`p-2 rounded-lg bg-gray-200 mx-2 ${
            currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="text-gray-800 font-medium">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className={`p-2 rounded-lg bg-gray-200 mx-2 ${
            currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </>
  ) : (
    <p className="text-gray-600">No menu items found.</p>
  )}
</div>



        {/* Search Section */}
        <div className="w-1/4 bg-blue-50 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Menu</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search menu items..."
            className="w-full p-2 mb-4 border rounded-lg"
          />
        </div>
      </div>
      <div className="flex-1 pl-6 border-l border-gray-200 ">
      <RestauReviews  userId={userId}/>
    </div>


      {/* Modal for zooming photos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={prevPhoto}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full p-2 hover:bg-gray-300 z-10"
            >
              ⬅
            </button>

            {/* Current Photo */}
            <img
              src={photos[currentPhotoIndex] || "/default-image.jpg"} // Fallback for invalid URLs
              alt="Zoomed Photo"
              className="max-w-full max-h-screen rounded-lg"
            />

            {/* Right Arrow */}
            <button
              onClick={nextPhoto}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full p-2 hover:bg-gray-300 z-10"
            >
              ➡
            </button>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-10 transform bg-gray-300 text-gray-800 rounded-full p-5 hover:bg-gray-400 transition-all duration-300"
              style={{ fontSize: "2rem" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchedRestaurant;
