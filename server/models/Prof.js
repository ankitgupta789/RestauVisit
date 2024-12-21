const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  image: { // New field for storing the profile image URL
    type: String,
    default: "", // Set a default value or leave it empty if no image is provided
  },
});

// Export the Profile model
module.exports = mongoose.model("Prof", profileSchema);
