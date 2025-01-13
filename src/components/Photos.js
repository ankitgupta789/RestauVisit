import React, { useState, useEffect } from "react";
import { getAllImages, addImage, deleteImage } from '../services/operations/photos'; // Assuming deleteImage is also imported here
import { useSelector } from "react-redux";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State to hold the selected photo for zooming
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to control delete confirmation modal
  const [photoToDelete, setPhotoToDelete] = useState(null); // Store the photo to delete
  const { user } = useSelector((state) => state.profile);
 
  const userId=user._id;
  // Fetch all photos on component mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await getAllImages(userId); // Fetch photos using the getAllImages function
        setPhotos(fetchedPhotos); // Set the photos state with the fetched data
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, [userId]); 

  // Upload photo to Cloudinary and save URL in the database
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingImage(true); // Set loading state while uploading
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        // Upload image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvlvjwx5t/image/upload", 
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        if (data.secure_url) {
          // Call the existing function to save the image URL in the database
          await addImage(userId, data.secure_url); // Add the image URL to your database

          // Update the local state with the new image URL
          setPhotos([...photos, data.secure_url]);
        }
      } catch (err) {
        console.error("Error uploading image:", err.message);
      } finally {
        setLoadingImage(false); // Reset loading state
      }
    }
  };

  // Function to handle photo click for zooming
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo); // Set the selected photo to open in the modal
  };

  // Function to close the zoom modal
  const closeModal = () => {
    setSelectedPhoto(null); // Reset selected photo to close the modal
  };

  // Function to show the delete confirmation modal
  const openDeleteModal = (photo) => {
    setIsDeleteModalOpen(true); // Open the confirmation modal
    setPhotoToDelete(photo); // Set the photo to delete
  };

  // Function to handle delete photo
  const handleDelete = async () => {
    try {
      await deleteImage(userId, photoToDelete); // Call the function to delete the image URL from the database
      setPhotos(photos.filter((p) => p !== photoToDelete)); // Remove the photo from the local state
      setIsDeleteModalOpen(false); // Close the confirmation modal after successful delete
    } catch (err) {
      console.error("Error deleting photo:", err.message);
    }
  };

  // Function to cancel the delete operation
  const cancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the confirmation modal without deleting
    setPhotoToDelete(null); // Reset the photo to delete
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Photos</h1>

      {/* Upload Section */}
      <div className="flex items-center mb-6">
        <input
          type="file"
          accept="image/*"
          className="file-input border border-gray-300 rounded-md px-4 py-2 mr-4"
          onChange={handleImageUpload}
          disabled={loadingImage} // Disable while uploading
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loadingImage} // Disable while uploading
        >
          {loadingImage ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Display Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <p>No photos available.</p>
        ) : (
          photos.map((photo, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg shadow-md bg-white relative"
            >
              <img
                src={photo}
                alt="Uploaded"
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => handlePhotoClick(photo)} // Open the selected photo in modal
              />
              {/* Delete Button */}
              <button
                onClick={(e) => { e.stopPropagation(); openDeleteModal(photo); }} // Open delete confirmation modal
                className="absolute top-2 right-2 bg-blue-50 text-white rounded-full p-3 hover:bg-red-600 focus:outline-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-icons text-xl">delete</span> {/* Optional: Use material icons or any other icon */}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for Zoomed Photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <img
            src={selectedPhoto}
            alt="Zoomed"
            className="max-w-3xl max-h-[90%] object-contain"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this photo?</h2>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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

export default Photos;
