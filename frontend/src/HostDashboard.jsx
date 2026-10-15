import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HostDashboard() {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });
  const [selectedFile, setSelectedFile] = useState(null); 
  const [formData, setFormData] = useState({ title: '', description: '', pricePerNight: '', location: '', lat: '', lng: '', amenities: '' });

  const fetchHostListings = async () => {
    try {
      const response = await axios.get('https://airbnbclone100.onrender.com/api/listings');
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return;
      const user = JSON.parse(savedUser);
      const hostedProperties = response.data.filter(item => item.host === user.id || item.host?._id === user.id || item.host === user._id);
      setMyListings(hostedProperties);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchHostListings(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '⏳ Uploading property with custom coordinates...', isError: false });
    const token = localStorage.getItem('token');
    if (!token) return setStatusMsg({ text: '❌ Please log in again.', isError: true });
    if (!selectedFile) return setStatusMsg({ text: '❌ Please select an image file!', isError: true });

    const dataStream = new FormData();
    dataStream.append('title', formData.title);
    dataStream.append('description', formData.description);
    dataStream.append('pricePerNight', formData.pricePerNight);
    dataStream.append('location', formData.location);
    dataStream.append('lat', formData.lat); // Sends custom Latitude entry
    dataStream.append('lng', formData.lng); // Sends custom Longitude entry
    dataStream.append('amenities', formData.amenities);
    dataStream.append('image', selectedFile); 

    try {
      await axios.post('https://airbnbclone100.onrender.com/api/listings', dataStream, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setStatusMsg({ text: '🎉 Listing successfully published with coordinates!', isError: false });
      setFormData({ title: '', description: '', pricePerNight: '', location: '', lat: '', lng: '', amenities: '' });
      setSelectedFile(null);
      e.target.reset(); 
      fetchHostListings();
    } catch (error) {
      setStatusMsg({ text: error.response?.data?.message || 'Failed to publish listing.', isError: true });
    }
  };

  return (
    <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Host Control Dashboard</h2>
      <p style={{ color: '#717171' }}>Enter manual map numbers and upload image files straight from your computer system.</p>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* LEFT COLUMN: LIST A NEW SPACE FORM */}
        <div style={{ flex: '1', minWidth: '320px', background: '#f9fafb', padding: '25px', borderRadius: '12px', border: '1px solid #ebebeb' }}>
          <h3>List a New Space</h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Property Title" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}/>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="Description" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', height: '60px', boxSizing: 'border-box' }}/>
            
            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4b5563', marginBottom: '5px' }}>CHOOSE PHOTO FILE</label>
              <input type="file" accept="image/*" onChange={handleFileChange} required />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} required placeholder="Price / Night (\$)" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1, boxSizing: 'border-box' }}/>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="Location Name" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1, boxSizing: 'border-box' }}/>
            </div>

            {/* 🗺️ MANUAL LATITUDE AND LONGITUDE BOXES ARE BACK */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} required placeholder="Latitude (e.g. 28.6139)" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1, boxSizing: 'border-box' }}/>
              <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} required placeholder="Longitude (e.g. 77.2090)" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1, boxSizing: 'border-box' }}/>
            </div>

            <input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Amenities (comma separated: Wifi, AC)" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}/>
            <button type="submit" style={{ backgroundColor: '#ff385c', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Publish Listing</button>
          </form>
          {statusMsg.text && <p style={{ textAlign: 'center', marginTop: '14px', fontWeight: '600', color: statusMsg.isError ? '#ef4444' : '#10b981' }}>{statusMsg.text}</p>}
        </div>

        {/* RIGHT COLUMN: REFRESHED LISTINGS FEED */}
        <div style={{ flex: '1.5', minWidth: '360px' }}>
          <h3>Your Live Properties ({myListings.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!loading && myListings.map((list) => (
              <div key={list._id} style={{ display: 'flex', gap: '15px', border: '1px solid #ebebeb', padding: '15px', borderRadius: '12px', alignItems: 'center', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '110px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={Array.isArray(list.images) ? list.images[0] : list.images} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://unsplash.com"; }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{list.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#717171' }}>📍 {list.location} • <strong>\${list.pricePerNight}</strong> / night</p>
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>Live on Cloud</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
