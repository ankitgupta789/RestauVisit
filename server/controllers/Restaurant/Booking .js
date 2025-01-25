const Razorpay = require('razorpay');
const crypto = require('crypto');
const BookTable=require('../../models/Restaurant/BookTable')
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
    const { slot, guests, amount, currency, name } = req.body;

    if (!slot || !guests || !amount || !currency || !name) {
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
        status: 'Created',  // Initially set status as 'Created'
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
         console.log(socketId,"connected id");
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
