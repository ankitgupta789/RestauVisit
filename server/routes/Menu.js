const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/Menu');

// Fetch all menu items related to a restaurant by email
router.get('/getAllItems/:userId', menuItemController.getAllItems);

// Add a new menu item
router.post('/addItem', menuItemController.addItem);

// Edit a menu item by ID
router.put('/editItem/:id', menuItemController.editItem);

// Delete a menu item by ID
router.delete('/deleteItem/:id', menuItemController.deleteItem);
router.get("/search/:email", menuItemController.searchMenuItem);
router.get("/getItemsByIds",menuItemController.getMenuItemsById);
module.exports = router;
