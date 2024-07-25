import React, { useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/router';
import { getAllCourses, getEnrolledCourses, getCreatedCourses,getCourseById, editCourse} from '../../utils/api'; 
import Navigation from '@/components/common/navigation';
import UserContext from '@/context/userContext';
import Link from 'next/link';
import Newnav from '@/components/common/newnav';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';

const Professor = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [coursesDetails, setCoursesDetails] = useState([]);
    const [selectedId, setSelectedId] = useState(null);


  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isProfessor, setIsProfessor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
    const {user} =  useContext(UserContext);

    const fetchCourseDetails = async (courseId, token) => {
      console.log(courseId);
      return await getCourseById(courseId, token);
    };

    const checkAccessAndRedirect = () => {
      const currentIsLoggedIn = !!localStorage.getItem("token");
      const currentRole = localStorage.getItem("userRole");
    
      if (!currentIsLoggedIn) {
        toast.error("You do not have access to this page. Please login");
        router.push('/');
        return;
      }
    
      const isCurrentProfessor = currentRole === "professor";
      const isCurrentAdmin = currentRole === "admin";
    
      if (currentIsLoggedIn && !(isCurrentProfessor || isCurrentAdmin)) {
        toast.error("You do not have access to this page.");
        router.push('/');
      }
    };
    


    useEffect(() => {
      const token = localStorage.getItem("token");

      const userROLE  = localStorage.getItem("userRole");
      setIsLoggedIn(!!token); 

    if(userROLE === "professor"){
      setIsProfessor(true);
      setIsAdmin(false);
    }else if(userROLE === "admin"){
      setIsProfessor(false);
      setIsAdmin(true);
    }else{
      setIsProfessor(false);
      setIsAdmin(false);
    }
    console.log(`isLoggedIn: ${isLoggedIn}, isProfessor: ${isProfessor}, isAdmin: ${isAdmin}`);
    checkAccessAndRedirect();

  }, [router]);
    
    useEffect(() => {

        const token = localStorage.getItem('token');
        const fetchCreatedCourses = async () => {
          try {
            setIsLoading(true);

            const response = await getCreatedCourses(token);
            setCourses(response.coursesCreated);
            console.log('Courses Created:', courses);
          } catch (error) {
            console.error("Failed to fetch created courses:", error);
          }
          setIsLoading(false);

        };
        fetchCreatedCourses();
      },[user]);


        useEffect(() => {
          const token = localStorage.getItem('token');
          const fetchCreatedCourseDetails = async () => {
      
           try {
              const courseDetailsPromises = courses.map(courseId =>
                fetchCourseDetails(courseId, token)
              );
      
              const fetchedCreatedCourses = await Promise.all(courseDetailsPromises);
              setCoursesDetails(fetchedCreatedCourses);
            } catch (error) {
              console.error("Failed to fetch course details:", error);
            }
          };
      
          if (courses.length > 0) {
            fetchCreatedCourseDetails();
          }
        }, [courses]); 
    
        const handleCourseClick = (id) => {
          setSelectedId(id);
        };


        const handleSubmitEditCourse = async (e, courseId) => {
          e.preventDefault();
          // Find the course in coursesDetails
          const courseToUpdate = coursesDetails.find(course => course._id === courseId);
        
          // Prepare the data for the API call
          const updatedCourseData = {
            title: courseToUpdate.title,
            description: courseToUpdate.description,
            // Add other fields as needed
          };
        
          // Make the API call to update the course
          try {
            const token = localStorage.getItem('token');
            const response = await editCourse(courseId, token,updatedCourseData);
            console.log('Course updated:', response);
            // Optionally refresh the course details or handle the UI update
          } catch (error) {
            console.error("Failed to update course:", error);
          }
        };
        

        const handleCourseChange = (e, courseId, field) => {
          // Find and update the course in coursesDetails
          const updatedCourses = coursesDetails.map(course => {
            if (course._id === courseId) {
              return { ...course, [field]: e.target.value };
            }
            return course;
          });
          setCoursesDetails(updatedCourses);
        };
        

        
  return (
    <div>
          <ToastContainer />
      <Newnav />

    {user && (
      <div className="ml-4 text-black dark:text-white">
        Welcome to THE PROFESSOR DASHBOARD  $-ACE-$  {user.username} <br/>
      </div>
    )}
    {/* Other buttons here */}

    <a href='professor/AddCourse'><button>Add Course</button></a>


    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Courses Created:</h3>
        <ul>
        <div className="courses-grid">
          {coursesDetails && coursesDetails.map(course => (
            <motion.div key={course._id} layoutId={course._id}  className="mb-4">
              <div className="course-card bg-white dark:bg-gray-800 shadow-md rounded p-4">
                <motion.h4 className='text-gray-900 dark:text-gray-100'>{course.title}</motion.h4>
                <motion.p className='text-gray-600 dark:text-gray-300'>{course.description}</motion.p>
                {/* hala dettaje tkurseve */}
                <a href={`/courses/${course._id}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline dark:text-blue-300">Go to Course</a>
                <motion.button onClick={() => handleCourseClick(course._id)}>EDIT</motion.button>
              </div>
            </motion.div>
          ))}
          </div>
          <AnimatePresence>
  {selectedId && (
    coursesDetails.filter(course => course._id === selectedId).map(course => (
      <motion.div key={course._id} layoutId={selectedId} className="detailed-course-container border-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <form onSubmit={(e) => handleSubmitEditCourse(e, course._id)}>
          <label>Title:</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => handleCourseChange(e, course._id, 'title')}
          />
          <label>Description:</label>
          <textarea
            value={course.description}
            onChange={(e) => handleCourseChange(e, course._id, 'description')}
          />
          {/* Add other fields as necessary */}
          <button type="submit">Submit Changes</button>
        </form>
        <motion.button onClick={() => handleCourseClick(null)}>Close</motion.button>
      </motion.div>
    ))
  )}
</AnimatePresence>

        </ul>
      </div>
    )}
  </div>
);
};
export default Professor;
