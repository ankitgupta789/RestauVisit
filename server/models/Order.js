const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Razorpay order ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  items: [
    {
      restaurantEmail: {type:String,required:true}, // Restaurant ID
      items: [
        {
          itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, // Menu item ID
          quantity: { type: Number, required: true },
          price: { type: Number, required: true }
        }
      ],
      subTotal: { type: Number, required: true } // Subtotal for the restaurant's items
    }
  ],
  totalAmount: { type: Number, required: true }, // Total amount for the entire order
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }, // Payment status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
