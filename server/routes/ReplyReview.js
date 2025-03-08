// Add Reply to Review Route
const express = require('express');
const router = express.Router();
const { addReplyToReview,getRepliesByReviewId } = require('../controllers/ReplyReview'); // Assuming the controller is in a separate file

// POST request to add a reply to a review
router.post('/addReply/:reviewId', addReplyToReview);

router.get('/getReplies/:reviewId', getRepliesByReviewId);

module.exports = router;
