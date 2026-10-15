const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const auth = require('../middleware/auth'); // Secure authentication gateway

// Route: POST /api/bookings (PROTECTED - Must be logged in to book a stay)
router.post('/', auth, createBooking);

// Route: GET /api/bookings/my-trips (PROTECTED - Must be logged in to view your trips)
router.get('/my-trips', auth, getUserBookings);

module.exports = router;
