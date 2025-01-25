const express = require('express');
const router = express.Router();
const { addTable,getTable,markBooked, unmarkBooked, checkSlotAvailability} = require('../../controllers/Restaurant/Table');
// const authenticate = require('../middleware/authenticate'); // Middleware to authenticate restaurant owners

// Route to add a table (restaurant owners only)
router.post('/add-table', addTable);
router.get('/getTables', getTable);
router.post('/markBooked', markBooked);
router.post('/unmarkBooked', unmarkBooked);
router.post('/checkSlotAvailability', checkSlotAvailability);
module.exports = router;