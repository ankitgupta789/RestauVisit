const express = require('express');
const router = express.Router();
const commentController = require('../controllers/Comments');

// Route to create a comment
router.post('/comments', commentController.createComment);

// Route to get all comments for a specific article
router.get('/comments/:articleId', commentController.getCommentsByArticleId);

// Route to delete a comment
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;
