const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/RestauNotification');

// POST - Create new notification
router.post('/createNotification', notificationController.createNotification);

// GET - Fetch notifications for a specific restaurant
router.get('/getNotifications/:restaurantEmail', notificationController.getNotifications);

// PUT - Mark notification as read
router.put('/markAsRead/:id', notificationController.markAsRead);

module.exports = router;
