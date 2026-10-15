const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node.js to use Google & Cloudflare DNS resolvers



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to allow your server to read incoming JSON data
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- ADD THIS LINE right below express.json()



app.use(express.json());


// Link your Authentication Network Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));





// Test Route to make sure the server works
app.get('/', (req, res) => {
  res.send('Airbnb Backend API is Running...');
});

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
