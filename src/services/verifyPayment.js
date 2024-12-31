import axios from 'axios';

// Function to send payment data to the server for verification
export const verifyPaymentWithServer = async (paymentData) => {
  try {
    // Send the payment data to the backend for verification using Axios
    const response = await axios.post('http://localhost:4000/api/v1/payment/verify-payment', paymentData, {
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
