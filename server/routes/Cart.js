const express = require('express');
const router = express.Router();
const { addToCart, getCartItems,deleteCartItem } = require('../controllers/Cart'); // Import controllers

// Route to add an item to the cart
router.post('/addCart', addToCart);

// Route to get cart items for a specific user
router.get('/getCart/:userId', getCartItems);
router.delete('/deleteCartItem/:itemId',deleteCartItem);
module.exports = router;
