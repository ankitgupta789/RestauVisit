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
