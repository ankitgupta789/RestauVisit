const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  email: {
    type: String, // Store the email of the user
    required: true,
  },
  url: {
    type: String, // URL of the image
    required: true,
  },
});

module.exports = mongoose.model('Photos', photoSchema);
