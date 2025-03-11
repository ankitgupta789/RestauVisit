// const Restaurant = require("../models/Review");

// Get all restaurants with ratings
const Review = require("../models/Review");

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")         // Populate the reviewed user's details
      .populate("commenterId", "name email")      // Populate the reviewer's details
      .populate("upvoters", "name")               // Optionally populate upvoters
      .populate("downvoters", "name")             // Optionally populate downvoters
      .populate("replies")                        // Populate reply reviews if needed
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};


// // Get a specific restaurant by ID with ratings
// exports.getRestaurantById = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.id)
//       .populate("owner", "name email")
//       .populate("seating_plan.sections")
//       .exec();

//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     res.status(200).json(restaurant);
//   } catch (error) {
//     console.error("Error fetching restaurant:", error);
//     res.status(500).json({ message: "Error fetching restaurant", error });
//   }
// };
