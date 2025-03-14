const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, default: 'PENDING'}, // Razorpay payment ID
    orderId: { type: String, required: true,unique:true }, // Razorpay order ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User making the payment
    amount: { type: Number, required: true }, // Total payment amount
    currency: { type: String, default: 'INR' }, // Payment currency
    status: { type: String, enum: ['Created', 'Completed', 'Failed'], default: 'Created' }, // Payment status
    createdAt: { type: Date, default: Date.now },
    razorpaySignature: { type: String }, // Signature for verification
    errorDetails: { type: String } // Error details in case of failure
  });
  paymentSchema.index({ orderId: 1 }, { unique: true });

  module.exports = mongoose.model('Payment', paymentSchema);
  