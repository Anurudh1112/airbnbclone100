const express = require('express');
const router = express.Router();
const { addReview, getListingReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth'); // Require login to post reviews

// Route: POST /api/reviews (PROTECTED - Must be logged in to leave feedback)
router.post('/', auth, addReview);

// Route: GET /api/reviews/:listingId (PUBLIC - Anyone can view ratings logs)
router.get('/:listingId', getListingReviews);

module.exports = router;
