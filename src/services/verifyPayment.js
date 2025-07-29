import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
// Function to send payment data to the server for verification
export const verifyPaymentWithServer = async (paymentData) => {
  try {
    // Send the payment data to the backend for verification using Axios
    const response = await axios.post(`${BASE_URL}/payment/verify-payment`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the response from the backend
    if (response.data.status === 'success') {
      alert('Payment verified successfully');
    } else {
      alert('Payment verification failed');
    }
    return response.data;
  } catch (error) {
    console.error('Error during payment verification:', error);
    alert('An error occurred while verifying the payment');
  }
};
