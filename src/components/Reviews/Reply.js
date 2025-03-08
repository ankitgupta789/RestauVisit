import React, { useState, useEffect } from 'react';
import { addReply, getReplies } from '../../services/operations/Review';
import { getProfile } from '../../services/operations/profile'; // Import function to fetch user profile
import { useSelector } from 'react-redux';

const Reply = ({ userId, reviewId }) => {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]); // Store fetched replies
  const [userProfiles, setUserProfiles] = useState({}); // Store user profiles
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    // Fetch all replies when component mounts
    const fetchReplies = async () => {
      const data = await getReplies(reviewId);
      setReplies(data || []);

      // Fetch user profiles for each reply
      const profiles = {};
      for (const reply of data) {
        if (!profiles[reply.userId]) {
          const userProfile = await getProfile(reply.userId);
          profiles[reply.userId] = userProfile?.image || null;
        }
      }
      console.log(profiles,"userProfiles");
      setUserProfiles(profiles);
    };

    fetchReplies();
  }, [reviewId]);

  const handleReplySubmit = async () => {
    if (replyText.trim() === '') return; // Prevent empty replies

    const username = user.firstName + " " + user.lastName;
    await addReply(userId, reviewId, replyText, username);

    // Fetch updated replies after adding a new one
    const updatedReplies = await getReplies(reviewId);
    setReplies(updatedReplies || []);

    // Fetch profiles again for new replies
    const profiles = { ...userProfiles };
    for (const reply of updatedReplies) {
      if (!profiles[reply.userId]) {
        const userProfile = await getProfile(reply.userId);
        profiles[reply.userId] = userProfile?.image || null;
      }
    }
    setUserProfiles(profiles);

    setReplyText(''); // Clear input after submission
  };

  return (
    <div className="mt-2 p-2 border rounded-lg bg-gray-100">
      <div className="mb-2">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply._id} className="flex items-center space-x-2 p-2 border-b">
              {userProfiles[reply.userId] ? (
                <img
                  src={userProfiles[reply.userId]}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300" />
              )}
              <div>
              <small>{reply.username}</small>
                <p>{reply.text}</p>
                
              </div>
            </div>
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </div>
      
      <textarea
        className="w-full p-2 border rounded-md"
        rows="2"
        placeholder="Write your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleReplySubmit}
      >
        Reply
      </button>
    </div>
  );
};

export default Reply;
