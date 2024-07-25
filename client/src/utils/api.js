import axios from "axios";

const backendUrl = process.env.BACKEND_URL;

export const apiCall = async (
  endpoint,
  subEndpoint,
  method,
  data = null,
  token = null
) => {
  const url = `${backendUrl}/api/${endpoint}/${subEndpoint}`;
  console.log("Constructed URL:", url);
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const config = {
    method: method,
    url: url,
    headers: headers,
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  return await apiCall("users", "login", "POST", { email, password });
};

export const registerUser = async (email, username, password) => {
  return await apiCall("users", "register", "POST", {
    email,
    username,
    password,
  });
};
// api.js
export const getAllCourses = async (token) => {
  try {
    const response = await apiCall("courses", "", "GET", null, token);
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
// api.js
export const fetchUserProfile = async (role, token) => {
  let endpoint;

  if (role === "student") {
    endpoint = "student-profile";
  } else if (role === "professor") {
    endpoint = "professor-profile";
  } else {
    throw new Error("Invalid user role");
  }

  return await apiCall("users", endpoint, "GET", null, token);
};

export const changePassword = async (id, oldPassword, newPassword, token) => {
  return await apiCall(
    "users",
    "change-password",
    "POST",
    { id, oldPassword, newPassword },
    token
  );
};

export const addCourse = async (courseData, token) => {
  try {
    const response = await apiCall("courses", "", "POST", courseData, token);
    return response;
  } catch (error) {
    console.error("Failed to add course:", error);
    throw error;
  }
};
export const sendForgotPasswordEmail = async (email) => {
  return await apiCall("users", "forgot-password", "POST", { email });
};

// Verifying the code
export const verifyForgotPasswordCode = async (email, otp) => {
  return await apiCall("users", "verify-otp", "POST", { email, otp });
};
// Resetting the password after verification
export const resetForgotPassword = async (tempToken, password) => {
  return await apiCall("users", "reset-password", "POST", { tempToken, password });
};

export const getCourseById = async (courseId, token) => {
  try {
    const response = await apiCall("courses", courseId, "GET", null, token);
    return response;
  } catch (error) {
    console.error("Failed to fetch course by ID:", error);
    throw error;
  }
};
export const enrollInCourse = async (courseId, token) => {
  return await apiCall('courses', `${courseId}/enroll`, 'POST', {}, token);
};
export const getEnrolledCourses = async (token) => {
  return await apiCall('users', `student-profile`, 'GET', null, token);
};
export const getCreatedCourses = async (token) => {
  return await apiCall('users', `professor-profile`, 'GET', null, token);
};

export const editCourse = async (courseId, token, data) => {
  return await apiCall('courses', courseId, 'PUT', data, token);
};

