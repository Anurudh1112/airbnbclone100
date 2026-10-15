const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed' // Ensures matching queries return valid rows instantly
  }
}, { timestamps: true });

// Explicitly forces Mongoose to target the "bookings" table inside your airbnb folder directory
module.exports = mongoose.model('Booking', BookingSchema, 'bookings');
