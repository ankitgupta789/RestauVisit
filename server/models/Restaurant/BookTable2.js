const mongoose = require('mongoose');

const bookTableSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true }, // Razorpay order ID
  paymentId: { type: String }, // Razorpay payment ID (populated after payment verification)
  amount: { type: Number, required: true }, // Amount in smallest currency unit (e.g., paise for INR)
  currency: { type: String, default: 'INR' }, // Currency (default: INR)
  slot: { type: String, required: true }, // Slot for booking (e.g., '12:00 - 13:00')
  guests: { type: Number, required: true }, // Number of guests
  name: { type: String, required: true }, // Name of the person making the booking
  status: {
    type: String,
    default: 'Created', // Status can be: Created, Paid, Failed
    enum: ['Created', 'Paid', 'Failed'],
  },
  seen:{
    type:Boolean, default:false
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }, // Booking creation timestamp
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('BookTable', bookTableSchema);
