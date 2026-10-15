const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('Authorization');

  // 2. Check if no token exists
  if (!token) {
    return res.status(401).json({ message: 'No security token found, authorization denied!' });
  }

  try {
    // 3. Extract the token value if it uses the standard 'Bearer <token>' format
    const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // 4. Verify the token using our hidden secret key from the .env file
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // 5. Attach the verified user details to the request object
    req.user = decoded.user;
    
    // 6. Move on to the next function (the API endpoint controller)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or has expired!' });
  }
};
