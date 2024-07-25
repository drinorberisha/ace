import React, { useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/router';
import { getAllCourses } from '../../utils/api'; 
import Navigation from '@/components/common/navigation';
import UserContext from '@/context/userContext';
import Link from 'next/link';
import Newnav from '@/components/common/newnav';
import { ToastContainer, toast } from 'react-toastify';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {user} =  useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isProfessor, setIsProfessor] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
  
    const checkAccessAndRedirect = () => {
      const currentIsLoggedIn = !!localStorage.getItem("token");
      const currentRole = localStorage.getItem("userRole");
    
      if (!currentIsLoggedIn) {
        toast.error("You do not have access to this page. Please login");
        router.push('/');
        return;
      }
    
      const isCurrentAdmin = currentRole === "admin";
    
      if (currentIsLoggedIn && !isCurrentAdmin) {
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



    const fetchCourses = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');  // Retrieve the token from local storage
          const allCourses = await getAllCourses(token);
          setCourses(allCourses);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
        }
        setIsLoading(false);
      };
  return (
    <div>
      <ToastContainer/>
      {/* <Navigation /> */}
      <Newnav />

    {user && (
       <div className="ml-4 text-white">
       Welcome to THE ADMIN DASHBOARD  $-ACE-$ <br/> {user.username}
   </div>
    )}
    {/* Other buttons here */}

    <button onClick={fetchCourses}>Show All Courses</button>
    <a href='admin/AddCourse'><button>Add Course</button></a>


    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <div>
        <h2>All Courses</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {course.title} - {course.description}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
};
export default Admin;
