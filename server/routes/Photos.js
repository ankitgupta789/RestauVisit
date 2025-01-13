const express = require('express');
const router = express.Router();
const { getAllImages, addImage, deleteImage } = require('../controllers/Photos');

// Route for getting all images of a specific user
// Method: GET, URL: /photos/:email
// Params: email (from the URL)
router.get('/getphotos/:userId', getAllImages);

// Route for adding a new image for a specific user
// Method: POST, URL: /photos
// Body: { email, url } (email in the body and image URL)
router.post('/addphotos', addImage);

// Route for deleting a specific image for a user
// Method: DELETE, URL: /photos
// Body: { email, url } (email and image URL to be deleted)
router.delete('/deletephotos', deleteImage);

module.exports = router;
