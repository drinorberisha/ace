const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');


const authorize = require('../middlewares/authorize');
const authenticate = require ('../middlewares/authenticate');
const restrictToEnrolled = require('../middlewares/restrictToEnrolled');

// Create a new course
router.post('/', authenticate, authorize('professor','admin'), courseController.createCourse);
// Get all courses
router.get('/', authenticate , courseController.getAllCourses);

// Get a specific course by ID
router.get('/:courseId', authenticate, restrictToEnrolled, courseController.getCourseById);
router.put('/:courseId', authenticate,  authorize('professor','admin'), courseController.editCourse);
router.delete('/:courseId', authenticate, authorize('admin'), courseController.deleteCourse);


router.get('/:courseId/content', authenticate, restrictToEnrolled, courseController.getCourseContent);




// Delete specific course by ID


// routes/courseRoutes.js

router.post('/:courseId/lectureNotes', courseController.addLectureNote);
router.put('/:courseId/lectureNotes/:noteId', courseController.editLectureNote);
router.delete('/:courseId/lectureNotes/:noteId', courseController.deleteLectureNote);
router.get('/:courseId/lectureNotes', courseController.getLectureNotes);


// ... existing routes

// Quiz routes
router.post('/:courseId/quizzes', courseController.addQuiz);
router.put('/:courseId/quizzes/:quizId', courseController.editQuiz);
router.delete('/:courseId/quizzes/:quizId', courseController.deleteQuiz);
router.get('/:courseId/quizzes', courseController.getQuizzes);


// Video routes



router.post('/:courseId/addVideo', authenticate, authorize('professor', 'admin'), courseController.addVideo);
router.delete('/:courseId/deleteVideo/:videoId', authenticate, authorize('professor', 'admin'), courseController.deleteVideo);
router.post('/:courseId/editVideo/:videoId', authenticate, authorize('professor', 'admin'), courseController.editVideo);  // Using POST for edit as you mentioned
router.get('/:courseId/getVideos', authenticate, courseController.getVideos);





//enroll students to courses 

router.post('/:courseId/enroll', authenticate, courseController.enrollStudent);


// search courses
router.get('/search', courseController.searchCourses);






module.exports = router;
