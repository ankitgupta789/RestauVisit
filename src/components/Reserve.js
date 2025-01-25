import React, { useState,useEffect } from 'react';
import { checkSlotAvailability } from '../services/Restaurants/Table'; // Import necessary functions
import axios from 'axios'; // Import axios for API requests
import { verifyPaymentOnServer } from '../services/Restaurants/BookTable';
import { useSelector } from 'react-redux';
const Reserve = ({ userId }) => {
  const [slot, setSlot] = useState(''); // State to store the selected slot
  const [guests, setGuests] = useState(''); // State for the number of guests
  const [availability, setAvailability] = useState(null); // State to store availability status
  const [isPaymentVisible, setIsPaymentVisible] = useState(false); // State to control payment visibility
  const { user } = useSelector((state) => state.profile);

  const timeSlots = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
  ]; // Time range from 10 AM to 10 PM
 useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // Function to handle form submission
  const handleCheckAvailability = async (e) => {
    e.preventDefault();

    if (!slot || !guests) {
      alert('Please select a time slot and enter the number of guests!');
      return;
    }

    try {
      // Call the imported function
      const response = await checkSlotAvailability(slot, Number(guests));

      // Update availability status based on the response
      if (response.available) {
        setAvailability('Available');
        setIsPaymentVisible(true); // Show payment option
      } else {
        setAvailability('Not Available');
        setIsPaymentVisible(false); // Hide payment option
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability('Error checking availability. Please try again.');
      setIsPaymentVisible(false); // Hide payment option
    }
  };

  // Function to handle Razorpay payment
  const handlePayment = async () => {
    try {
      // Prepare data for table booking
      const bookingData = {
        slot,
        guests: Number(guests),
        amount: 50000, // Amount in smallest currency unit (e.g., 50000 paise = 500 INR)
        currency: 'INR',
        name: 'Guest Name', // Replace with actual guest name input if needed
      };

      // Make a POST request to backend to create a Razorpay order
      const response = await axios.post('http://localhost:4000/api/v1/book/bookTable', bookingData);

      const { amount, id: orderId, currency } = response.data;

      const options = {
        key: 'rzp_test_G6ohIQO7ZOHmVY', // Replace with your Razorpay key
        amount,
        currency,
        name: 'Table Booking',
        description: `Booking for ${guests} guests in slot ${slot}`,
        order_id: orderId, // Order ID from backend
        handler: async function (response) {
        // Now sendiing payment info to the backend for verification
          const paymentVerificationResponse = await verifyPaymentOnServer(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            userId
          );
  
          if (paymentVerificationResponse.success) {
            alert('Payment verified successfully');
            // Perform any additional actions after verification (e.g., show success page)
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Guest Name', // Replace with actual guest name input
          email: 'guest@example.com', // Replace with actual email input if needed
        },
        theme: {
          color: '#3399cc',
        },
      };

     if (window.Razorpay) {
               const rzp = new window.Razorpay(options);
               rzp.open();
             } else {
               console.error('Razorpay is not loaded correctly');
             }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reserve a Slot</h1>
      <form onSubmit={handleCheckAvailability} className="space-y-4">
        <label className="block text-gray-700 font-medium">
          Select Time Slot
        </label>
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Select a Slot --
          </option>
          {timeSlots.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
        <label className="block text-gray-700 font-medium">
          Enter Number of Guests
        </label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Enter number of guests"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Check Availability
        </button>
      </form>

      {/* Display availability status */}
      {availability !== null && (
        <div
          className={`mt-4 p-4 text-center rounded-lg ${
            availability === 'Available'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {availability === 'Available'
            ? 'The slot is available! You can proceed with booking.'
            : 'Sorry, the slot is not available. Try a different time.'}
        </div>
      )}

      {/* Show payment option if available */}
      {isPaymentVisible && (
        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-caribbeangreen-200 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default Reserve;
