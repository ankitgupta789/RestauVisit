// const { validateRazorpaySignature } = require('../utils/verifySignature'); // Import the validateRazorpaySignature function
const Payment = require('../models/Payment'); // Import your Payment model (or path to your model)
const crypto = require('crypto');
const Order=require("../models/Order");
const socketIO = require('socket.io');
const Notification=require("../models/RestauNotification");
const { connectedSockets } = require('../index');


const {app,server}=require('../middlewares/Socket');

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});


// socket 


io.on('connection', (socket) => {
  console.log('Connected to the client (socket.io)');

  // Restaurant joins a specific room
  socket.on('join-order-room', (restaurantEmail) => {
    socket.join(restaurantEmail);
    console.log(`Restaurant with email ${restaurantEmail} joined the order room.`);
  });

  // Notify restaurant of new order
  socket.on('new-order', (orderDetails) => {
    const restaurantEmail = orderDetails.restaurantEmail;
    console.log(orderDetails,"printing orderDetails");
    socket.to(restaurantEmail).emit('order-notification', orderDetails);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});








// Razorpay Secret Key (ensure you use the secret key from your Razorpay account)
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET; // Replace with your actual Razorpay secret key
const validateRazorpaySignature = (paymentData) => {
    const { orderId, paymentId, signature } = paymentData;
    console.log(paymentData,"outputting paymentData in backend");
    // Create the string to be matched with Razorpay's signature
    const stringToCheck = orderId + "|" + paymentId;
    
    // Generate the expected signature using your secret key and the stringToCheck
    const generatedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(stringToCheck)
      .digest('hex');
    console.log(generatedSignature,signature)
    // Compare the generated signature with the Razorpay signature
    return generatedSignature === signature;
  };
// Function to handle payment verification after successful payment
const verifyPayment = async (req, res) => {
  try {
    // Extract the payment details sent from frontend
    const { orderId, paymentId, signature, userId, amount } = req.body;
   console.log(amount,"sending amount ot not");
    // Step 1: Validate the Razorpay payment signature
    const isValidSignature = validateRazorpaySignature(req.body);
    if (!isValidSignature) {
      return res.status(400).json({ status: 'failed', message: 'Invalid payment signature' });
    }
    
    // Step 2: If signature is valid, save the payment details in the database
    const paymentData = {
        paymentId: paymentId,
        orderId: orderId,
        userId: userId,
        amount: amount,
        status: 'Completed', // You can update this status based on your business logic
      };
      
      // Check if a payment with the same orderId already exists
      const existingPayment = await Payment.findOne({ orderId: orderId });
      
      if (existingPayment) {
        // If a payment with the same orderId exists, update it
        console.log("alreday present in db");
        existingPayment.paymentId = paymentId;
        existingPayment.userId = userId;
        existingPayment.amount = amount;
        existingPayment.status = 'Completed'; // Update the status if necessary
        await existingPayment.save();
        // res.status(200).json({ status: 'success', message: 'Payment verified successfully', payment: existingPayment });
      } 
      else {
        console.log("alreday not present in db");
        // If no existing payment is found, create a new one
        const newPayment = new Payment(paymentData);
        await newPayment.save();
        // res.status(200).json({ status: 'success', message: 'Payment verified successfully', payment: newPayment });
      }
      const orderDetails=await Order.findOneAndUpdate(
        { orderId },
        { paymentStatus: 'Completed' },
        { new: true }
      );
      console.log(orderDetails,"here send notification to each of restaurants");


      if (orderDetails && orderDetails.items) {
        // Loop through the order items to send notifications to each restaurant
        for (let restaurant of orderDetails.items) {
          const restaurantEmail = restaurant.restaurantEmail;
      
          // Save the notification for each restaurant
        //   const message = `New order received! Order ID: ${orderDetails.orderId}, Total Amount: ${orderDetails.totalAmount}`;
          
          const newNotification = new Notification({
            restaurantEmail: restaurantEmail, // Restaurant's email
            orderId: orderDetails.orderId, // Order ID
            items: restaurant.items, // Notification message
            userId:userId,//user who did payment
          });
        console.log(newNotification,restaurantEmail,"printing exact notification sent per restaurant");
          // Save the notification to the database
          await newNotification.save();
        //  console.log(io,"printing io");
        io.to(restaurantEmail).emit('order-notification', newNotification);
          console.log(`New order notification sent to restaurant: ${restaurantEmail}`);

        }
      
        console.log("Notifications sent to the respective restaurants.");
      } else {
        console.error("No items found in the order.");
      }
    // Step 3: Send a success response
    
    res.status(200).json({ status: 'success', message: 'Payment verified successfully, notifications sent.' });
  } catch (error) {
    console.error('Error during payment verification:', error);
    res.status(500).json({ status: 'failed', message: 'Server error during payment verification' });
  }
};

// Export the controller
module.exports = { verifyPayment };
