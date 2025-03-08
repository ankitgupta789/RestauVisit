const MenuItem = require('../models/Menu');
const User = require('../models/User');

// Add a new menu item
const getAllItems = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming the email is sent in the request body
  
      if (!userId) {
        return res.status(400).json({ message: "userId is required to fetch menu items" });
      }
  
      // Fetch all menu items related to the provided email
      const menuItems = await MenuItem.find({ userId: userId });
  
      if (menuItems.length === 0) {
        return res.status(404).json({ message: "No menu items found for this restaurant" });
      }
  
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items", error });
    }
  };
  
const addItem = async (req, res) => {
  try {
    const { name, description, price, category, image_url, preparation_time, availability, restaurant_email, user } = req.body;
    
    // Verify the user ID from the user object sent in the request
    // console.log(user,"user present?")
    const existingUser = await User.findById(user._id);  // Find user by ID
    // console.log(existingUser);
    if (!existingUser) {
        // console.log("is it called");
      return res.status(404).json({ message: "User not found" });
    }
    
    // Ensure the user is authorized to add items to the restaurant's menu
    if (existingUser._id.toString() !== user._id || existingUser.email !== restaurant_email) {
      return res.status(403).json({ message: "You are not authorized to add menu items to this restaurant" });
    }
    const userId=user._id;
    // Create new menu item
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image_url,
      preparation_time,
      availability,
      userId
    });

    await newMenuItem.save();
    res.status(201).json({ message: "Menu item added successfully", newMenuItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error });
  }
};

// Edit a menu item by ID using findOneAndUpdate
const editItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, preparation_time, availability, user } = req.body;
    console.log(name,description,price,category,image_url,"value sent");
    // Find the menu item by ID
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
//    console.log(user,"user sent is");
    // Verify the user ID from the user object sent in the request
    const existingUser = await User.findById(user._id);  // Find user by ID
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user is the owner of the restaurant
    if (existingUser._id.toString() !== user._id || existingUser.email !== menuItem.restaurant_email) {
      return res.status(403).json({ message: "You are not authorized to edit this menu item" });
    }
    
    // Update menu item
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, {
      $set: {
        name,
        description,
        price,
        category,
        image_url,
        preparation_time,
        availability
      }
    }, { new: true });
    console.log(updatedMenuItem,"updated item");
    res.status(200).json({ message: "Menu item updated successfully", updatedMenuItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

// Delete a menu item by ID
const deleteItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the menu item by ID
      const menuItem = await MenuItem.findById(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      // Verify the user ID from the user object sent in the request
      const { user } = req.body;
      const existingUser = await User.findById(user._id);  // Find user by ID
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // console.log(menuItem,"printing item");
      console.log(menuItem.userId,existingUser._id,"printing item and user");
      // // Ensure the user is the owner of the restaurant
      if (existingUser._id == menuItem.userId) {
        return res.status(403).json({ message: "You are not authorized to delete this menu item" });
      }
  
      // Delete the menu item using deleteOne
      await MenuItem.deleteOne({ _id: id });
  
      res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting menu item", error });
    }
  };
  const searchMenuItem = async (req, res) => {
    try {
      const { email } = req.params;
      const { query } = req.query;
  
      if (!email) {
        return res.status(400).json({ message: "Restaurant email is required." });
      }
  
      if (!query) {
        return res.status(400).json({ message: "Search query is required." });
      }
  
      // Split the query into individual words
      const queryWords = query.split(" ").filter((word) => word.trim() !== "");
  
      // Create a search condition for each word
      const searchConditions = queryWords.map((word) => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } }
        ]
      }));
  
      // Perform the search
      const menuItems = await MenuItem.find({
        restaurant_email: email,
        $and: searchConditions
      });
  
      if (menuItems.length === 0) {
        return res.status(404).json({ message: "No menu items found matching the query." });
      }
  
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Error searching menu items", error });
    }
  };
  const getMenuItemsById = async (req, res) => {
    try {
        const { itemIds } = req.query; // Array of emails sent from the frontend
        console.log(itemIds);
        if (!itemIds || !Array.isArray(itemIds)) {
            return res.status(400).json({ error: 'Invalid input. Provide an array of ids.' });
        }

        // Fetch menuItems with email matching any in the array
        const menuItems = await MenuItem.find({ _id: { $in: itemIds } });
        // console.log(menuItems,"items in the cart");
        return res.status(200).json({ success: true, data: menuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getAllItems,
  addItem,
  editItem,
  deleteItem,
  searchMenuItem,
  getMenuItemsById
};
