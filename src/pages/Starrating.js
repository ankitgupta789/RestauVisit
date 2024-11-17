import React from 'react';

const StarRating = ({ rating }) => {
  // Create an array of stars
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <Star
          key={star}
          filled={star <= rating} // Use the actual rating to determine if the star is filled
        />
      ))}
      <span className="ml-2 text-gray-600">{rating} / 5</span> {/* Display the rating */}
    </div>
  );
};

const Star = ({ filled }) => (
  <svg
    className={`w-6 h-6 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill="currentColor"
    />
  </svg>
);

export default StarRating;
