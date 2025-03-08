const express = require('express');
const  {createOrder,getUserOrders} = require('../controllers/Order');

const router = express.Router();

router.post('/create-order', createOrder);
router.get('/getorders/:userId', getUserOrders);

module.exports = router;
