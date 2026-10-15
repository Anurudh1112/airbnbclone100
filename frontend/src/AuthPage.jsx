import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'guest' });
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await axios.post(`https://airbnbclone100.onrender.com${endpoint}`, isLogin 
        ? { email: formData.email, password: formData.password }
        : formData
      );
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage({ text: isLogin ? '🎉 Welcome back!' : '🎉 Account created successfully!', isError: false });
      if (onLoginSuccess) onLoginSuccess(res.data.user);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Authentication failed!', isError: true });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', backgroundColor: '#ffffff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#222222' }}>{isLogin ? 'Log In to Airbnb' : 'Create an Account'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!isLogin && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Minimum 6 characters" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        {!isLogin && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>
              <option value="guest">🧳 Traveler / Guest</option>
              <option value="host">🏠 Property Host</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ backgroundColor: '#ff385c', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
          {isLogin ? 'Continue' : 'Sign Up'}
        </button>
      </form>

      {message.text && (
        <p style={{ textAlign: 'center', marginTop: '14px', fontWeight: '600', color: message.isError ? '#ef4444' : '#10b981' }}>{message.text}</p>
      )}

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        {isLogin ? "New to our platform? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#ff385c', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Create an account' : 'Sign in here'}
        </span>
      </p>
    </div>
  );
}
