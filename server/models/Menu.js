const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: false 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  image_url: { 
    type: String, 
    required: false 
  },
  preparation_time: { 
    type: Number, 
    required: true 
  },
  availability: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference the ObjectId of the user
    ref: "User", // The name of the model being referenced
    required: true,
  }
});

menuItemSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
