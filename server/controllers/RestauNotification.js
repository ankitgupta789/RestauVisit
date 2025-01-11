const Notification = require('../models/RestauNotification'); // Import the Notification model

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

// GET - Fetch notifications for a specific restaurant
exports.getNotifications = async (req, res) => {
  const { restaurantEmail } = req.params; // Get restaurantEmail from request params

  try {
    // Find all notifications for the specified restaurant
    const notifications = await Notification.find({ restaurantEmail }).sort({ createdAt: -1 });

    // Return the notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// PUT - Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params; // Get notification ID from request params

  try {
    // Find and update the notification to mark it as read
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    // Return the updated notification
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error });
  }
};
