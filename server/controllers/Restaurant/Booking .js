const Razorpay = require('razorpay');
const crypto = require('crypto');
const BookTable=require('../../models/Restaurant/BookTable2')
const Prof = require("../../models/Prof")
// Initialize Razorpay instance
const socketIO = require('socket.io');
const {io,emailSocketMap}=require('../../middlewares/Socket');

// const io = socketIO(server, {
//   cors: {
//     origin: '*',
//   }
// });
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);
    
//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

// Controller to create a Razorpay order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { userId2, slot, guests, amount, currency, name ,customerId} = req.body;

    if (!userId2 || !slot || !guests || !amount || !currency || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new Razorpay order
    const options = {
      amount, 
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    const bookTableOrder = new BookTable({
        razorpayOrderId: order.id,  // Save Razorpay order ID
        amount,  // Amount for the booking
        currency,  // Currency for the booking
        slot,  // Slot for the reservation
        guests,  // Number of guests
        name,  // Name of the person making the booking
        userId:userId2,
        status: 'Created',  // Initially set status as 'Created'
        customerId
      });
  
      await bookTableOrder.save();
  
    return res.status(201).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      slot,
      guests,
      name,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
};

// Controller to verify the Razorpay payment signature
exports.verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature,userId } = req.body;
  
      // Generate the HMAC signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Your Razorpay Key Secret here
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      // Check if the signature is correct
      console.log(generatedSignature,razorpay_signature,"printing signature generated and actual");
      if (generatedSignature === razorpay_signature) {
        // Payment verified successfully
       
        // Find the corresponding order in the database
        const order = await BookTable.findOne({ razorpayOrderId: razorpay_order_id });
  
        if (order) {
          // Update order status to 'Paid' and save the Razorpay payment ID
          order.paymentId = razorpay_payment_id; // Store the payment ID
          order.status = 'Paid'; // Change the status to 'Paid'
          await order.save(); // Save the updated order in the database
           const socketId = emailSocketMap.get(userId);
        //  console.log(socketId,"connected id");
         if (socketId) {
           io.to(socketId).emit('booking-table', order);
           console.log(`Notification sent to ${userId} with socket ID: ${socketId}`);
         } else {
           console.log(`No active connection found for email: ${userId}`);
         }
          res.status(200).json({ message: 'Payment verified and order updated successfully', orderId: order._id });
        } else {
          // If the order is not found
          res.status(404).json({ message: 'Order not found' });
        }
      } else {
        // Payment verification failed
        res.status(400).json({ message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      res.status(500).json({ message: 'Error verifying Razorpay payment' });
    }
  };
 

  exports.markBookingAsSeen = async (req, res) => {
    try {
      const { bookingId } = req.params; // Extract the bookingId (which is the _id) from the URL params
       console.log("are you called",bookingId);
      // Find and update the booking document
      const updatedBooking = await BookTable.findByIdAndUpdate(
        bookingId, // Use the _id field directly
        { seen: true }, // Set the seen field to true
        { new: true } // Return the updated document
      );
  
      // If the booking doesn't exist, return an error
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Send the updated booking as the response
      res.status(200).json({ message: 'Booking marked as seen', booking: updatedBooking });
    } catch (error) {
      console.error('Error marking booking as seen:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters
  
    try {
     
      // Fetch orders from the database where userId matches the given id
      const orders = await BookTable.find({ userId: userId,seen: false,status:"Paid" });
      console.log("present in backend or not",userId);
      // Check if any orders were found
      if (!orders) {
        return res.status(404).json({
          success: false,
          message: 'No orders found for this user.',
        });
      }
  
      // Return the orders in the response
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      // Handle any errors during database interaction
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching orders.',
        error: error.message,
      });
    }
  };
  
  exports.getRecentReservationsByUserId = async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters
  
    try {
      // Fetch the 20 most recent reservations where userId matches, status is "Paid," and seen is true
      const recentReservations = await BookTable.find({
        userId: userId,
        seen: true, // Ensure seen is true
        status: "Paid", // Ensure status is Paid
      })
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(20) // Limit to 20 results
        .lean(); // Convert Mongoose documents to plain JavaScript objects
  
      // If no reservations are found, return a 404 response
      if (!recentReservations || recentReservations.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No recent reservations found for this user.",
        });
      }
  
      // Fetch images for each reservation based on the userId
      const reservationsWithProfile = await Promise.all(
        recentReservations.map(async (reservation) => {
          const user = await Prof.findOne({ userId: reservation.userId }).select("image").lean();
          return {
            ...reservation,
            userImage: user ? user.image : null, // Add user image or null if not found
          };
        })
      );
  
      // Return the reservations with profile images
      res.status(200).json({
        success: true,
        data: reservationsWithProfile,
      });
    } catch (error) {
      // Handle any errors during database interaction
      console.error("Error fetching recent reservations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching recent reservations.",
        error: error.message,
      });
    }
  };
  