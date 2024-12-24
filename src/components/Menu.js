import React, { useState, useEffect } from "react";
import { getAllItems, addItem, deleteItem, editItem } from "../services/operations/menu"; // Adjust the path as needed
import { useSelector } from "react-redux";
import axios from "axios"; // To make API requests for Cloudinary
import { FaEllipsisV } from "react-icons/fa"; 

const Menu = () => {
  const [menuData, setMenuData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null); // State for the edited item
  const { user } = useSelector((state) => state.profile);
  const restaurantEmail = user.email;
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    preparation_time: "",
    availability: true,
  });
  
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item for options
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Loader state

  // Fetch menu items from the server
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const email = user.email;
        const items = await getAllItems(email);
        const categorizedData = items.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});
        setMenuData(categorizedData);

        // Set the default selected category to the first category
        const defaultCategory = Object.keys(categorizedData)[0] || "";
        setSelectedCategory(defaultCategory);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [user.email, newItem]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Prepare the form data for uploading the image
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your preset name
  
    setIsUploadingImage(true); // Start loader
    try {
      // Upload the image to Cloudinary
      const response = await axios.post("https://api.cloudinary.com/v1_1/dvlvjwx5t/image/upload", formData);
  
      // Get the image URL from the response
      const imageUrl = response.data.secure_url;
  
      // If it's in edit mode, update the image URL in the edited item
      setNewItem({ ...newItem, image_url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false); // Stop loader
    }
  };
  // Add a new item
  const handleAddItem = async () => {
    if (newItem.name.trim() && newItem.category.trim() && newItem.image_url.trim()) {
      try {
        const addedItem = await addItem(
          user,
          newItem.name,
          newItem.description,
          parseFloat(newItem.price),
          newItem.category,
          newItem.image_url,
          parseInt(newItem.preparation_time),
          newItem.availability,
          restaurantEmail
        );

        if (addedItem) {
          setMenuData((prevData) => ({
            ...prevData,
            [newItem.category]: [...(prevData[newItem.category] || []), addedItem],
          }));
          setNewItem({
            name: "",
            description: "",
            price: "",
            category: "",
            image_url: "",
            preparation_time: "",
            availability: true,
          });
          setIsSidebarOpen(false);
        }
      } catch (error) {
        console.error("Error adding menu item:", error);
      }
    }
  };

  // Delete an item from the menu
  const handleDeleteItem = async (itemId, category) => {
    try {
      await deleteItem(itemId, restaurantEmail); // Delete the item on the server

      // Update the local state to remove the item
      setMenuData((prevData) => {
        const updatedCategory = prevData[category].filter((item) => item._id !== itemId);
        return {
          ...prevData,
          [category]: updatedCategory,
        };
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  // Handle edit
  const handleEditItem = (item) => {
    setEditedItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url,
      preparation_time: item.preparation_time.toString(),
      availability: item.availability,
    });
    setIsSidebarOpen(true);
  };

  // Update an item
  const handleUpdateItem = async () => {
    if (newItem.name.trim() && newItem.category.trim() && newItem.image_url.trim()) {
      try {
        const updatedData = {
          name: newItem.name,
          description: newItem.description,
          price: parseFloat(newItem.price),
          category: newItem.category,
          image_url: newItem.image_url,
          preparation_time: parseInt(newItem.preparation_time),
          availability: newItem.availability,
        };

        const updatedItem = await editItem(user, editedItem._id, updatedData);
        if (updatedItem) {
          setMenuData((prevData) => {
            const updatedCategory = prevData[editedItem.category].map((item) =>
              item._id === updatedItem._id ? updatedItem : item
            );
            return {
              ...prevData,
              [editedItem.category]: updatedCategory,
            };
          });
          setEditedItem(null); // Clear edited item
          setNewItem({
            name: "",
            description: "",
            price: "",
            category: "",
            image_url: "",
            preparation_time: "",
            availability: true,
          });
          setIsSidebarOpen(false);
        }
      } catch (error) {
        console.error("Error updating menu item:", error);
      }
    }
  };

  const renderMenuItems = () => {
    return (menuData[selectedCategory] || []).map((item) => {
      // Toggle visibility of options for the specific item
      const toggleOptions = (itemId) => {
        setSelectedItem((prev) => (prev === itemId ? null : itemId));
      };
  
      // Handle Delete
      const handleDelete = (itemId, category) => {
        handleDeleteItem(itemId, category); // Your existing delete logic
        setSelectedItem(null); // Close the options dropdown
      };
  
      // Handle Edit
      const handleEdit = (item) => {
        handleEditItem(item); // Your existing edit logic
        setSelectedItem(null); // Close the options dropdown
      };
  
      return (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-all transform hover:scale-105 hover:shadow-xl relative"
        >
          {/* Item Image with Availability Badge */}
          <div className="relative w-full">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-60 h-45 object-cover mb-4 rounded-lg"
            />
            {/* Availability Badge */}
            <span
              className={`absolute top-2 left-2 text-sm font-bold px-3 py-1 rounded-lg ${
                item.availability ? "bg-caribbeangreen-100 text-white" : "bg-pink-200 text-white"
              }`}
            >
              {item.availability ? "Available" : "Unavailable"}
            </span>
          </div>
  
          {/* Item Details */}
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-600 text-center">{item.description}</p>
          <p className="text-gray-700 font-semibold mt-2">${item.price}</p>
  
          {/* Three dots for options */}
          <button
            onClick={() => toggleOptions(item._id)} // Toggle options for this item
            className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV /> {/* Three dots icon */}
          </button>
  
          {/* Options Dropdown */}
          {selectedItem === item._id && (
            <div className="absolute top-12 right-4 bg-white shadow-lg rounded-md p-2">
              <button
                onClick={() => handleDelete(item._id, selectedCategory)}
                className="block w-full text-red-500 hover:bg-gray-100 py-2 px-4 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="block w-full text-blue-500 hover:bg-gray-100 py-2 px-4 rounded-md"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      );
    });
  };
  

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(e.target) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-[11/12] bg-cover bg-center p-8 bg-gray-100 overflow-y-auto" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')" }}>
      <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">Our Menu</h1>

      {/* Category Buttons */}
      <div className="flex justify-center space-x-6 mb-8 bg-white min-h-20 font-bold">
        {["Veg Starter", "Veg Main Course", "Non-Veg Starter", "Non-Veg Main Course"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-6 rounded-lg transition-all transform ${
              selectedCategory === category
                ? "bg-yellow-500 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-800 hover:bg-yellow-300 hover:scale-105"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add Item Button - Positioned at top-right */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-8 right-8 py-2 px-6 rounded-lg font-bold bg-pure-greys-100 text-black hover:bg-green-600 transition-all transform hover:scale-105"
      >
        Add Item
      </button>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {renderMenuItems()}
      </div>

      {/* Sliding Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 right-0 h-full bg-white shadow-xl p-6 z-50 transition-all transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">{editedItem ? "Edit Item" : "Add New Item"}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          ></textarea>
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Preparation Time (in minutes)"
            value={newItem.preparation_time}
            onChange={(e) => setNewItem({ ...newItem, preparation_time: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <div>
            <label className="block mb-2 text-gray-600">Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Veg Starter">Veg Starter</option>
              <option value="Veg Main Course">Veg Main Course</option>
              <option value="Non-Veg Starter">Non-Veg Starter</option>
              <option value="Non-Veg Main Course">Non-Veg Main Course</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newItem.availability}
              onChange={(e) => setNewItem({ ...newItem, availability: e.target.checked })}
              className="mr-2"
            />
            <span>Available</span>
          </div>
        </div>

        {/* Image upload */}
        <div className="mt-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {isUploadingImage && <div className="loader text-center mt-4">Uploading...</div>}
        {newItem.image_url && <img src={newItem.image_url} alt="Selected" className="w-32 h-32 object-cover mt-4" />}
      </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={editedItem ? handleUpdateItem : handleAddItem}
            className="py-2 px-4 bg-pure-greys-300 text-white rounded-lg"
          >
            
            {editedItem ? "Update Item" : "Add Item"}
            
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="py-2 px-4 bg-red-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
