const Review = require('../models/Review');
const User = require('../models/User');

// Add a new menu item
const getAllReviews = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming the email is sent in the request body
    // console.log("user iis",userId)
      if (!userId) {
        return res.status(400).json({ message: "userId is required to fetch reviews" });
      }
      console.log("hello");
      // Fetch all menu items related to the provided email
      const menuItems = await Review.find({ userId: userId });
  
      if (menuItems.length === 0) {
        return res.status(404).json({ message: "No review items found for this restaurant" });
      }
  
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching menu items", error });
    }
  };
  
  const addReview = async (req, res) => {
    try {
      const { userId, commenterId, username, review_text, rating } = req.body;
     
      // Validate required fields
      if (!userId || !commenterId || !username || !review_text || !rating) {
        return res.status(400).json({ message: "All fields are required" });
      }
     
      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      
      // Verify if the user exists (Optional, depends on your implementation)
      const existingUser = await User.findOne({ _id: commenterId }); // Replace `User` with your user model
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create a new review
      const newReview = new Review({
        userId,
        commenterId,
        username,
        review_text,
        rating,
        created_at: new Date()
      });
     
      // Save the review to the database
      await newReview.save();
      console.log(userId,"is userId sent to the backend");
      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      res.status(500).json({ message: "Error adding review", error });
    }
  };
  
// Edit a menu item by ID using findOneAndUpdate
const editReview = async (req, res) => {
    try {
      const { id } = req.params; // Review ID from the URL
      const { review_text, rating, user } = req.body;
  
      console.log(review_text, rating,id, "values sent");
  
      // Find the review by ID
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Verify the user ID from the user object sent in the request
      const existingUser = await User.findById(user._id); // Find user by ID
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure the user is the owner of the review
      if (existingUser._id.toString() !== user._id || existingUser.email !== review.user_email) {
        return res.status(403).json({ message: "You are not authorized to edit this review" });
      }
  
      // Validate the rating
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
  
      // Update the review
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
          $set: {
            review_text,
            rating,
            updated_at: new Date() // Optional: Track when the review was updated
          }
        },
        { new: true } // Return the updated document
      );
  
      console.log(updatedReview, "updated review");
      res.status(200).json({ message: "Review updated successfully", updatedReview });
    } catch (error) {
      res.status(500).json({ message: "Error updating review", error });
    }
  };
  

// Delete a menu item by ID
const deleteReview = async (req, res) => {
    try {
      const { id } = req.params; // Review ID from the URL
  
      // Find the review by ID
      console.log(`Deleting review with ID: ${id}`);
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Verify the user ID from the user object sent in the request
      const { user } = req.body;
      const existingUser = await User.findById(user._id); // Find user by ID
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure the user is the owner of the review
      if (existingUser._id.toString() !== user._id) {
        return res.status(403).json({ message: "You are not authorized to delete this review" });
      }
  
      // Delete the review using deleteOne
      await Review.deleteOne({ _id: id });
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting review", error });
    }
  };
  
  
module.exports = {
    getAllReviews,
  addReview,
  editReview,
  deleteReview
};
