import React, { useState, useEffect } from 'react';
import { FaChair } from 'react-icons/fa';
import { addTable, fetchTables, markSlotAsBooked, markSlotAsUnBooked } from '../services/Restaurants/Table'; // Import markSlotAsUnBooked
import { useSelector } from 'react-redux';
import NotificationRender from './NotificationRender';
const TableManager = () => {
  const [tables, setTables] = useState([]); // State to store tables
  const [showInput, setShowInput] = useState(false); // State to show input form
  const [capacity, setCapacity] = useState(''); // State to store capacity input
  const [selectedTable, setSelectedTable] = useState(null); // Selected table object for popup
  const { user } = useSelector((state) => state.profile);

  // Fetch tables from backend
  const loadTables = async () => {
    try {
      const fetchedTables = await fetchTables(user._id); // Pass restaurantId (user._id)
      setTables(fetchedTables);
      console.log(fetchedTables, 'fetched tables');
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    loadTables();
  }, [user._id]);

  const handleAddTable = () => {
    setShowInput(true); // Show input form
  };

  const handleSubmit = async () => {
    if (capacity.trim() !== '') {
      try {
        await addTable(user._id, Number(capacity)); // Call backend to add table
        setTables((prev) => [
          ...prev,
          { id: tables.length + 1, capacity: Number(capacity) },
        ]);
        setShowInput(false); // Hide input form
        setCapacity(''); // Reset capacity
        loadTables();
      } catch (error) {
        console.error('Error adding table:', error);
        alert('Failed to add table. Please try again.');
      }
    } else {
      alert('Please enter a valid capacity!');
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table); // Set selected table for popup
  };

  const closePopup = () => {
    setSelectedTable(null); // Close the popup
  };

  const handleSlotBooking = async (tableId, timeSlot, userName, index) => {
    try {
      const result = await markSlotAsBooked(tableId, timeSlot, userName);
      if (result) {
        // Update the slot as booked in the frontend
        const updatedSlots = selectedTable.slots.map((slot, i) =>
          i === index ? { ...slot, isBooked: true, userName, showForm: false } : slot
        );
        setSelectedTable({ ...selectedTable, slots: updatedSlots });
        loadTables();
        alert('Slot successfully booked!');
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('Failed to book the slot. Please try again.');
    }
  };

  const handleSlotUnbooking = async (tableId, timeSlot, index) => {
    const confirmUnbooking = window.confirm(
      `Are you sure you want to unbook the slot: ${timeSlot}?`
    );
  
    if (!confirmUnbooking) {
      // If the user cancels, do nothing
      return;
    }
  
    try {
      const result = await markSlotAsUnBooked(tableId, timeSlot);
      if (result) {
        // Update the slot as unbooked in the frontend
        const updatedSlots = selectedTable.slots.map((slot, i) =>
          i === index ? { ...slot, isBooked: false, userName: null } : slot
        );
        setSelectedTable({ ...selectedTable, slots: updatedSlots });
        loadTables();
        alert('Slot successfully unbooked!');
      }
    } catch (error) {
      console.error('Error unbooking slot:', error);
      alert('Failed to unbook the slot. Please try again.');
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh'}}>
    <div style={{ padding: '20px', textAlign: 'center' ,width: '60%',backgroundColor:'white'}}>
      {/* Add Table Button */}
      <button
        onClick={handleAddTable}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add Table
      </button>

      {/* Input for Capacity */}
      {showInput && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="number"
            placeholder="Enter table capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Display Tables */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tables.map((table) => (
          <div
            key={table._id}
            onClick={() => handleTableClick(table)}
            style={{
              margin: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <FaChair size={40} color="#4caf50" style={{ marginBottom: '5px' }} />
            <div>Table {table.id}</div>
            <div>Capacity: {table.capacity}</div>
          </div>
        ))}
      </div>

      {/* Popup for Selected Table */}
      {selectedTable && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              width: '50%',
              textAlign: 'center',
            }}
          >
            <h3>Table {selectedTable.id}</h3>
            <p>Capacity: {selectedTable.capacity}</p>
            <h4>Available Slots</h4>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {selectedTable.slots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center shadow-md ${
                    slot.isBooked
                      ? 'bg-pink-400 text-red-700'
                      : 'bg-caribbeangreen-100 text-green-700 hover:bg-green-300 hover:cursor-pointer'
                  }`}
                  title={!slot.isBooked ? 'Click to Book Table' : 'Click to Unbook Table'}
                  onClick={() => {
                    if (slot.isBooked) {
                      handleSlotUnbooking(selectedTable._id, slot.slot, index);
                    } else {
                      const updatedSlots = selectedTable.slots.map((s, i) =>
                        i === index ? { ...s, showForm: true } : s
                      );
                      setSelectedTable({ ...selectedTable, slots: updatedSlots });
                    }
                  }}
                >
                  <span>{slot.slot}</span>
                  {!slot.isBooked ? (
                    <div style={{ fontSize: '12px', color: '#555' }}>Book Table</div>
                  ):
                  <div style={{ fontSize: '12px', color: '#555' }}>Unbook Table</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px' }}>
              {selectedTable.slots.map(
                (slot, index) =>
                  slot.showForm && (
                    <div
                      key={index}
                      style={{
                        marginTop: '10px',
                        textAlign: 'center',
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        borderRadius: '10px',
                      }}
                    >
                      <h4>Book Slot: {slot.slot}</h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const userName = e.target.userName.value;
                          if (userName.trim() === '') {
                            alert('Please enter a valid name.');
                            return;
                          }
                          handleSlotBooking(selectedTable._id, slot.slot, userName, index);
                        }}
                      >
                        <input
                          type="text"
                          name="userName"
                          placeholder="Enter your name"
                          style={{
                            padding: '10px',
                            fontSize: '16px',
                            marginRight: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '80%',
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          Confirm Booking
                        </button>
                      </form>
                    </div>
                  )
              )}
            </div>
            <button
              onClick={closePopup}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    <div style={{ flex: 1, padding: '20px',backgroundColor:'lightblue' }}>
        <NotificationRender/>
      </div>
    </div>
  );
};

export default TableManager;
