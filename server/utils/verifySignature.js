const crypto = require('crypto');

// Razorpay Secret Key (ensure you use the secret key from your Razorpay account)
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;  // Replace with your actual Razorpay secret key

// Function to validate the Razorpay signature using a constant function
const verifyRazorpaySignature = (paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  // Create the string to be matched with Razorpay's signature
  const stringToCheck = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate the expected signature using your secret key and the stringToCheck
  const generatedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(stringToCheck)
    .digest('hex');

  // Compare the generated signature with the Razorpay signature
  return generatedSignature === razorpay_signature;
};

module.exports = { verifyRazorpaySignature };
