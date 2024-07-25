const User = require('../models/User');

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Fetch the user from the database
      const user = await User.findById(req.user.id); // Note: use req.user.id instead of req.user
      console.log("User role is: ", user.role); // Note: use user.role instead of req.user.role

      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user has one of the required roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = authorize;
