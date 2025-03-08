const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  name:{
    type:String,
  },
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
  city: { // New field for city
    type: String,
    trim: true, // Ensure no extra spaces
  },
  state: { // New field for state
    type: String,
    trim: true, // Ensure no extra spaces
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User", // Specify the name of the referenced model
    required: true, // Ensure this field is mandatory
  },
  upiId: { // New field for state
    type: String,
    trim: true, // Ensure no extra spaces
  }

});

// Export the Profile model
module.exports = mongoose.model("Prof", profileSchema);
