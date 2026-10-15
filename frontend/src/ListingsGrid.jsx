import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListingsGrid({ onSelectListing }) {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://airbnbclone100.onrender.com/api/listings');
        if (response.data && response.data.length > 0) {
          setListings(response.data);
        } else {
          setListings(getFallbackData());
        }
        setLoading(false);
      } catch (error) {
        console.error('Backend offline, using backup data:', error);
        setListings(getFallbackData());
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) =>
    (listing.location && listing.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (listing.title && listing.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 🔍 Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '12px 20px', borderRadius: '30px', maxWidth: '500px', margin: '0 auto 40px auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <span style={{ marginRight: '12px', fontSize: '18px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '16px', color: '#222222' }}
        />
      </div>

      {loading && <h3 style={{ textAlign: 'center', color: '#6b7280' }}>Loading properties...</h3>}
      
      {!loading && filteredListings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <h3>No properties found matching your search.</h3>
        </div>
      )}

      {/* 🏠 Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {filteredListings.map((listing) => (
          <div 
            key={listing._id} 
            onClick={() => onSelectListing && onSelectListing(listing)} // Opens the detailed backend-wired page
            style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ebebeb', paddingBottom: '10px' }}
          >
            <div style={{ width: '100%', height: '200px', background: '#e5e7eb', overflow: 'hidden' }}>
              <img 
                src={Array.isArray(listing.images) ? listing.images[0] : listing.images} 
                alt={listing.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = "https://unsplash.com"; }}
              />
            </div>
            <div style={{ padding: '12px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '15px' }}>
                <span style={{ color: '#222222' }}>{listing.title}</span>
                <span>⭐ 4.9</span>
              </div>
              <p style={{ margin: '4px 0', color: '#717171', fontSize: '14px' }}>📍 {listing.location}</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#222222' }}>
                <strong>${listing.pricePerNight}</strong> night
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getFallbackData() {
  return [
    { _id: "fallback1", title: "Luxury Beachfront Villa", location: "Bali, Indonesia", pricePerNight: 145, images: "https://unsplash.com" },
    { _id: "fallback2", title: "Modern Downtown Loft", location: "New York, USA", pricePerNight: 210, images: "https://unsplash.com" }
  ];
}
