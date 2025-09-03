import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { addnote } from '../services/operations/note2';
import { useSelector } from 'react-redux';
import { addquery } from '../services/operations/query';
import { useNavigate } from 'react-router-dom';
import StarRating from './Starrating'; // Import your StarRating component


const BASE_URL = process.env.REACT_APP_BASE_URL;

const Article1 = ({ category }) => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const commentPanelRef = useRef(null); // Create a ref for the comment panel

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user does not exist
      navigate('/login');
    }
  }, [user, navigate]);

  // State to store articles fetched from the backend
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // New states for notes, query, and comments
  const [notes, setNotes] = useState('');
  const [query, setQuery] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // State for controlling comment panel visibility
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);

  // Filter states
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [ratings, setRatings] = useState({});
  const [userRating, setUserRating] = useState(0); // New state for user's rating
  const [isRatingPanelOpen, setIsRatingPanelOpen] = useState(false); // New state for rating panel
  const email = user?.email;

  const handleSaveNote = (documentName) => {
    if (notes.trim() !== '') {
      addnote(notes, email, documentName); // Call the function only if there's a valid note
      setNotes(''); // Clear notes after save
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetching articles based on category
        const articlesResponse = await axios.get(`${BASE_URL}/api/course/findbycategory?category=${category}`);
        if (articlesResponse.data.success) {
          setArticles(articlesResponse.data.data);
          setFilteredArticles(articlesResponse.data.data);

          // After fetching articles, fetch ratings for each article
          await fetchRatingsForArticles(articlesResponse.data.data);
        } else {
          setError(articlesResponse.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch ratings for all articles
    const fetchRatingsForArticles = async (articles) => {
      try {
        const ratingsData = {};

        // Loop through each article and fetch its rating
        for (const article of articles) {
          const ratingsResponse = await axios.get(`${BASE_URL}/api/v1/rating/getRatings/${article._id}`);

          if (ratingsResponse.data.success) {
            // Store the rating data using the article's ID as the key
            ratingsData[article._id] = {
              averageRating: ratingsResponse.data.data.averageRating,
              totalRatings: ratingsResponse.data.data.totalRatings,
            };
          } else {
            // In case of no ratings, set default values
            ratingsData[article._id] = {
              averageRating: 'N/A',
              totalRatings: 0,
            };
          }
        }

        // Update the state with the fetched ratings
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchArticles(); // Call the function to fetch articles and ratings
  }, [category]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    fetchComments(article._id); // Fetch comments when the article is clicked
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Function to fetch comments for a specific article
  const fetchComments = async (articleId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/comment/comments/${articleId}`);
      setComments(response.data.data); // Assuming API returns comments array under `data`
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Toggle the comment panel and fetch comments if not already fetched
  const toggleCommentPanel = () => {
    if (!isCommentPanelOpen) {
      fetchComments(selectedArticle._id);
    }
    setIsCommentPanelOpen(!isCommentPanelOpen);
  };

  // Toggle the rating panel
  const toggleRatingPanel = () => {
    setIsRatingPanelOpen(!isRatingPanelOpen);
  };

  const closeCommentPanel = () => {
    setIsCommentPanelOpen(false);
  };

  const handleAddComment = async () => {
    try {
      const fullName = `${user?.firstName || 'First'} ${user?.lastName || 'Last'}`;
      const response = await axios.post(`${BASE_URL}/api/v1/comment/comments`, {
        articleId: selectedArticle._id,
        comment: newComment,
        commenterId: user._id,
        commenterName: fullName,
      });
  
      setComments([...comments, response.data.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleRatingSubmit = async () => {
    try {
      // Step 1: Submit the new rating
      const response = await axios.post(`${BASE_URL}/api/v1/rating/createRating`, {
        articleId: selectedArticle._id,
        rating: userRating,
        userId: user._id,
      });
  
      // Step 2: Fetch the updated rating after submission
      const updatedRatingsResponse = await axios.get(`${BASE_URL}/api/v1/rating/getRatings/${selectedArticle._id}`);
  
      // Check if the response was successful
      if (updatedRatingsResponse.data.success) {
        const updatedRating = updatedRatingsResponse.data.data.averageRating;
        const updatedTotalRatings = updatedRatingsResponse.data.data.totalRatings;
  
        // Step 3: Update the state with the new rating and total ratings
        setRatings((prevRatings) => ({
          ...prevRatings,
          [selectedArticle._id]: { averageRating: updatedRating, totalRatings: updatedTotalRatings },
        }));
        console.log("updated rating here is ",updatedRating);
        setIsRatingPanelOpen(false); // Close the rating panel after submission
      } else {
        console.error('Error fetching updated ratings:', updatedRatingsResponse.data.message);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
  
  const handlequerySubmit = (documentName, email) => {
    const userEmail = user?.email;
    addquery({ query, userEmail, documentName, email });
    setQuery('');
  };

  // Close the comment panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentPanelRef.current && !commentPanelRef.current.contains(event.target) && isCommentPanelOpen) {
        closeCommentPanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCommentPanelOpen]);

  if (loading) {
    return <div>Loading articles for {category}...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (selectedArticle) {
    const rating = ratings[selectedArticle._id]?.averageRating || 0;
    return (
      <div className="relative p-10 pb-40 mx-auto max-h-screen overflow-y-auto">
        <div className="relative flex items-center">
          {/* New Give Rating Button */}
          <button
            className="w-[250px] h-[60px] fixed right-80 top-24 mt-1 p-4 bg-yellow-400 text-white rounded-lg text-lg hover:bg-yellow-700 shadow-lg z-10"
            onClick={toggleRatingPanel}
          >
            Give Rating
          </button>
          
          {isCommentPanelOpen ? null : (
            <button
              className="w-[250px] h-[60px] fixed right-10 top-24 mt-1 p-4 bg-blue-400 text-white rounded-lg text-lg hover:bg-green-700 shadow-lg z-10"
              onClick={toggleCommentPanel}
            >
              People's Reactions
            </button>
          )}

          <button
            onClick={handleBackToList}
            className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Back to articles
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-8 flex justify-between items-center">
          <span>{selectedArticle.title}</span>
          <StarRating rating={rating} /> {/* Display the star rating here */}
        </h2>

        <div className="max-h-[60vh] overflow-y-auto border border-gray-300 p-4 rounded bg-pure-greys-100">
          <p className="text-lg">{selectedArticle.content}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold">Add Notes:</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full h-24 p-2 border rounded text-black"
          />
          <button
            onClick={() => handleSaveNote(selectedArticle.title)}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-green-700"
          >
            Submit Notes
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-bold">Send a Query:</h3>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query here..."
            className="w-full p-2 border rounded text-black"
          />
          <button
            onClick={() => handlequerySubmit(selectedArticle.title, selectedArticle.email)}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Send Query
          </button>
        </div>
        {isRatingPanelOpen && (
  <div className="fixed top-1/4 left-1/4 bg-white shadow-lg p-6 rounded z-20" style={{ width: '300px', height: '200px' }}>
    <h3 className="text-2xl font-bold mb-4 text-black">Rate this Article</h3>

    {/* Render star icons or numbers to test visibility */}
    <div className="flex justify-center mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${userRating >= star ? 'text-yellow-500' : 'text-pure-greys-100'}`}
          onClick={() => setUserRating(star)}
        >
          ★
        </span>
      ))}
    </div>

    <button
      onClick={handleRatingSubmit}
      className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-green-700"
    >
      Submit Rating
    </button>
  </div>
)}

        {/* Comment Slider */}
        <div
          ref={commentPanelRef}
          className={`fixed top-12 right-0 w-1/3 h-full bg-gray-100 shadow-lg p-6 transition-transform duration-300 ${
            isCommentPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Comments</h3>
          <div className="mb-4 max-h-[60vh] overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 border rounded bg-white text-black">
                  {comment.comment}
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                    <p className="text-black">- {comment.commenterName}</p>
                    <p>{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full h-24 p-2 border rounded mb-2 text-black"
          />
          <button
            onClick={handleAddComment}
            className="p-2 bg-blue-500 text-white rounded hover:bg-green-700"
          >
            Submit Comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 w-full max-w-none mx-auto max-h-7xl pb-20">
      <h2 className="text-4xl font-bold mb-8">Articles for {category}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <div
              key={index}
              className="border p-4 rounded hover:bg-gray-100 cursor-pointer bg-pure-greys-100"
              onClick={() => handleArticleClick(article)}
            >
              <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <p className="text-sm text-gray-500">Author: {article.authorName}</p>
              <p className="text-sm text-gray-500">Published: {new Date(article.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No articles available.</p>
        )}
      </div>
    </div>
  );
};

export default Article1;
