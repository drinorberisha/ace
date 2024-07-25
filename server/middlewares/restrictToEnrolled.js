// middlewares/restrictToEnrolled.js

const Course = require('../models/Course');
const User = require('../models/User');

const restrictToEnrolled = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If the user is an admin or professor, bypass the check
    if (['admin', 'professor'].includes(user.role)) {
      return next();
    }

    // Otherwise, check if the student is enrolled
    const course = await Course.findById(req.params.courseId);

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = restrictToEnrolled;
