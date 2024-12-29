import axios from 'axios';
import toast from 'react-hot-toast';


export const addToCart = async (userId, itemId) => {
  try {
    
    const response = await axios.post('http://localhost:4000/api/v1/cart/addCart', {
      userId,
      itemId,
    });
    toast.success("Item Details Added Successfully")
    console.log('Item added to cart:', response.data);
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data?.message || error.message);
  }
};

export const getCartItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/cart/getCart/${userId}`);
  
      console.log('Cart items:', response.data);
      return response.data; // Return cart items if needed
    } catch (error) {
      console.error('Error fetching cart items:', error.response?.data?.message || error.message);
    }
};