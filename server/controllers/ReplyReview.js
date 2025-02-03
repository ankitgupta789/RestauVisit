
const Review = require('../models/Review');
// const User = require('../models/User');
const Reply=require('../models/ReplyReview');

const addReplyToReview = async (req, res) => {
    try {
        const { reviewId } = req.params; // Review ID from URL params
        const { userId, text,username } = req.body; // User ID and reply text
        console.log(userId,text,username,reviewId,"printign data in backend")
        if (!userId || !text) {
            return res.status(400).json({ message: "User ID and reply text are required" });
        }

        // Check if the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        console.log("recieved info ??",userId, text,username,reviewId)
        // Create a new reply
        const newReply = new Reply({
            reviewId,
            userId,
            username,
            text,
        });

        // Save the reply
        await newReply.save();

        // Return the newly added reply and the updated list of replies
        const replies = await Reply.find({ reviewId });
        res.status(200).json({ message: "Reply added successfully", replies });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
// Get all replies for a specific review
const getRepliesByReviewId = async (req, res) => {
  try {
    const { reviewId } = req.params; // Get reviewId from URL params

    if (!reviewId) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const replies = await Reply.find({ reviewId }).sort({ createdAt: -1 }); // Fetch replies for the given review

    res.status(200).json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    addReplyToReview,getRepliesByReviewId
};
