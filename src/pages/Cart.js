import React, { useEffect, useState } from 'react';
import { getCartItems, deleteCartItem } from '../services/operations/cart';
import { createOrder } from '../services/order'; // Import the function to create an order
import { useSelector } from 'react-redux';
import { fetchItemsByIds } from '../services/operations/menu';
import Razorpay from 'razorpay'; // Assuming Razorpay integration library is available
import { verifyPaymentWithServer } from '../services/verifyPayment';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
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
  const handleFetchCartItems = async () => {
    try {
      const userId = user._id;

      // Fetch cart items associated with the user
      const items = await getCartItems(userId);
      const itemIds = items.cartItems.map((cartItem) => cartItem.itemId._id);

      // Fetch all item details based on item IDs
      if (itemIds.length > 0) {
        const itemDetails = await fetchItemsByIds(itemIds);
        setCartItems(
          itemDetails.data.map((item) => ({
            ...item,
            quantity: 1, // Default quantity set to 1
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const userId=user._id;
      console.log(itemId,"id of deleted item")
      await deleteCartItem(userId, itemId);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error('Failed to delete cart item', err);
      alert(err.message || 'Failed to delete the item');
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
          : item
      )
    );
  };

  const calculateTotalPrice = () =>
    cartItems.reduce(
      (total, item) => total + (item.quantity ? item.price * item.quantity : 0),
      0
    );

    const handleCheckout = async () => {
      try {
        // Create an order in the backend
        const orderData = {
          userId: user._id,
          items: cartItems.map((item) => ({
            itemId: item._id,
            quantity: item.quantity, // Include the updated quantity
            price: item.price,
          })),
          totalAmount: calculateTotalPrice(),
        };
    
        const response = await createOrder(orderData);
      console.log(response,"response in clientside");
        // Open Razorpay payment interface
        const options = {
          key: 'rzp_test_G6ohIQO7ZOHmVY', // Replace with your Razorpay key
          amount: response.data.totalAmount * 100, // Amount in paise
          currency: 'INR',
          name: 'Your Website Name',
          description: 'Order Payment',
          order_id: response.data.orderId,
          handler: async (paymentResult) => {
            try {          
              // Process the payment (e.g., save details to the database)
              const paymentData = {
                paymentId: paymentResult.razorpay_payment_id,
                orderId: paymentResult.razorpay_order_id,
                signature: paymentResult.razorpay_signature,
                status: 'Completed',  // You can change this based on your logic
                amount: response.data.totalAmount * 100,
                userId: user._id,       // User ID associated with the payment
              };
             console.log(paymentData,"outputting paymentData");
              const data = await verifyPaymentWithServer(paymentData);
              console.log(data,"data in frontend");
              // const responseData = await response.json();
              // if (responseData.status === 'success') {
              //   alert('Payment successful');
              // } else {
              //   alert('Payment verification failed');
              // }
            navigate("/orderHistory");
            } catch (error) {
              console.error('Error during payment handling:', error);
              alert('Payment processing failed, please try again later');
            }
          }
          ,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contact,
          },
          theme: {
            color: '#3399cc',
          },
        };
        console.log(options);
        // Use window.Razorpay since it's globally available
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error('Razorpay is not loaded correctly');
        }


      } catch (err) {
        console.error('Failed to proceed to checkout:', err);
        alert('Failed to proceed to checkout');
      }
    };
    
  useEffect(() => {
    handleFetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg overflow-y-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center p-4 bg-pure-greys-100 rounded-lg">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="ml-6 flex-grow max-w-40">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">Price: INR {item.price}</p>
              </div>
              <div className="flex flex-col items-start">
                <label className="text-gray-800">Quantity:</label>
                <select
  value={item.quantity || '1'} // Default value is '1' if empty
  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
  className="w-16 p-2 border border-pure-greys-400 rounded-lg"
>
  {/* Render options from 1 to 10 */}
  {[...Array(10).keys()].map((i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>

              </div>
              <p className="text-gray-800 font-semibold ml-6">
                Total: INR {item.quantity * item.price}
              </p>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="text-red-600 font-semibold border border-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6 flex items-center border-t pt-4">
            <h3 className="text-xl font-semibold text-gray-800">Total Price:</h3>
            <p className="text-xl font-bold text-gray-800">INR {calculateTotalPrice()}</p>
          </div>
          <button
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty!</p>
      )}
    </div>
  );
};

export default Cart;
