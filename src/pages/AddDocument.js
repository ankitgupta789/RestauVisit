import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDocument } from '../services/operations/document';

const AddArticle = () => {
  const { user } = useSelector((state) => state.profile);
  const email = user.email;
  const authorName = `${user.firstName} ${user.lastName}`; // Combine first name and last name

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    articleSummary: '',
    difficultyLevel: '',
    enableComments: false,
  });

  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, category, content, articleSummary, difficultyLevel, enableComments } = formData;

    addDocument({
      title,
      category,
      authorName, 
      content,
      articleSummary,
      difficultyLevel,
      enableComments,
      email,
    });

    // Reset the form after submission
    setFormData({
      title: '',
      category: '',
      content: '',
      articleSummary: '',
      difficultyLevel: '',
      enableComments: false,
    });
  };

  const handleContentClick = () => {
    setModalOpen(true); // Open modal on content field click
  };

  const handleModalClose = () => {
    setModalOpen(false); // Close modal
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false); // Close modal after submitting
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full  bg-white p-8 rounded-lg shadow-md h-screen overflow-y-auto ">
        <h2 className="text-4xl text-center text-yellow-500 mb-4">Add Article</h2>
        <form onSubmit={handleSubmit}>
          {/* Title and Category side by side */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Title Field */}
            <div className="flex-1">
              <label htmlFor="title" className="block mb-2 text-yellow-500">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Category Field */}
            <div className="flex-1">
              <label htmlFor="category" className="block mb-2 text-yellow-500">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Explore Universe">Explore Universe</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Astrophysics">Astrophysics</option>
                <option value="Rocket Science">Rocket Science</option>
                <option value="Planetary Science">Planetary Science</option>
                <option value="Space Missions">Space Missions</option>
                <option value="Cosmology">Cosmology</option>
              </select>
            </div>
          </div>

          {/* Difficulty Level Field */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Difficulty Level */}
            <div className="flex-1">
              <label htmlFor="difficultyLevel" className="block mb-2 text-yellow-500">Difficulty Level</label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="" disabled>Select Difficulty Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Content Field with Click Event */}
          <div className="mb-6" onClick={handleContentClick}>
            <label htmlFor="content" className="block mb-2 text-yellow-500 cursor-pointer">Content</label>
            <div className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 flex items-center">
              <span className="text-gray-500">{formData.content ? formData.content : 'Click here to enter content...'}</span>
            </div>
          </div>

          {/* Article Summary Field */}
          <div className="mb-6">
            <label htmlFor="articleSummary" className="block mb-2 text-yellow-500">Article Summary</label>
            <textarea
              id="articleSummary"
              name="articleSummary"
              value={formData.articleSummary}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Enable Comments Checkbox */}
          <div className="mb-6">
            <label htmlFor="enableComments" className="flex items-center">
              <input
                type="checkbox"
                id="enableComments"
                name="enableComments"
                checked={formData.enableComments}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-yellow-500">Enable Comments</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md text-lg">Submit</button>
        </form>

        {/* Modal for Content Input */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-5xl w-full h-200">
              <h2 className="text-xl text-yellow-500 mb-4">Enter Article Content</h2>
              <textarea
                id="contentModal"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-72 resize-none"
                rows="10"
                required
              ></textarea>
              <div className="flex justify-end mt-4">
                <button onClick={handleModalClose} className="bg-gray-300 text-black py-2 px-4 rounded mr-2">Cancel</button>
                <button onClick={handleModalSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddArticle;
