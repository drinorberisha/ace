const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerUser, loginUser, getStudentProfile, updateStudentProfile, getProfessorProfile, updateProfessorProfile,
   changePassword, requestPasswordReset,verifyPasswordResetOTP, resetPassword} = require('../controllers/userController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');

// const auth = require('./auth');

// router.post('/create-course', auth(['professor', 'admin']), createCourse);

// Register a new user
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// Login user and get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

// Get user profile (You can implement this later)
router.get('/profile', (req, res) => {
  // TODO: Implement user profile retrieval
});

// Get student profile
router.get('/student-profile', authenticate, getStudentProfile);

// Update student profile
router.put('/student-profile', authenticate, updateStudentProfile);

// Get professor profile
router.get('/professor-profile', authenticate, getProfessorProfile);

// Update professor profile
router.put('/professor-profile', authenticate, updateProfessorProfile);

router.post('/change-password', authenticate, changePassword)

// Request OTP
router.post('/forgot-password', requestPasswordReset);

// Verify OTP
router.post('/verify-otp',verifyPasswordResetOTP);
router.post('/reset-password', resetPassword);


module.exports = router;
