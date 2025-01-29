const Notification = require('../models/RestauNotification'); // Import the Notification model
const Order =require("../models/Order")
const mongoose = require("mongoose");
const BookTable=require("../models/Restaurant/BookTable2")
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
exports.getRecentNotifications = async (req, res) => {
  const { restaurantEmail } = req.params; // Get restaurantEmail from URL params
  
  try {
    // Define the filter with just the restaurantEmail
    const filter = { restaurantEmail };

    // Fetch the most recent 50 notifications based on the filter
    console.log(restaurantEmail)
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(50); // Limit to 50 notifications
      // console.log("you called it?",notifications)
    // Extract all unique orderIds from the notifications
    const orderIds = [...new Set(notifications.map((notif) => notif.orderId))];
   
    if (orderIds.length === 0) {
      // If no orderIds found, return notifications as-is
      return res.status(200).json(notifications);
    }
   
    // Fetch orders and map them by orderId for quick lookup
    const orders = await Order.find({ orderId: { $in: orderIds } }, "orderId userId");
    // console.log(orders,"prinitng orders");
    const orderIdToUserIdMap = orders.reduce((map, order) => {
      map[order.orderId] = order.userId;
      return map;
    }, {});
    // console.log()
    // Attach userId to each notification
    const enrichedNotifications = notifications.map((notif) => ({
      ...notif.toObject(), // Convert Mongoose document to plain JS object
      userId: orderIdToUserIdMap[notif.orderId] || null, // Attach userId or null if not found
    }));

    res.status(200).json(enrichedNotifications);
  } catch (error) {
    console.error("Error fetching notifications with user IDs:", error);
    res.status(500).json({ message: "Error fetching notifications with user IDs", error });
  }
};
exports.getNotificationsStats = async (req, res) => {
  const { restaurantEmail } = req.params; // Get restaurantEmail from URL params
  const { duration } = req.query; // Get duration from query parameters
  console.log(restaurantEmail, duration, "analysis details received");

  try {
    // Define the filter with restaurantEmail
    const filter = { restaurantEmail };

    // Calculate the starting date based on the given duration
    let startDate;
    const now = new Date();

    switch (duration) {
      case "last7 days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "last1 month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "last5 months":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 5);
        break;
      case "lastyear":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({ message: "Invalid duration provided" });
    }

    // Add date filtering to the filter object
    filter.createdAt = { $gte: startDate, $lte: now };

    // Fetch the notifications within the specified duration
    const notifications = await Notification.find(filter);

    // Calculate total notification count
    const notificationCount = notifications.length;

    // Calculate total revenue
    const totalRevenue = notifications.reduce((revenue, notification) => {
      if (notification.items && Array.isArray(notification.items)) {
        const notificationRevenue = notification.items.reduce(
          (itemRevenue, item) => itemRevenue + item.quantity * item.price,
          0
        );
        return revenue + notificationRevenue;
      }
      return revenue;
    }, 0);
    const bookingsFilter = { userId: restaurantEmail,
                              status:"Paid"
     };  // Use userId as the filter for the restaurant
    bookingsFilter.createdAt = { $gte: startDate, $lte: now }; // Add date filtering for bookings

    const bookings = await BookTable.find(bookingsFilter);  // Assuming BookTable model for bookings
    const totalBookings = bookings.length;  // Count the total bookings

    res.status(200).json({ notificationCount, totalRevenue, totalBookings });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(500).json({ message: "Error fetching notification stats", error });
  }
};
const moment = require("moment");


exports.getGraphData = async (req, res) => {
  const { restaurantEmail } = req.params; // Get restaurantEmail from URL params
  const { duration } = req.query; // Get duration from query parameters
  console.log(restaurantEmail, duration, "Graph data request received");

  try {
    // Calculate start date based on duration
    const now = moment().endOf("day"); // Current date at the end of the day
    let startDate;
    const filter = { restaurantEmail };

    switch (duration) {
      case "last7 days":
        startDate = moment().subtract(6, "days").startOf("day");
        break;
      case "last1 month":
        startDate = moment().subtract(1, "month").startOf("day");
        break;
      case "last5 months":
        startDate = moment().subtract(5, "months").startOf("day");
        break;
      case "lastyear":
        startDate = moment().subtract(1, "year").startOf("day");
        break;
      default:
        return res.status(400).json({ message: "Invalid duration provided" });
    }

    // Generate an array of all dates in the range
    const dateRange = [];
    let currentDate = moment(startDate);
    while (currentDate.isSameOrBefore(now, "day")) {
      dateRange.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }
   filter.createdAt = { $gte: startDate, $lte: now };
    // Fetch orders for the restaurant
    console.log(filter);
    const orders = await Notification.find(filter);
  //  console.log(orders,"any order present or not");
    // Fetch table bookings for the restaurant
    const bookings = await BookTable.find({
      userId: restaurantEmail, // Since restaurantId is stored as userId
      createdAt: { $gte: startDate.toDate(), $lte: now.toDate() },
    });

    // Initialize graph data with 0 values for each date
    const graphData = dateRange.map((date) => ({
      date,
      totalRevenue: 0,
      totalOrders: 0,
      totalBookings: 0,
    }));

    // Populate total orders and revenue
    orders.forEach((order) => {
      const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
      const index = dateRange.indexOf(orderDate);
      if (index !== -1) {
        graphData[index].totalOrders += 1;
        if (order.items && Array.isArray(order.items)) {
          const orderRevenue = order.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );
          graphData[index].totalRevenue += orderRevenue;
        }
      }
    });

    // Populate total bookings
    bookings.forEach((booking) => {
      const bookingDate = moment(booking.createdAt).format("YYYY-MM-DD");
      const index = dateRange.indexOf(bookingDate);
      if (index !== -1) {
        graphData[index].totalBookings += 1;
      }
    });

    res.status(200).json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: "Error fetching graph data", error });
  }
};
