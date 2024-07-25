import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCourseById } from "../../utils/api";
import Navigation from "@/components/common/navigation";
import Newnav from "@/components/common/newnav";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CourseDetail() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const calculateScore = () => {
    let score = 0;
    course.quizzes.forEach((quiz, index) => {
      if (isCorrectAnswer(index)) score++;
    });
    return score;
  };

  const handleOptionClick = (quizIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: option,
    }));
  };

  const isCorrectAnswer = (quizIndex) => {
    return selectedAnswers[quizIndex] === course.quizzes[quizIndex].answer;
  };

  const router = useRouter();
  const { courseId } = router.query;

  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      async function fetchCourseDetail() {
        try {
          const token = localStorage.getItem("token");
          localStorage.setItem("courseid", courseId);
          const data = await getCourseById(courseId, token);
          setCourse(data);
        } catch (error) {
          console.error("Error fetching course details:", error);
          if (error.response && error.response.status === 403) {
            toast.error("You are not allowed to view this course because you are not enrolled.");
          }
        }
      }

      fetchCourseDetail();
    }
  }, [courseId]);

  if (!course)
    return <> <ToastContainer /><div className="text-center text-xl mt-10">Loading...</div>;</>

  return (
    <>    <ToastContainer />
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <Newnav />

      <div className="mt-4 p-5 rounded-lg shadow-lg">
        <h1 className=" bg-customBg border-customBorder text-customText text-3xl font-semibold mb-4 ">
          {course.title}
        </h1>
        <p className="text-gray-700 mb-2">{course.description}</p>
        <p className="text-green-600 mb-2">Price: ${course.price}</p>
        <p className="text-blue-600 mb-4">Language: {course.language}</p>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className=" bg-customBg border-customBorder text-customText text-2xl font-semibold mb-3 ">
            Lecture Notes:
          </h2>
          <ul>
            {course.lectureNotes.map((note, index) => (
              <li key={index} className="mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  {note.title}
                </h3>
                <p className="text-gray-600">{note.content}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            category:
          </h2>{" "}
          <p>{course.category}</p>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Quizzes:
          </h2>
          <ul>
            {course.quizzes.map((quiz, index) => (
              <li key={index} className="mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Question: {quiz.questions}
                </h3>
                <ul className="ml-5 list-disc">
                  {quiz.options.map((option, optIndex) => (
                    <li
                      key={optIndex}
                      className={`text-gray-600 ${
                        selectedAnswers[index] === option ? "bg-gray-300" : ""
                      }`}
                      onClick={() => handleOptionClick(index, option)}
                      style={{ cursor: "pointer" }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                {submitted && (
                  <p
                    className={`${
                      isCorrectAnswer(index)
                        ? "text-green-600 animate-pulse"
                        : "text-red-600"
                    }`}
                  >
                    {isCorrectAnswer(index)
                      ? "Correct! you know it, bitch"
                      : `Wrong! The correct answer is: ${course.quizzes[index].answer}`}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSubmitted(true)}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Submit
          </button>
          {submitted && (
            <div className="mt-4">
              Score:{" "}
              {
                course.quizzes.filter((quiz, index) => isCorrectAnswer(index))
                  .length
              }{" "}
              / {course.quizzes.length}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Videos:</h2>
          <ul>
            {course.videos.map((video, index) => (
              <li key={index} className="mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  {video.title}
                </h3>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Watch Video
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default CourseDetail;
