const express = require('express');
const { createPaymentOrder, verifyPayment, markBookingAsSeen, getOrdersByUserId,getRecentReservationsByUserId} = require('../../controllers/Restaurant/Booking ');

const router = express.Router();

// Route to create a Razorpay order
router.post('/bookTable', createPaymentOrder);

// Route to verify Razorpay payment
router.post('/verifyPayment', verifyPayment);
//for updating seen field as true;
router.post('/mark-seen/:bookingId', markBookingAsSeen);
router.get('/orders/:userId', getOrdersByUserId);
router.get('/getRecentReservations/:userId', getRecentReservationsByUserId);
module.exports = router;
