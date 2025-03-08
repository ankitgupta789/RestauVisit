const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user
    ref: "User", // The name of the model being referenced
    required: true,
  },
  url: {
    type: String, // URL of the image
    required: true,
    trim: true, // Ensure no extra spaces
  },
});

module.exports = mongoose.model("Photos", photoSchema);
