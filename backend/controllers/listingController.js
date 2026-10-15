const Listing = require('../models/Listing');

// 1. CREATE A NEW LISTING (Captures Explicit Form Coordinates)
const createListing = async (req, res) => {
  try {
    const { title, description, pricePerNight, location, lat, lng, amenities } = req.body;

    // Convert text strings from FormData safely into floating numbers for Leaflet
    const finalLat = parseFloat(lat);
    const finalLng = parseFloat(lng);

    if (isNaN(finalLat) || isNaN(finalLng)) {
      return res.status(400).json({ message: 'Latitude and Longitude must be valid numerical coordinate values!' });
    }

    const newListing = new Listing({
      title,
      description,
      pricePerNight: Number(pricePerNight),
      location,
      coordinates: { lat: finalLat, lng: finalLng }, // Saves custom coordinates directly to your schema object
      images: req.file ? [req.file.path] : ["https://unsplash.com"],
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      host: req.user.id
    });

    const listing = await newListing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error('Mongoose Listing Coordinate Write Error:', err.message);
    res.status(500).send('Server Error while establishing coordinates');
  }
};

// 2. GET ALL LISTINGS
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('host', 'name email');
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching listings');
  }
};

// 3. GET SINGLE LISTING BY ID
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found!' });
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching single listing');
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById
};
