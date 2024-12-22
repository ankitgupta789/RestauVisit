import axios from "axios";

// Function to get all images for a user by email
export const getAllImages = async (email) => {
  try {
    // Call the API to get the images based on email
    console.log(email, "email sent ");
    const response = await axios.get(`${"http://localhost:4000/api/v1/photos/getphotos"}/${email}`);
    
    // Check if photos exist
    if (response.data && response.data.length > 0) {
      console.log("Photos retrieved:", response.data);
      return response.data; // The list of image URLs
    } else {
      console.log("No photos found for this user.");
      return []; // Return an empty array if no photos are found
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to add a new image for a user by email
export const addImage = async (email, imageUrl) => {
  try {
    console.log(email, imageUrl, "console for checking if data received during posting image");

    const response = await axios.post(`${"http://localhost:4000/api/v1/photos/addphotos"}`, { email, url: imageUrl });

    // Check if the image was added successfully
    if (response.status === 201) {
      console.log("Image added:", response.data.photos);
      return response.data.photos; // Return the updated list of images
    }
  } catch (error) {
    console.error("Error adding image:", error);
    return null; // Return null if there's an error
  }
};

// Function to delete an image for a user by email
export const deleteImage = async (email, imageUrl) => {
  try {
    const response = await axios.delete(`${"http://localhost:4000/api/v1/photos/deletephotos"}`, { data: { email, url: imageUrl } });

    // Check if the image was deleted successfully
    if (response.status === 200) {
      console.log("Image deleted:", response.data);
      return response.data; // Return success message or updated photos list
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return null; // Return null if there's an error
  }
};
