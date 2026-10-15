const express = require('express');
const router = express.Router();
const { createListing, getAllListings, getListingById } = require('../controllers/listingController');
const auth = require('../middleware/auth'); 
const upload = require('../config/cloudinary'); 

// Route: POST /api/listings (PROTECTED - Accepts a single system image upload file)
router.post('/', auth, upload.single('image'), createListing);

// Route: GET /api/listings (PUBLIC - Displays properties on map & grids)
router.get('/', getAllListings);

// Route: GET /api/listings/:id (PUBLIC)
router.get('/:id', getListingById);

module.exports = router;
