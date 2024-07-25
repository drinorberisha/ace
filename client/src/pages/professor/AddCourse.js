import React, { useState, useEffect } from "react";
import { addCourse } from "../../utils/api"; // Import the addCourse API function
import Navigation from "@/components/common/navigation";
import { useRouter } from 'next/router';

import Newnav from "@/components/common/newnav";
import { ToastContainer, toast } from 'react-toastify';


const AddCourse = () => {
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




  const addQuiz = () => {
    setFormData((prev) => ({
      ...prev,
      quizzes: [
        ...prev.quizzes,
        { questions: "", options: ["", "", "", ""], answer: "" },
      ],
    }));
  };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    language: "",
    lectureNotes: [],
    quizzes: [{ questions: "", options: ["", "", "", ""], answer: "" }],
    videos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const userId = localStorage.getItem("userId"); // Assuming you store user's ID in local storage
    const courseData = {
      ...formData,
      createdBy: userId,
    };
    try {
      const response = await addCourse(courseData, token);
      console.log("Course added successfully:", response);
    } catch (err) {
      console.error("Failed to add course:", err);
    }
  };
  const handleQuizChange = (quizIndex, key, value) => {
    const updatedQuizzes = [...formData.quizzes];
    updatedQuizzes[quizIndex][key] = value;
    setFormData({ ...formData, quizzes: updatedQuizzes });
  };

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const updatedQuizzes = [...formData.quizzes];
    updatedQuizzes[quizIndex].options[optionIndex] = value;
    setFormData({ ...formData, quizzes: updatedQuizzes });
  };

  return (
    <>
    <ToastContainer/>
      {/* <Navigation /> */}
      <Newnav />
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4"
      >
        {/* Existing fields for title and description */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        {/* New fields for price and language */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700"
          >
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
          <>
            {formData.quizzes.map((quiz, quizIndex) => (
              <div key={quizIndex} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Question {quizIndex + 1}
                </label>
                <input
                  type="text"
                  value={quiz.questions}
                  onChange={(e) =>
                    handleQuizChange(quizIndex, "questions", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                  placeholder="Enter quiz question"
                />
                {quiz.options.map((option, optionIndex) => (
                  <div key={optionIndex} className=" w-1/4 flex mt-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(
                          quizIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                      className="p-2 border rounded-md flex-grow"
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuizChange(quizIndex, "answer", option)
                      }
                      className={`ml-2 mt-2 p-1 ${
                        quiz.answer === option
                          ? "bg-green-500 text-white"
                          : quiz.answer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {quiz.answer === option ? "Correct" : "Mark as Correct"}
                    </button>
                  </div>
                ))}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuiz}
              className="bg-blue-200 p-2 rounded-md mb-4"
            >
              Add Question
            </button>
          </>
        </div>
        {/* TODO: Add fields for lectureNotes, quizzes, and videos */}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Add Course
        </button>
      </form>
    </>
  );
};

export default AddCourse;
