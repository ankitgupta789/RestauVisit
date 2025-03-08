const Table = require('../../models/Restaurant/Table2'); // Import the Table model

// Add a table controller
const addTable = async (req, res) => {
  try {
    const { capacity,restaurantId } = req.body;

    // Get restaurantId from authenticated user (assumes middleware sets req.user)
   

    if (!capacity || capacity <= 0) {
      return res.status(400).json({ message: 'Capacity is required and must be greater than 0.' });
    }

    

    // Create a new table
    const newTable = new Table({
      restaurantId,
      capacity,
    });

    // Save the table to the database
    await newTable.save();

    return res.status(201).json({ message: 'Table added successfully.', table: newTable });
  } catch (error) {
    console.error('Error adding table:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Get tables controller
const getTable = async (req, res) => {
  try {
    const { restaurantId } = req.query; // Get restaurantId from query params

    // Validate restaurantId
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required.' });
    }

    // Fetch all tables for the given restaurantId
    const tables = await Table.find({ restaurantId });

    // Check if any tables exist
    if (!tables || tables.length === 0) {
      return res.status(404).json({ message: 'No tables found for this restaurant.' });
    }

    return res.status(200).json({ message: 'Tables fetched successfully.', tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};
// Mark a time slot as booked for a table
const markBooked = async (req, res) => {
    try {
      const { tableId, timeSlot, userName } = req.body;
  
      // Validate required fields
      if (!tableId || !timeSlot || !userName) {
        return res.status(400).json({
          message: 'Table ID, time slot, and user name are required.',
        });
      }
  
      // Find the table by ID
      const table = await Table.findById(tableId);
  
      if (!table) {
        return res.status(404).json({ message: 'Table not found.' });
      }
  
      // Find the time slot and mark it as booked
      const slotIndex = table.slots.findIndex((slot) => slot.slot === timeSlot);
      if (slotIndex === -1) {
        return res.status(400).json({ message: 'Invalid time slot.' });
      }
  
      if (table.slots[slotIndex].isBooked) {
        return res.status(400).json({ message: 'Time slot is already booked.' });
      }
  
      // Update the slot
      table.slots[slotIndex].isBooked = true;
      table.slots[slotIndex].userName = userName;
  
      // Save the updated table
      await table.save();
  
      return res.status(200).json({
        message: 'Time slot marked as booked successfully.',
        table,
      });
    } catch (error) {
      console.error('Error marking slot as booked:', error);
      res.status(500).json({
        message: 'Internal server error.',
        error: error.message,
      });
    }
  };
  const unmarkBooked = async (req, res) => {
    try {
      const { tableId, timeSlot } = req.body;
  
      // Validate required fields
      if (!tableId || !timeSlot ) {
        return res.status(400).json({
          message: 'Table ID, time slot are required.',
        });
      }
  
      // Find the table by ID
      const table = await Table.findById(tableId);
  
      if (!table) {
        return res.status(404).json({ message: 'Table not found.' });
      }
  
      // Find the time slot and mark it as booked
      const slotIndex = table.slots.findIndex((slot) => slot.slot === timeSlot);
      if (slotIndex === -1) {
        return res.status(400).json({ message: 'Invalid time slot.' });
      }
  
      // Update the slot
      table.slots[slotIndex].isBooked = false;
      table.slots[slotIndex].userName = null;
  
      // Save the updated table
      await table.save();
  
      return res.status(200).json({
        message: 'Time slot marked as unbooked successfully.',
        table,
      });
    } catch (error) {
      console.error('Error marking slot as unbooked:', error);
      res.status(500).json({
        message: 'Internal server error.',
        error: error.message,
      });
    }
  };
  const checkSlotAvailability = async (req, res) => {
    try {
      const { timeSlot, capacity } = req.body;
  
      // Validate required fields
      if (!timeSlot || !capacity) {
        return res.status(400).json({
          message: 'Time slot and number of guests (capacity) are required.',
        });
      }
  
      // Fetch all tables
      const tables = await Table.find();
  
      if (!tables || tables.length === 0) {
        return res.status(404).json({ message: 'No tables found.' });
      }
  
      // Calculate total available capacity for the given time slot
      let totalAvailableCapacity = 0;
  
      tables.forEach((table) => {
        table.slots.forEach((slot) => {
          if (slot.slot === timeSlot && !slot.isBooked) {
            totalAvailableCapacity += table.capacity; // Add table's capacity
          }
        });
      });
  
      if (totalAvailableCapacity < capacity) {
        return res.status(200).json({
          message: 'No available table(s) found with the requested capacity for the given time slot.',
          available: false,
        });
      }
  
      return res.status(200).json({
        message: 'Table(s) available for the requested time slot and capacity.',
        available: true,
        totalAvailableCapacity,
      });
    } catch (error) {
      console.error('Error checking slot availability:', error);
      res.status(500).json({
        message: 'Internal server error.',
        error: error.message,
      });
    }
  };
  
module.exports = { addTable, getTable, markBooked, unmarkBooked,checkSlotAvailability};
