const Cart = require('../models/Cart'); // Import Cart model
const Menu = require('../models/Menu'); // Import MenuItem model

// Add item to cart controller
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    console.log(userId,itemId,"data recieved about the cart")
    // Check if the item exists
    const item = await Menu.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the item already exists in the user's cart
    const existingCartItem = await Cart.findOne({ userId, itemId });
    if (existingCartItem) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    // Create a new cart item
    const newCartItem = new Cart({
      userId,
      itemId,
    });

    // Save the cart item to the database
    await newCartItem.save();

    return res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem: newCartItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getCartItems = async (req, res) => {
    try {
      const { userId } = req.params; // Get userId from the request parameters
  
      // Find all cart items for the user and populate item details (name, price)
      const cartItems = await Cart.find({ userId })
        .populate('itemId', 'name price'); // Only populate the name and price fields
  
      if (!cartItems.length) {
        return res.status(404).json({ message: 'No items found in cart' });
      }
  
      return res.status(200).json({ cartItems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  const deleteCartItem = async (req, res) => {
    try {
      const { itemId } = req.params; // Get cart item ID from the request parameters
     console.log(itemId,"id recieved");
      // Find and delete the cart item
      const deletedItem = await Cart.findOneAndDelete({ itemId });
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      return res.status(200).json({
        message: 'Item removed from cart successfully',
        deletedItem,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { addToCart, getCartItems, deleteCartItem };
