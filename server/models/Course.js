const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  language: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  lectureNotes: [
    {
      title: String,
      content: String,
    },
  ],
  quizzes: [
    {
      questions: String,
      options: [String],
      answer: String,
    },
  ],
  videos: [
    {
      title: String,
      url: String,
    },
  ],
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);

// me i shtu assignments edhe referenca per libra ose material tjeter si paper ose diqka



