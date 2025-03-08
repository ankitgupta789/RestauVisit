const Photos = require('../models/Photos');

// Controller for getting all images for a user by email
const getAllImages = async (req, res) => {
  try {
    const { userId } = req.params; // Get the email from URL params
    console.log(userId, "sent userId from the frontend");

    // Find all photos for the user by matching email
    const photos = await Photos.find({ userId });

    if (!photos || photos.length === 0) {
      return res.status(200).json({ message: "No photos found for this user." });
    }

    // Extracting the URLs from all the photo documents
    const imageUrls = photos.map(photo => photo.url);

    res.status(200).json(imageUrls); // Return an array of URLs
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

// Controller for adding a new image for a user (creating a new record each time)
const addImage = async (req, res) => {
  try {
    const { userId, url } = req.body; // email and URL passed from frontend

    if (!userId || !url) {
      return res.status(400).json({ message: "Email and Image URL are required." });
    }

    // Create a new photo document for the user
    const newPhoto = new Photos({
      userId, // Use email instead of userId
      url, // Store the image URL in the new document
    });

    await newPhoto.save(); // Save the new document to the database
    res.status(201).json({ message: "Image added successfully.", photo: newPhoto });
  } catch (error) {
    res.status(500).json({ message: "Error adding image", error });
  }
};

// Controller for deleting a specific image for a user by email
const deleteImage = async (req, res) => {
  try {
    const { userId, url } = req.body; // userId and URL to delete passed from frontend

    if (!userId || !url) {
      return res.status(400).json({ message: "userId and Image URL are required." });
    }

    // Find the photo record for the given userId and URL
    const photo = await Photos.findOne({ userId, url });

    if (!photo) {
      return res.status(404).json({ message: "Image URL not found for this user." });
    }

    // console.log(photo); // Debugging log to ensure it's the correct photo document

    // Use deleteOne to delete the photo document
    const result = await Photos.deleteOne({ _id: photo._id });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "Image deleted successfully." });
    } else {
      return res.status(500).json({ message: "Error deleting image." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};

module.exports = {
  getAllImages,
  addImage,
  deleteImage,
};
