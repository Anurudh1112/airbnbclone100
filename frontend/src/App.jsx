import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingsGrid from './ListingsGrid';
import MapView from './MapView';
import AuthPage from './AuthPage';
import ListingDetail from './ListingDetail';
import HostDashboard from './HostDashboard';

export default function App() {
  const [view, setView] = useState('explore'); 
  const [allListings, setAllListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch real property listings directly from your live server database endpoints
  const fetchGlobalListings = async () => {
    try {
      const response = await axios.get('https://airbnbclone100.onrender.com/api/listings');
      setAllListings(response.data || []);
    } catch (error) {
      console.error('Error fetching data logs from server cluster:', error);
    }
  };

  useEffect(() => {
    fetchGlobalListings();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setLoggedInUser(userObj);
      if (userObj.role === 'host') setView('host-dash');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setView(user.role === 'host' ? 'host-dash' : 'explore');
    fetchGlobalListings();
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    setView('explore');
    alert('Logged out safely! 👋');
  };

  const handleSelectListing = (listing) => {
    setSelectedListing(listing);
    setView('details');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {/* 🧭 Platform Navigation Navbar Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: '1px solid #ebebeb' }}>
        <div onClick={() => setView(loggedInUser?.role === 'host' ? 'host-dash' : 'explore')} style={{ color: '#ff385c', fontWeight: 'bold', fontSize: '24px', cursor: 'pointer' }}>
          airbnb
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {loggedInUser?.role !== 'host' && (
            <span onClick={() => { setView('explore'); fetchGlobalListings(); }} style={{ fontSize: '14px', fontWeight: '600', color: '#222', cursor: 'pointer' }}>
              Explore Stays
            </span>
          )}
          
          {loggedInUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>
                {loggedInUser.role === 'host' ? '💼 Host Portal:' : '🧳 Traveler:'} {loggedInUser.name}
              </span>
              <span onClick={handleLogout} style={{ fontSize: '14px', fontWeight: '600', color: '#ff385c', cursor: 'pointer', border: '1px solid #ff385c', padding: '6px 12px', borderRadius: '6px' }}>
                Logout
              </span>
            </div>
          ) : (
            <span onClick={() => setView('auth')} style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#ff385c', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
              Sign In / Register
            </span>
          )}
        </div>
      </header>

      {/* 🏠 DYNAMIC VIEW ROUTER CHANNEL */}
      <main style={{ padding: '30px 0' }}>
        {view === 'explore' && (
          <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ color: '#222', marginBottom: '20px' }}>Find Your Next Adventure</h2>
            
            {/* Real geographical discovery tracking map layout panel */}
            <MapView listings={allListings} onSelectListing={handleSelectListing} />
            
            <ListingsGrid onSelectListing={handleSelectListing} />
          </div>
        )}

        {view === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}

        {view === 'details' && selectedListing && (
          <ListingDetail listing={selectedListing} onBack={() => setView('explore')} />
        )}

        {view === 'host-dash' && loggedInUser?.role === 'host' && (
          <HostDashboard />
        )}
      </main>
    </div>
  );
}
