const express = require('express');
const router = express.Router();
const { getReviews } = require('../../controllers/Restaurating');

// Route to get all restaurants
router.get('/reviews',getReviews );

// Route to get a specific restaurant by ID
// router.get('/restaurants/:id', getRestaurantById);

module.exports = router;
