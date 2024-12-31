const Razorpay = require('razorpay');
const Order = require('../models/Order'); // Import the Order model
const Payment = require('../models/Payment'); // Import the Payment model
const mongoose = require('mongoose');
const Menu=require('../models/Menu');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Add your Razorpay key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Add your Razorpay secret key
});

// Controller function to create an order
const createOrder = async (req, res) => {
  try {
    const { orderData } = req.body;
    const userId=orderData.userId;
    const items=orderData.items;
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

    // Validate the input
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const totalAmount = orderData.totalAmount;
    await Payment.deleteMany({ userId, status: 'Created' });
    // console.log(items,"reached here?");
    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
    });
     //here extract the total of each restaurant
     const updatedItems = await Promise.all(
        items.map(async (item) => {
          const menuItems = await Menu.find({
            _id: item.itemId 
          });
      
          // Return only the items (menu items)
          return menuItems;
        })
      );
      console.log(updatedItems,"updatedItems are");
      const groupedItems = {};

      items.forEach((orderItem) => {
        // Find the restaurant's menu items for the corresponding `itemId`
        updatedItems.forEach((restaurantItems) => {
          const menuItem = restaurantItems.find((menu) => menu._id.toString() === orderItem.itemId);
      
          if (menuItem) {
            const restaurantEmail = menuItem.restaurant_email;
      
            // Initialize the group for this restaurant if it doesn't exist
            if (!groupedItems[restaurantEmail]) {
              groupedItems[restaurantEmail] = {
                restaurant_email: restaurantEmail,
                items: [],
                subTotal: 0
              };
            }
      
            // Add the menu item to the groupedItems array for this restaurant
            groupedItems[restaurantEmail].items.push({
              itemId: menuItem._id,
              name: menuItem.name,
              quantity: orderItem.quantity,
              price: menuItem.price
            });
      
            // Calculate and update the subtotal for this restaurant
            groupedItems[restaurantEmail].subTotal += orderItem.quantity * menuItem.price;
          }
        });
    });
// Convert groupedItems object into an array
const restaurantOrders = Object.values(groupedItems);

console.log(restaurantOrders, "Grouped items by restaurant");
    // Save order in the database
    const newOrder = new Order({
      orderId: razorpayOrder.id,
      userId:new mongoose.Types.ObjectId(userId),
      items: restaurantOrders.map((restaurant) => ({
        restaurantEmail:restaurant.restaurant_email,
        items: restaurant.items,
        subTotal: restaurant.subTotal
      })),
      totalAmount,
      paymentStatus: 'Pending'
    });

    await newOrder.save();
    console.log(newOrder,"orderCreated or not");
    // Save initial payment record
    const newPayment = new Payment({
      
      orderId: razorpayOrder.id,
      userId:new mongoose.Types.ObjectId(userId),
      amount: totalAmount,
      currency: 'INR',
      status: 'Created'
    });

    await newPayment.save();
    console.log(newPayment,"does newPayment created");
    // Respond with order details and Razorpay order ID
    res.status(201).json({
      message: 'Order created successfully',
      orderId: razorpayOrder.id,
      totalAmount,
      razorpayOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};


module.exports = { createOrder };
