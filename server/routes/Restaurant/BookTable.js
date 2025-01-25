const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../../controllers/Restaurant/Booking ');

const router = express.Router();

// Route to create a Razorpay order
router.post('/bookTable', createPaymentOrder);

// Route to verify Razorpay payment
router.post('/verifyPayment', verifyPayment);

module.exports = router;
