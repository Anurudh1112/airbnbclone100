const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// 1. CREATE A NEW BOOKING WITH OVERLAP VALIDATION & FIELD FALLBACKS
exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate, totalPrice } = req.body;

    // Convert incoming text string dates into real JavaScript Date objects safely
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);

    // Verify the listing actually exists in your MongoDB Atlas cluster first
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'The requested listing does not exist!' });
    }

    // 🔍 COMPLEX LOGIC: Check MongoDB for any overlapping bookings for this specific listing
    const conflictingBooking = await Booking.findOne({
      $or: [
        { listing: listingId },
        { listingId: listingId }
      ],
      status: 'confirmed',
      $or: [
        { startDate: { $gte: requestedStart, $lt: requestedEnd } },
        { endDate: { $gt: requestedStart, $lte: requestedEnd } },
        { startDate: { $lte: requestedStart }, endDate: { $gte: requestedEnd } }
      ]
    });

    // If an overlap is found, reject the booking immediately!
    if (conflictingBooking) {
      return res.status(400).json({ 
        message: 'Sorry, these dates are already booked! Please select another date range.' 
      });
    }

    // If no conflicts exist, proceed with creating the booking.
    // We map BOTH fields to ensure alignment with whichever strict validation schema rules are present.
    const newBooking = new Booking({
      listing: listingId,    // Maps standard structural key identifier properties
      listingId: listingId,  // Maps explicit schema array key values tracking indicators
      guest: req.user.id,    // Pulled securely from your JWT middleware token validation keys
      startDate: requestedStart,
      endDate: requestedEnd,
      totalPrice: Number(totalPrice)
    });

    const booking = await newBooking.save();
    res.status(201).json({ message: '🎉 Booking saved cleanly to MongoDB Atlas!', booking });
  } catch (err) {
    console.error('Mongoose Booking Write Error Log:', err.message);
    res.status(500).send('Server Error while establishing booking');
  }
};

// 2. GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('listing', 'title location pricePerNight images')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching user bookings');
  }
};
