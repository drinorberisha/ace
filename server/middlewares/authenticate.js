// middlewares/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import your User model

const authenticate = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and attach it to the request object
    const user = await User.findById(decoded.id).select('-password');  // Exclude password field

    if (!user) {
      console.log('User not found');  // Debug log
      return res.status(401).json({ message: 'User not found' });
    }
    console.log('User found:', user);  // Debug log
    req.user = user;  // Now req.user contains the entire user object, including the role

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.log('Error in authentication:', err);  // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;
