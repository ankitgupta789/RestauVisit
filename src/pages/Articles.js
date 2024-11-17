import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // To access Redux state
import { useNavigate } from 'react-router-dom'; // For navigation
import backgroundarticles from '../assets/backgroundarticles.png'; // Adjust the path if needed
import Article1 from './Article1';

const Articles = () => {
  // State to store the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Get user info from Redux
  const { user } = useSelector((state) => state.profile);

  
  

  // Function to handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundarticles})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {!selectedCategory ? (
        <div className="text-center px-20 py-0 bg-black bg-opacity-60 rounded-lg max-w-3xl mx-auto mb-20">
          {/* Title */}
          <h1 className="text-5xl font-extrabold -mt-10 mb-40 text-white shadow-lg tracking-wide">
            Choose a Category
          </h1>
          {/* Category List */}
          <ul className="space-y-6 text-lg font-medium">
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Explore Universe')}
            >
              Explore Universe
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Astronomy')}
            >
              Astronomy
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Astrophysics')}
            >
              Astrophysics
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Rocket Science')}
            >
              Rocket Science
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Planetary Science')}
            >
              Planetary Science
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300"
              onClick={() => handleCategoryClick('Space Missions')}
            >
              Space Missions
            </li>
            <li
              className="hover:scale-105 transition transform text-3xl hover:text-blue-300 pb-10"
              onClick={() => handleCategoryClick('Cosmology')}
            >
              Cosmology
            </li>
          </ul>
        </div>
      ) : (
        // Conditionally render the Article1 component with the selected category if user exists
        <Article1 category={selectedCategory} />
      )}
    </div>
  );
};

export default Articles;
