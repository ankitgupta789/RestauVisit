const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/RestauNotification');

// POST - Create new notification
router.post('/createNotification', notificationController.createNotification);

// GET - Fetch notifications for a specific restaurant
router.get('/getNotifications/:restaurantEmail', notificationController.getNotifications);
router.get('/getRecentNotifications/:restaurantEmail', notificationController.getRecentNotifications);
// PUT - Mark notification as read
router.put('/markAsRead/:id', notificationController.markAsRead);
router.get("/notificationsstats/:restaurantEmail", notificationController.getNotificationsStats);
router.get("/graph/:restaurantEmail", notificationController.getGraphData);
module.exports = router;
