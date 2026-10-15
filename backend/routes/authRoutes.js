const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');


// Route: POST /api/auth/register
// Action: Registers a brand new user account
router.post('/register', registerUser);

// Route: POST /api/auth/login
// Action: Verifies credentials and hands back a secure login token
router.post('/login', loginUser);

module.exports = router;
