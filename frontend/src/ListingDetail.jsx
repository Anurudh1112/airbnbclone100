import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListingDetail({ listing, onBack }) {
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [bookingMsg, setBookingMsg] = useState({ text: '', isError: false });
  
  // 📊 Module 4 Review Aggregation State Engines
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 5.0, totalReviews: 0 });
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewMsg, setReviewMsg] = useState('');

  // Fetch reviews and dynamic aggregation stats from the backend
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${listing._id}`);
      setReviews(response.data.reviews || []);
      setReviewStats({
        averageRating: response.data.averageRating || 5.0,
        totalReviews: response.data.totalReviews || 0
      });
    } catch (error) {
      console.error('Error gathering aggregated reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listing._id]);

  const calculateTotalNights = () => {
    if (!dates.startDate || !dates.endDate) return 0;
    const diff = Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg({ text: '', isError: false });
    const token = localStorage.getItem('token');
    if (!token) return setBookingMsg({ text: '❌ You must log in to make a reservation!', isError: true });
    
    const nights = calculateTotalNights();
    if (nights === 0) return setBookingMsg({ text: '❌ Invalid check-out date range selected.', isError: true });

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        listingId: listing._id, 
        startDate: dates.startDate, 
        endDate: dates.endDate, 
        totalPrice: nights * listing.pricePerNight
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBookingMsg({ text: '🎉 Reservation confirmed successfully!', isError: false });
    } catch (err) {
      setBookingMsg({ text: err.response?.data?.message || 'Booking conflict detected!', isError: true });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    const token = localStorage.getItem('token');
    if (!token) return setReviewMsg('❌ You must log in to submit a review!');

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        listingId: listing._id, 
        rating: Number(newRating), 
        comment: newComment
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setReviewMsg('🎉 Review posted live!');
      setNewComment('');
      setNewRating(5);
      fetchReviews(); // Recalculate average rating instantly on screen
    } catch (error) {
      setReviewMsg(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
      <button onClick={onBack} style={{ border: '1px solid #222', background: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}>← Back to Explorer Feed</button>
      
      <h2>{listing.title}</h2>
      <p style={{ color: '#6b7280', margin: '4px 0 20px 0' }}>📍 {listing.location} • ⭐ {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)</p>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Left Side Content Column */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <div style={{ width: '100%', height: '380px', borderRadius: '12px', overflow: 'hidden', background: '#f3f4f6', marginBottom: '25px' }}>
            <img src={Array.isArray(listing.images) ? listing.images[0] : listing.images} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3>Description</h3>
          <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{listing.description || 'No description provided.'}</p>
          
          {/* 💬 GUEST REVIEWS SYSTEM PANEL */}
          <div style={{ marginTop: '40px', borderTop: '1px solid #e0e0e0', paddingTop: '30px' }}>
            <h3>Guest Feedback & Rating Logs</h3>
            
            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #ebebeb' }}>
              <h4>Leave a Review</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: '600', fontSize: '14px' }}>Rating:</label>
                <select value={newRating} onChange={(e) => setNewRating(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} required placeholder="Share your experience staying here..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', height: '65px', boxSizing: 'border-box', fontFamily: 'sans-serif' }} />
              <button type="submit" style={{ backgroundColor: '#ff385c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start' }}>Post Review</button>
              {reviewMsg && <p style={{ fontSize: '14px', fontWeight: '600', color: '#ff385c', margin: 0 }}>{reviewMsg}</p>}
            </form>

            {/* Render Reviews List */}
            {reviews.length === 0 ? <p style={{ color: '#717171' }}>No verified reviews left by previous travelers yet.</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '14px' }}>👤 {rev.author?.name || 'Verified Traveler'}</strong>
                      <span style={{ color: '#ff385c', fontWeight: 'bold' }}>⭐ {rev.rating}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.4' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Stay Reservation Card Widget */}
        <div style={{ flex: '1', minWidth: '300px', border: '1px solid #e0e0e0', padding: '24px', borderRadius: '16px', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', height: 'fit-content', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>\${listing.pricePerNight}</span>
            <span style={{ color: '#6b7280' }}>night</span>
          </div>
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            <input type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            {calculateTotalNights() > 0 && (
              <div style={{ margin: '10px 0', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                  <span>Total Est:</span>
                  <span>\${listing.pricePerNight * calculateTotalNights()}</span>
                </div>
              </div>
            )}
            <button type="submit" style={{ backgroundColor: '#ff385c', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Reserve Stay</button>
          </form>
          {bookingMsg.text && <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600', textAlign: 'center', color: bookingMsg.isError ? '#ef4444' : '#10b981' }}>{bookingMsg.text}</p>}
        </div>
      </div>
    </div>
  );
}
