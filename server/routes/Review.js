const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review');

// Fetch all menu items related to a restaurant by email
router.get('/getAllReviews/:userId', ReviewController.getAllReviews);

// Add a new menu item
router.post('/addReview', ReviewController.addReview);

// Edit a menu item by ID
router.put('/editReview/:id', ReviewController.editReview);

// Delete a menu item by ID
router.delete('/deleteReview/:id', ReviewController.deleteReview);
//upvoting and downvoting
router.put("/upvote/:reviewId",  ReviewController.upvoteReview);
router.put("/downvote/:reviewId", ReviewController.downvoteReview);
module.exports = router;
