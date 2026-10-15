const Review = require('../models/Review');
const Listing = require('../models/Listing');

// 1. ADD A NEW REVIEW & RATING
exports.addReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    // Check if the property listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    // Create the review instance
    const newReview = new Review({
      listing: listingId,
      author: req.user.id, // Securely grabbed from JWT authentication middleware
      rating: Number(rating),
      comment
    });

    await newReview.save();
    res.status(201).json({ message: '🎉 Review added successfully!', newReview });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error while adding review');
  }
};

// 2. GET REVIEWS FOR A SPECIFIC LISTING WITH LIVE AGGREGATION CALCULATOR
exports.getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // 📊 AGGREGATION LOGIC: Calculate average rating dynamically
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalStars / reviews.length).toFixed(2); // Round off decimal places nicely
    }

    res.json({
      totalReviews: reviews.length,
      averageRating: Number(averageRating) || 5.0, // Default to a solid 5.0 stars if empty
      reviews
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching aggregated reviews');
  }
};
