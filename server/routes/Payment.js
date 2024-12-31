const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/VerifyPayment');

// Route to verify Razorpay payment
router.post('/verify-payment', verifyPayment);

module.exports = router;
