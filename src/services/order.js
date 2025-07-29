import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const createOrder = async (orderData) => {
  try {
    // Sending a POST request to the backend to create an order
    console.log(orderData,"data in frontend");
    const response = await axios.post(`${BASE_URL}/order/create-order`, {orderData});
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response?.data?.message || 'Failed to create order';
  }
};
export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/order/getorders/${userId}`);
    if (response.status === 200) {
      console.log('Orders retrieved successfully:', response.data.orders);
      return response.data.orders;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('No orders found for this user.');
    } else {
      console.error('Error fetching orders:', error.message);
    }
    return [];
  }
};
