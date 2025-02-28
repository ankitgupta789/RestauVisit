import React from 'react'
import { addReview,getAllReviews,editReview,deleteReview,upvoteReview,downvoteReview,addReply } from "../../services/operations/Review";
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import { getProfile } from "../../services/operations/profile"; // Importing the function for fetching restaurant data
// import { toast } from 'react-toastify';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTurnDownRight } from "@fortawesome/free-solid-svg-icons";
import { FaReply } from 'react-icons/fa';
import Reply from './Reply';
const RestauReviews = ({userId}) => {

    
const handleMenuToggle = (reviewId) => {
    setMenuOpen(menuOpen === reviewId ? null : reviewId);
  };
  
  const { user } = useSelector((state) => state.profile);
  const [editingReview, setEditingReview] = useState(null); // Track the review being edited
  const [editedText, setEditedText] = useState(""); // Track the edited review text
  const [editedData, setEditedData] = useState({ review_text: "", rating: 0 });
 //Review Handling states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState([]); // To store the list of reviews
  const [menuOpen, setMenuOpen] = useState(null); // Track which menu is open (by review ID)
const [userProfiles, setUserProfiles] = useState({});
const [isReplying, setIsReplying] = useState(false);
const commenterId=user._id
     const fetchAllReviews = async () => {
        try {
          // Wait for getAllReviews to return the data
          const data = await getAllReviews(userId); 
    
          // Log the data to the console before setting it
        //   console.log('Fetched reviews:', data);
          const reviewsWithVotes = data.map((review) => ({
            ...review,
            upvotes: review.upvoters.length,  // Set upvotes to length of the upvoters array
            downvotes: review.downvoters.length, // Set downvotes to length of the downvoters array
        }));
          // Set the data to the reviews state
          console.log(reviewsWithVotes);
          setReviews(reviewsWithVotes);
    
        } catch (error) {
          // Handle any errors that might occur during the fetch
          console.error('Error fetching reviews:', error);
        }
      };
const fetchUserProfiles = async () => {
    const profiles = {};
    for (const review of reviews) {
      if (review.commenterId) {
        const profilePicture = await getProfile(review.commenterId);
        if (profilePicture) {
          profiles[review.commenterId] = profilePicture;
        }
      }
    }
    setUserProfiles(profiles);
    console.log(profiles,"prfile fetched are");
  };
    useEffect(() => {
        if (userId) {
          console.log("is it called");
          fetchAllReviews();
        }
      }, [userId]); 
      useEffect(() => {
          if (reviews.length > 0) {
            fetchUserProfiles();
          }
        }, [reviews]);
  const handleEdit2 = (review) => {
        setEditingReview(review._id);
        setEditedData({
          review_text: review.review_text, // Pre-fill with current text
          rating: review.rating, // Pre-fill with current rating
        });
        setMenuOpen(null); // Close the menu
      };
    
const handleCancel = () => {
    setEditingReview(null);
    setEditedData({ review_text: "", rating: 0 });
  };
  
  const handleEdit = async (reviewId) => {
    const updatedData =editedData // Example updated data
    
    const response = await editReview(user, reviewId, updatedData);
    if (response) {
      console.log("Review successfully updated:", response);
      // Optionally, refresh reviews here or update state

      setEditingReview(null);
      setEditedData({ review_text: "", rating: 0 });
      handleCancel();
      fetchAllReviews();
    }
   
    setMenuOpen(null); // Close the menu
  };
  const handleAddReview = async (e) => {
      e.preventDefault();
       const username=user.firstName+" "+user.lastName;
       
       const commenterId=user._id;
      const response = await addReview(userId,commenterId,username ,reviewText, rating); // Calls the `addReview` function
      if (response) {
        setReviews((prevReviews) => [...prevReviews, response]); // Add new review to the state
        setReviewText(""); // Reset form
        setRating("");
      }
      fetchAllReviews();
    };
    const [replyForms, setReplyForms] = useState({});
    const handleReply = async (reviewId) => {
        setReplyForms((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId] // Toggle visibility for this specific review
          }));
        
      };
      
    const handleDelete = async (reviewId) => {
        const response = await deleteReview(user, reviewId);
        if (response) {
          console.log("Review successfully deleted:", response);
          // Optionally, refresh reviews here or update state
        }
        setMenuOpen(null); // Close the menu
        fetchAllReviews();
      };
      //handling upvoting any particular review
      const handleUpvote = async (reviewId) => {
        try {
          const response = await upvoteReview(reviewId, user._id);
          if (response) {
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === reviewId
                        ? { ...review, upvotes: response.upvotes, downvotes: response.downvotes } // Update both upvotes and downvotes if needed
                        : review
                )
            );
            console.log(reviews);
        }
        } catch (error) {
          console.error("Error upvoting review:", error);
        }
      };
    // handling downvoting a particular review
    const handleDownvote = async (reviewId) => {
        try {
          const response = await downvoteReview(reviewId, user._id);
          if (response) {
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === reviewId
                        ? { ...review, upvotes: response.upvotes, downvotes: response.downvotes } // Update both upvotes and downvotes if needed
                        : review
                )

            );
            console.log(reviews);
        }
        } catch (error) {
          console.error("Error downvoting review:", error);
        }
      };
  return (

      <div  className="mt-8 px-4 sm:px-6 lg:px-8 w-full overflow-y-auto">
  <h1 className="text-3xl font-semibold mb-6 text-gray-800">Reviews</h1>

  {/* Add Review Form */}
  <div className="bg-gray-100 p-6 rounded-xl shadow-lg mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a Review</h2>
    <form
      onSubmit={handleAddReview} // Function to handle review submission
      className="space-y-6"
    >
      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
          Review:
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)} // State to handle review text
          className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="4"
          placeholder="Write your review here..."
          required
        />
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Rating:
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)} // State to handle rating
          className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="" disabled>
            Select a rating
          </option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} Star{value > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        Submit Review
      </button>
    </form>
  </div>

  {/* Reviews Content */}
  <div className="space-y-6">
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div
        key={review._id}
        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 relative"
      >
        {/* If this review is being edited */}
        {editingReview === review._id ? (
          <div>
            {/* Editable Review Form */}
            <textarea
              value={editedData.review_text}
              onChange={(e) =>
                setEditedData({ ...editedData, review_text: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <select
              value={editedData.rating}
              onChange={(e) =>
                setEditedData({ ...editedData, rating: parseInt(e.target.value) })
              }
              className="w-full mt-2 border p-2 rounded-lg"
            >
              <option value="" disabled>
                Select Rating
              </option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(review._id)} // Fixed handler
                className="px-4 py-2 bg-pure-greys-300 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-pure-greys-300 text-black rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Display the review if not editing
          <div>
            <div className="flex items-center">
              {/* Profile Image */}
              <img
                src={userProfiles[review.commenterId]!=null && userProfiles[review.commenterId].image} // Assuming `profileImageUrl` is the Cloudinary URL
                alt={`${review.username}'s profile`}
                className="h-10 w-10 rounded-full mr-3"
              />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{review.username}</span>
                
              </p>
            
            </div>
            {/* Star Rating */}
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={star <= review.rating ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`h-5 w-5 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.1 6.485a1 1 0 00.95.69h6.83c.969 0 1.372 1.24.588 1.81l-5.522 4.01a1 1 0 00-.364 1.118l2.1 6.485c.3.921-.755 1.688-1.54 1.118l-5.523-4.01a1 1 0 00-1.176 0l-5.523 4.01c-.784.57-1.838-.197-1.539-1.118l2.1-6.485a1 1 0 00-.364-1.118L2.5 11.912c-.784-.57-.38-1.81.588-1.81h6.829a1 1 0 00.95-.69l2.1-6.485z"
                  />
                </svg>
              ))}
            </div>
            <p className="mt-3 text-gray-800">{review.review_text}</p>
            <div className="flex items-center mt-2">
            <button
              className="px-3 py-1 bg-caribbeangreen-100 text-white rounded mr-2"
              onClick={() => handleUpvote(review._id)}
            >
              👍 <span className="text-pure-greys-600">{review.upvotes}</span>
            </button>
            <button
              className="px-3 py-1 bg-pink-300 text-white rounded"
              onClick={() => handleDownvote(review._id)}
            >
              👎<span className="text-pure-greys-600">{review.downvotes}</span>
            </button>
          </div>
          <div className="mt-3 flex-row items-center">
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => handleReply(review._id)} // Assuming handleReply is a function for replies
                >
                  <FaReply className="mr-2" />
                  Replies
                </button>
                {replyForms[review._id] && (
                <Reply reviewId={review._id} userId={commenterId}/>)
                    }  
              </div>

          </div>
        )}

        {/* Three-dot menu */}
        {user._id == review.commenterId && 
        <div className="absolute top-4 right-4">
          <button
            onClick={() => handleMenuToggle(review._id)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            &#x22EE; {/* Unicode for vertical ellipsis */}
          </button>

          {/* Dropdown menu */}
          {menuOpen === review._id && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleEdit2(review)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      } 
      </div>
    ))
  ) : (
    <p className="text-gray-500">No reviews yet. Be the first to add one!</p>
  )}
</div>


      </div>
  )
}

export default RestauReviews
