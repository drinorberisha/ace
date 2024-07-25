// components/user/UserProfile.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import UserContext from '@/context/userContext';
import { fetchUserProfile,getEnrolledCourses,getCourseById } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
// import { Card, Text, Button } from '@nextui-org/react';


const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchedEnrolledCoursesRef = useRef(false);
  const fetchedCourseDetailsRef = useRef(false);
  const fetchCourseDetails = async (courseId, token) => {
    console.log(courseId);
    return await getCourseById(courseId, token);
  };
  
  //USE EFFECT FOR FETCHING ENROLLED COURSES
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchEnrolledCourses = async () => {
      if (!fetchedEnrolledCoursesRef.current) {
      try {
        const response = await getEnrolledCourses(token);
        setEnrolledCourses(response.enrolledCourses);
        fetchedEnrolledCoursesRef.current = true;
        console.log('Enrolled Courses:', response.enrolledCourses);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    }
    };

    fetchEnrolledCourses();
  },[user]);



  // USE EFFECT FOR Fetching course details


  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAllCourseDetails = async () => {
      if (!fetchedCourseDetailsRef.current && enrolledCourses.length > 0) {
              try {
        const courseDetailsPromises = enrolledCourses.map(courseId =>
          fetchCourseDetails(courseId, token)
        );

        const courses = await Promise.all(courseDetailsPromises);
        setCoursesDetails(courses);
        fetchedCourseDetailsRef.current = true;
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    }
    };

    if (enrolledCourses.length > 0) {
      fetchAllCourseDetails();
    }
  }, [enrolledCourses]); 


//USE EFFECT FOR LOADING THE PROFIILE
useEffect(() => {
  const token = localStorage.getItem('token');

  const loadProfile = async () => {
    try {
      console.log(user.role);
      console.log(token);
      const data = await fetchUserProfile(user.role, token);
      console.log(data);
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };
 
  loadProfile();
}, [user]);

const handleCourseClick = (id) => {
  setSelectedId(id);
};

  if (!profileData) {
    return <div>Loading...</div>; // or any other loading indicator you prefer
  }
  return (
    <>      
    <div className=" border p-6  borderrounded shadow-md">
    <div className="flex items-center">
        <div className="border  relative w-24 h-24 rounded-full overflow-hidden">
          {/* Uncomment the below line once you have the profile picture data */}
          {/* <img src={profileData.profilePicture || '/default-profile-pic.jpg'} alt="Profile" className="w-full h-full object-cover" /> */}
          <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
            Edit
          </button>
        </div>
        <div className=" border   w-full ml-6">
          <h2 className="text-xl font-bold">{profileData.username}</h2>
          <p className="">{profileData.email}</p>
          <p className="">{profileData.bio}</p>
          <p className="">Role: {profileData.role}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Courses Enrolled:</h3>
        <ul>
        <div className="courses-grid">
          {coursesDetails && coursesDetails.map(course => (
            <motion.div key={course._id} layoutId={course._id} onClick={() => handleCourseClick(course._id)} className="mb-4">
              <div className="course-card bg-white dark:bg-gray-800 shadow-md rounded p-4">
                <motion.h4 className='text-gray-900 dark:text-gray-100'>{course.title}</motion.h4>
                <motion.p className='text-gray-600 dark:text-gray-300'>{course.description}</motion.p>
                {/* hala dettaje tkurseve */}
                <a href={`/courses/${course._id}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline dark:text-blue-300">Go to Course</a>
              </div>
            </motion.div>
          ))}
          </div>
        </ul>
      </div>
      <AnimatePresence>
  {selectedId && (
    coursesDetails.filter(course => course._id === selectedId).map(course => (
      <motion.div key={course._id} layoutId={selectedId} className="detailed-course-container border-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="course-details">
          <motion.h4>{course.title}</motion.h4>
          <motion.p>{course.description}</motion.p>
          {/* Shtoni detaje tkurseve */}
        </div>
        <motion.button onClick={() => handleCourseClick(null)}>Close</motion.button>
      </motion.div>
    ))
  )}
</AnimatePresence>

      {profileData.role === 'professor' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Courses Created:</h3>
          <ul>
            {profileData.coursesCreated && profileData.coursesCreated.map(course => (
              <li key={course._id} className="text-gray-600">{course.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}

export default UserProfile;
