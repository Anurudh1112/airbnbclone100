import React, { useState } from 'react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  // Toggle state: true = Log In view, false = Sign Up view
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Input field form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest'); // New state variable tracking role options (defaults to guest)
  const [errorMessage, setErrorMessage] = useState('');

  // If the popup modal is closed, don't render anything on screen
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Dynamically choose the correct backend API endpoint
    const url = isLoginView 
      ? 'https://airbnbclone100.onrender.com/api/auth/login' 
      : 'https://airbnbclone100.onrender.com/api/auth/register';

    // Pack the data to send to Node.js/MongoDB
    const payload = isLoginView 
      ? { email, password } 
      : { name, email, password, role }; // Sends your dynamic selector dropdown choice cleanly

    try {
      const response = await axios.post(url, payload);
      
      // Save secure login credentials so the browser remembers the user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert(isLoginView ? '🎉 Logged in successfully!' : '🎉 Account created successfully!');
      onLoginSuccess(response.data.user);
      onClose(); // Close popup window on success
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Authentication failed. Please try again!');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative', fontFamily: 'sans-serif' }}>
        
        {/* Close button X */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        
        <h2 style={{ margin: '0 0 20px 0', color: '#222222', textAlign: 'center', fontWeight: 'bold' }}>
          {isLoginView ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLoginView && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', color: '#4b5563' }}>FULL NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', color: '#4b5563' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', color: '#4b5563' }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>

          {/* Dynamic Dropdown Box Selector—only appears when signing up */}
          {!isLoginView && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', color: '#4b5563' }}>I WANT TO JOIN AS A:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                <option value="guest">🧳 Guest (I want to discover & book stays)</option>
                <option value="host">🏠 Host (I want to list my rental spaces)</option>
              </select>
            </div>
          )}

          <button type="submit" style={{ backgroundColor: '#ff385c', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
            {isLoginView ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {errorMessage && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '10px', fontWeight: '600' }}>{errorMessage}</p>}

        {/* Dynamic toggle switcher at the bottom */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          {isLoginView ? "New to Airbnb? " : "Already have an account? "}
          <span onClick={() => { setIsLoginView(!isLoginView); setErrorMessage(''); }} style={{ color: '#ff385c', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLoginView ? 'Create an account' : 'Sign in here'}
          </span>
        </p>
      </div>
    </div>
  );
}
