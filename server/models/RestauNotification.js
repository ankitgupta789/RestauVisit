const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  restaurantEmail: { 
    type: String, 
    required: true 
  }, // Email of the restaurant receiving the notification

  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, // Menu item ID
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  orderId: { 
    type: String,  
    required: true 
  }, 

  isRead: { 
    type: Boolean, 
    default: false 
  }, // Whether the notification has been viewed by the restaurant
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
    },
  createdAt: { 
    type: Date, 
    default: Date.now 
  } // Timestamp of when the notification was created
});

module.exports = mongoose.model('Notification', notificationSchema);
