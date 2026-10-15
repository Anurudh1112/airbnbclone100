const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This will store securely hashed passwords
  role: { type: String, enum: ['guest', 'host'], default: 'guest' } // Essential for Module 4's Host vs Guest dashboard views
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields for your records

module.exports = mongoose.model('User', UserSchema);
