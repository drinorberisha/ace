
const Course = require('../models/Course');
const User = require('../models/User');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');


// @desc    Create a new course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
    console.log("Request Body:", req.body);  
  
    try {
      const newCourse = new Course(req.body);
      const savedCourse = await newCourse.save();

      const creatorId = savedCourse.createdBy;
      if (creatorId) {
        const user = await User.findById(creatorId);
        if (user) {
          user.coursesCreated.push(savedCourse._id); // Add the new course ID to coursesCreated array
          await user.save();
        }
      }
  
      console.log("Saved Course:", savedCourse); 
  
      return res.status(201).json({ course: savedCourse });
    } catch (error) {
      console.log("Error:", error);  // Log any errors
      return res.status(500).json({ error: 'An error occurred while creating the course' });
    }
  };

// @desc    Get all courses
// @route   GET /api/courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get a specific course by ID
// @route   GET /api/courses/:courseId
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.editCourse =  async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, language, lectureNotes, quizzes, videos, category } = req.body;

  try {
      const course = await Course.findById(courseId);

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      // Only update fields that are provided in the request body
      if (title) course.title = title;
      if (description) course.description = description;
      if (price) course.price = price;
      if (language) course.language = language;
      if (lectureNotes) course.lectureNotes = lectureNotes;
      if (quizzes) course.quizzes = quizzes;
      if (videos) course.videos = videos;
      if (category) course.category = category;

      await course.save();

      res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
  }
};


// @desc    Delete a course by ID
// @route   DELETE /api/courses/:courseId
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Optional: Check if the user is authorized to delete the course
        // if (course.createdBy.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }
        await Course.findByIdAndDelete(req.params.courseId);

        res.status(200).json({ msg: 'Course deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getCourseContent = async (req, res) => {
    try {
      const courseId = req.params.courseId;
  
      // Find the course by ID
      const course = await Course.findById(courseId)
        .populate('lectureNotes')
        .populate('quizzes')
        .populate('videos');
  
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      res.json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // controllers/courseController.js
  exports.addLectureNote = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const { title, content } = req.body;
      const newNote = { title, content };
  
      course.lectureNotes.push(newNote);
      await course.save();
  
      res.status(201).json({ message: 'Lecture note added successfully', newNote });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }];
  
  exports.editLectureNote = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const note = course.lectureNotes.id(req.params.noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      note.set(req.body);
      await course.save();
  
      res.status(200).json({ message: 'Lecture note edited successfully', note });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }];

  exports.deleteLectureNote = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const note = course.lectureNotes.id(req.params.noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      note.remove();
      await course.save();
  
      res.status(200).json({ message: 'Lecture note deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }];

  exports.getLectureNotes = [authenticate, async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json({ lectureNotes: course.lectureNotes });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }];

  // Add a new quiz to a course
exports.addQuiz = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { question, options, correctAnswer } = req.body;
    const newQuiz = { question, options, correctAnswer };
    course.quizzes.push(newQuiz);
    await course.save();
  
    res.status(201).json({ message: 'Lecture note added successfully', newNote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
  }];
  
  // Edit a quiz in a course
  exports.editQuiz = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = course.quizzes.id(req.params.quizId);
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
    quiz.set(req.body);
    await course.save();
  
    res.status(200).json({ message: 'Lecture note edited successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
  }];
  
  // Delete a quiz from a course
  exports.deleteQuiz = [authenticate, authorize('professor', 'admin'), async (req, res) => {
    try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = course.quizzes.id(req.params.quizId);
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
    quiz.remove();
    await course.save();
  
      res.status(200).json({ message: 'Lecture note deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }];
  
  // Get all quizzes from a course
  exports.getQuizzes = [authenticate, async (req, res) => {
    try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ quizzes: course.quizzes });
} catch (error) {
  res.status(500).json({ message: 'Server error', error });
}
  }];



exports.enrollStudent = async (req, res) => {
    try {
      // Find the course by ID
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      // Find the student by ID
      const student = await User.findById(req.user.id);
      if (!student || student.role !== 'student') {
        return res.status(404).json({ msg: 'Student not found or not authorized' });
      }
  
      // Check if the student is already enrolled
     // Check if the student is already enrolled
if (course.enrolledStudents.map(id => id.toString()).includes(req.user.id.toString())) {
    return res.status(400).json({ msg: 'Already enrolled' });
  }
  
  
      // Enroll the student in the course
      course.enrolledStudents.push(req.user.id);
  
      // Update the student's enrolled courses
      student.enrolledCourses.push(req.params.courseId);
      await course.save();
      await student.save();
      res.status(200).json({ msg: 'Successfully enrolled', course });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  exports.addVideo = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      // Check if the user is authorized to add videos
      if (req.user.role !== 'professor' && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      const { title, url } = req.body;
  
      const newVideo = {
        title,
        url
      };
  
      course.videos.push(newVideo);
  
      await course.save();
  
      res.status(200).json({ msg: 'Video added successfully', newVideo });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

 

  exports.editVideo = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      // Authorization check
      if (req.user.role !== 'professor' && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      const videoId = req.params.videoId;
      const { title, url } = req.body;
  
      const video = course.videos.id(videoId);
      if (!video) {
        return res.status(404).json({ msg: 'Video not found' });
      }
  
      video.title = title;
      video.url = url;
  
      await course.save();
  
      res.status(200).json({ msg: 'Video updated', course });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  exports.deleteVideo = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      // Check if the user is authorized to delete videos
      if (req.user.role !== 'professor' && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      const videoId = req.params.videoId;
  
      const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
  
      if (videoIndex === -1) {
        return res.status(404).json({ msg: 'Video not found' });
      }
  
      course.videos.splice(videoIndex, 1);
  
      await course.save();
  
      res.status(200).json({ msg: 'Video deleted successfully' });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  exports.getVideos = async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }
  
      // Authorization check for enrolled students, professors, and admins
      if (req.user.role === 'student' && !course.enrolledStudents.includes(req.user.id)) {
        return res.status(401).json({ msg: 'Not enrolled in this course' });
      }
  
      res.status(200).json({ videos: course.videos });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


  exports.searchCourses = async (req, res) => {
    try {
      const { title, price, createdBy, language } = req.query;
      let query = {};
  
      if (title) query.title = new RegExp(title, 'i');
      if (price) query.price = price;
      if (createdBy) query.createdBy = createdBy;
      if (language) query.language = new RegExp(language, 'i');
  
      const courses = await Course.find(query);
  
      res.status(200).json({ courses });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  
  