import React, { useEffect, useState } from 'react';
import { getUnpublishedCourses } from '../services/operations/document';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState(null); // For viewing content modal
  const [draftToPublish, setDraftToPublish] = useState(null); // For publish confirmation modal
  const { user } = useSelector((state) => state.profile);

  // Fetch unpublished courses when the component loads
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const unpublishedCourses = await getUnpublishedCourses();
        setDrafts(unpublishedCourses || []); // If no drafts, set an empty array
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        toast.error("Failed to fetch drafts.");
        setLoading(false); // Stop loading on error
      }
    };

    fetchDrafts();
  }, []);

  // Function to handle publishing a draft
  const publishCourse = async (courseId, articleTitle, authorEmail) => {
    try {
      // Make the PUT request to update the course's published status
      const response = await axios.put(
        `http://localhost:4000/api/v1/course/editPublishedCourse/${courseId}`, 
        {
          email: authorEmail,      // Send the author's email
          title: articleTitle,     // Send the article title
        }
      );

      // Check if the response was successful
      if (response.data.success) {
        toast.success("Course Published Successfully!");
        // Remove the published course from the list of drafts
        setDrafts(drafts.filter(draft => draft._id !== courseId));
      } else {
        toast.error("Failed to publish the course.");
      }
    } catch (error) {
      toast.error("Error while publishing course.");
      console.error("Error publishing course:", error);
    }
  };

  // Function to handle showing the modal with draft details
  const handleShowModal = (draft) => {
    setSelectedDraft(draft);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedDraft(null);
  };

  // Function to open the confirmation modal for publishing
  const handlePublishConfirmation = (draft) => {
    setDraftToPublish(draft); // Open the confirmation modal
  };

  // Function to close the publish confirmation modal
  const handleClosePublishModal = () => {
    setDraftToPublish(null); // Close the confirmation modal
  };

  // Function to handle publish after confirmation
  const handleConfirmPublish = () => {
    if (draftToPublish) {
      publishCourse(draftToPublish._id, draftToPublish.title, draftToPublish.email);
      handleClosePublishModal(); // Close the confirmation modal
    }
  };

  // Display a loading spinner if data is still being fetched
  if (loading) {
    return <div className="text-center text-lg">Loading drafts...</div>;
  }

  // Check if there are no drafts to show
  if (drafts.length === 0) {
    return <div className="text-center text-lg">No drafts available to publish.</div>;
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto pb-40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Draft Articles (Unpublished)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drafts.map(draft => (
            <div
              key={draft._id}
              className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105 flex flex-col justify-between h-64"
            >
              <div className="mb-4 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">{draft.title}</h3>
                <p className="text-gray-600 mb-2"><span className="font-bold">Category:</span> {draft.category}</p>
                <p className="text-gray-600 mb-4"><span className="font-bold">Author:</span> {draft.authorName}</p>
              </div>

              {/* Buttons for Publish and View Content */}
              <div className="flex justify-between">
                <button
                  onClick={() => handlePublishConfirmation(draft)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Publish
                </button>

                <button
                  onClick={() => handleShowModal(draft)} // Opens modal to view content
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  View Content
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying the draft content */}
      {selectedDraft && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedDraft.title}</h3>
            <p className="text-gray-700 mb-4">{selectedDraft.content}</p>
          </div>
        </div>
      )}

      {/* Confirmation modal for publishing */}
      {draftToPublish && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={handleClosePublishModal}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">Confirm Publish</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to publish the article titled "<strong>{draftToPublish.title}</strong>"?</p>
            
            {/* Confirmation buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmPublish}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Yes, Publish
              </button>
              <button
                onClick={handleClosePublishModal}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drafts;
