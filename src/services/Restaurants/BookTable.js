import axios from 'axios';

export const verifyPaymentOnServer = async (razorpay_order_id, razorpay_payment_id, razorpay_signature,userId) => {
  try {
    // Send payment details to backend for verification using Axios
    const response = await axios.post('http://localhost:4000/api/v1/book/verifyPayment', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    });

    if (response.status === 200) {
      // If the payment is successfully verified by backend
      return { success: true };
    } else {
      // If verification fails
      return { success: false, message: response.data.message || 'Payment verification failed' };
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, message: error.response?.data?.message || 'Error verifying payment' };
  }
};
export const markBookingAsSeen = async (bookingId) => {
  try {
    // Replace 'http://localhost:4000' with your backend URL
    
    const response = await axios.post(`http://localhost:4000/api/v1/book/mark-seen/${bookingId}`);
    console.log('Booking marked as seen:', response.data);
    return response.data; // Return the response in case you want to handle it
  } catch (error) {
    console.error('Error marking booking as seen:', error.response?.data || error.message);
    throw error; // Throw the error for error handling if needed
  }
};
export const getOrdersByUserId = async (userId) => {
  try {
    console.log("present here")
    const response = await axios.get(`http://localhost:4000/api/v1/book/orders/${userId}`);

    if (response.data.success) {
      // console.log('Orders fetched successfully:', response.data.data);
      return response.data.data; // Returns the list of orders
    } else {
      console.error('No orders found for the user.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null; // Return null to indicate an error occurred
  }
};

export const fetchRecentReservations = async (userId) => {
  try {
    const response = await axios.get( `http://localhost:4000/api/v1/book/getRecentReservations/${userId}` // Replace with your actual backend URL
    );
    console.log(response.data,"all bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent reservations:", error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};
