const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const nodemailer = require('nodemailer');
const OTPModel = require('../models/OTPModel');

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // Usually 465 for SSL
  secure: true, // True for 465, false for other ports
  auth: {
    user: 'info@drberisha.shop',
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const mailOptions = {
    from: 'info@drberisha.shop',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`
  };
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the OTP expiration (5 minutes from now)
    const otpExpiration = new Date(new Date().getTime() + 5 * 60000);

    // Create or update the OTP document for the user
    const otpData = await OTPModel.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        otp: otp,
        expirationTime: otpExpiration
      },
      { upsert: true, new: true }
    );

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent to email' });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
  
};

// Verify OTP
exports.verifyPasswordResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Retrieve user and OTP from the database
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpDocument = await OTPModel.findOne({ userId: user._id });
    if (!otpDocument || otpDocument.otp !== otp || new Date() > otpDocument.expirationTime) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // OTP is correct and not expired, generate a temporary token
    const tempToken = jwt.sign({ id: user._id, email: user.email, tempAccess: true }, process.env.JWT_SECRET, { expiresIn: '5m' });

    res.status(200).json({ message: 'OTP verified', tempToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};



// userController.js

exports.resetPassword = async (req, res) => {
  const  tempToken = req.body.tempToken;
  const newPassword =req.body.password;
  if (!tempToken || !newPassword) {
    return res.status(400).json({ message: 'Missing token or new password' });
  }

  try {
    // Verify the temporary token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    if (!decoded || !decoded.tempAccess) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


exports.registerUser = async (req, res) => {
  const { username, email, password, role, bio, expertise } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'student',
      bio,
      expertise  // Make sure this is included
    });

    console.log("User before save: ", user);  // Log the user object before saving

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token, user });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10h'
    });

    // Send response without the password
    console.log({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// userController.js

// ... existing code

exports.getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user.role !== 'student') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'student') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { bio, enrolledCourses, completedCourses } = req.body;
    
    if (bio) user.bio = bio;
    if (enrolledCourses) user.enrolledCourses = enrolledCourses;
    if (completedCourses) user.completedCourses = completedCourses;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.getProfessorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user.role !== 'professor') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfessorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'professor') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { expertise, coursesCreated } = req.body;
    
    if (expertise) user.expertise = expertise;
    if (coursesCreated) user.coursesCreated = coursesCreated;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields must be required" });
  }

  try {
      // Fetch the user by ID
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ error: "Invalid user" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
          return res.status(400).json({ error: "Your old password is incorrect" });
      }

      console.log("This is the new password before hashing", newPassword);

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password directly in the database
      await User.updateOne({ _id: id }, { password: hashedNewPassword });

      const updatedUser = await User.findById(id).select('-password'); // Exclude the password for security
      console.log("Updated user:", updatedUser);

      res.status(200).json({ success: "Password updated successfully" });

  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

