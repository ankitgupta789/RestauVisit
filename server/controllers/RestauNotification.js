const Notification = require('../models/RestauNotification'); // Import the Notification model
const Order =require("../models/Order")
const mongoose = require("mongoose");
// POST - Create a new notification
exports.createNotification = async (req, res) => {
  const { restaurantEmail, message, orderId } = req.body;

  try {
    // Create new notification
    const newNotification = new Notification({
      restaurantEmail,
      message,
      orderId
    });

    // Save the notification to the database
    const savedNotification = await newNotification.save();

    // Return the saved notification
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Controller for fetching notifications
exports.getNotifications = async (req, res) => {
  const { restaurantEmail } = req.params; // Get restaurantEmail from URL params
  const { readFlag } = req.query; // Extract readFlag from query parameters

  try {
    // Define a filter based on readFlag or default to isRead: false
    const filter = { restaurantEmail }; // Base filter
    if (readFlag === undefined) {
      // If readFlag is not provided, fetch only unread notifications
      filter.isRead = false;
    } else {
      // If readFlag is provided, use its value
      filter.isRead = readFlag === 'true'; // Convert to boolean
    }

    // Fetch notifications based on the filter
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params; // Get notification ID from request params

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid notification ID' });
  }

  try {
    // Find the notification and mark it as read
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Return the updated notification
    res.status(200).json({
      message: 'Notification marked as read successfully',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error });
  }
};
