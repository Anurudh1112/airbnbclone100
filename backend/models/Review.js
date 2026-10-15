const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // Connects the review to the specific rental property
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  
  // Connects the review to the guest user who wrote it
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Rating must be a number between 1 and 5 stars
  rating: { type: Number, required: true, min: 1, max: 5 },
  
  comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
