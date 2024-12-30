import axios from 'axios';

export const createOrder = async (orderData) => {
  try {
    // Sending a POST request to the backend to create an order
    console.log(orderData,"data in frontend");
    const response = await axios.post('http://localhost:4000/api/v1/order/create-order', {orderData});
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response?.data?.message || 'Failed to create order';
  }
};
