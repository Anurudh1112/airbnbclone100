const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  location: { type: String, required: true },
  
  // Coordinates are crucial for the Module 4 Maps API integration!
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  
  images: [{ type: String }],    // Array of image URLs for the listing grid layout
  amenities: [{ type: String }], // Array of strings (e.g., ["Wifi", "Pool", "AC"])
  
  // This links the listing directly to the User who created it (The Host)
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
