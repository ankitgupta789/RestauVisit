const mongoose = require("mongoose");

// Prevents creating separate `_id` for each seat

const seatSchema = new mongoose.Schema(
  {
    seat_id: {
      type: String,
      required: true,
      unique: true, 
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
  }
);

const rowSchema = new mongoose.Schema(
  {
    row_id: {
      type: String,
      required: true,
    },
    seats: [seatSchema],
  }
);

const sectionSchema = new mongoose.Schema(
  {
    section_name: {
      type: String,
      required: true,
    },
    rows: [rowSchema], 
  }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    seatCapacity: {
      type: Number,
      required: true,
      min: [1, "Seat capacity must be at least 1"] 
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seating_plan: {
      sections: [sectionSchema], 
    },
  },
  {
    timestamps: true, 
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
