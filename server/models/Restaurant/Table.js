// models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  slots: [
    {
      slot: { 
        type: String, 
        required: true 
      }, // Example: "2025-01-21T14:00:00Z"
      isBooked: { 
        type: Boolean, 
        default: false 
      },
      userName: { 
        type: String, 
        default: null 
      }, // Who booked this slot
    },
  ],
});

// Middleware to generate slots before saving a new table
tableSchema.pre('save', function (next) {
  // Check if slots already exist (to avoid overwriting during updates)
  if (this.slots && this.slots.length > 0) return next();

  const slots = [];
  const startHour = 10; // 10 AM
  const endHour = 22;  // 10 PM (exclusive)

  for (let hour = startHour; hour < endHour; hour++) {
    const slotTime = `${hour}:00 - ${hour + 1}:00`;
    slots.push({ slot: slotTime, isBooked: false, userName: null });
  }

  this.slots = slots; // Set the generated slots
  next();
});

module.exports = mongoose.model('Table2', tableSchema);
