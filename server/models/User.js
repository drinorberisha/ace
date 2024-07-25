const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'professor', 'admin'],
    default: 'student'
  },
  bio: {
    type: String,
    default: ''
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  completedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  expertise: {
    type: String,
    default: ''
  },
  coursesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  dateCreated: {
    type: Date,
    default: Date.now
},
  lastUpdated: Date,
  
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);


//rekomandime nbaz t profilit tstudentit ose diqka tjeter qe mujm me marr per baz
