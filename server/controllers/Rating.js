// const Rating = require('../models/Rating'); // Assuming the Rating model is in the models folder
// const mongoose = require('mongoose');
// // Controller to create or update a rating
// exports.createRating = async (req, res) => {
//     try {
//       const { userId, articleId, rating } = req.body;
//     const user_id=userId;
//     const article_id=articleId;
//       // Validate rating value (1-5)
//       if (rating < 1 || rating > 5) {
//         return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//       }
  
//       console.log("Is article_id actually received:", req.body);
  
//       // Delete existing rating for the user and article
//       await Rating.findOneAndDelete({ user_id, article_id });
  
//       // Create a new rating
//       const newRating = new Rating({
//         user_id,
//         article_id,
//         rating,
//         created_at: Date.now(), // Set created_at to the current time
//         updated_at: Date.now(), // Set updated_at to the current time
//       });
  
//       const savedRating = await newRating.save();
  
//       return res.status(200).json({
//         message: 'Rating created successfully',
//         rating: savedRating,
//       });
  
//     } catch (error) {
//       console.error('Error creating rating:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  

// // Controller to get the average rating and total ratings for an article
// exports.getRatings = async (req, res) => {
//     try {
//         const articleId = req.params.article_id;
      
//       // Debug log
//       console.log("article id is", req.params); // Check if articleId is present
  
//       // Find all ratings for the specified article
//       const ratings = await Rating.find({ article_id: articleId });
  
//     //   if (ratings.length === 0) {
//     //     return res.status(404).json({
//     //       success: false,
//     //       message: `No ratings found for article ${articleId}`,
//     //     });
//     //   }
  
//       // Calculate average rating and total ratings
//       const totalRatings = ratings.length;
//       const averageRating =
//         ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings;
//   console.log("total rating is ",totalRatings)
//       res.status(200).json({
//         success: true,
//         message: `Ratings for article ${articleId} fetched successfully`,
//         data: {
//           articleId,
//           averageRating: averageRating.toFixed(2), // Round to 2 decimal places
//           totalRatings,
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error fetching ratings',
//         error: error.message,
//       });
//     }
//   };