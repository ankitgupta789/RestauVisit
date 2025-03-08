const Comment = require('../models/Comments'); // Assuming the Comment schema is stored in this path

exports.createComment = async (req, res) => {
    try {
      // Log request body for debugging
      console.log('Request body:', req.body);
  
      const { articleId, comment, commenterId, commenterName } = req.body;
  
      const newComment = new Comment({
        articleId,
        comment,
        commenterId,
        commenterName,
      });
  
      const savedComment = await newComment.save();
      console.log('Comment saved:', savedComment);
  
      res.status(201).json({
        success: true,
        message: 'Comment added successfully!',
        data: savedComment,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding comment',
        error: error.message,
      });
    }
  };
  

// Controller to get all comments for a specific article
exports.getCommentsByArticleId = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Find comments by articleId
    const comments = await Comment.find({ articleId }).sort({ createdAt: -1 }); // Sort by latest

    res.status(200).json({
      success: true,
      message: `Comments for article ${articleId} fetched successfully`,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
};

// Controller to delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find and delete the comment by ID
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message,
    });
  }
};
