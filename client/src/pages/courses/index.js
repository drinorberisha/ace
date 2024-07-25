import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
} from "../../utils/api";
import Navigation from "@/components/common/navigation";
import { Button } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Newnav from "@/components/common/newnav";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      const token = localStorage.getItem("token");
      try {
        const data = await getAllCourses(token);
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getEnrolledCourses(token);
        setEnrolledCourses(response.enrolledCourses);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (selectedCategoryFilter) {
      const newFilteredCourses = courses.filter(
        (course) =>
          course.category && course.category.includes(selectedCategoryFilter)
      );
      setFilteredCourses(newFilteredCourses);
    } else {
      setFilteredCourses(courses);
    }
  }, [selectedCategoryFilter, courses]);

  const handleEnrollment = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await enrollInCourse(courseId, token);
      if (response.msg === "Successfully enrolled") {
        setEnrolledCourses((prevCourses) => [...prevCourses, courseId]);
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
    }
  };

  const handleCategoryClick = (category) => {
    // Set the selected category filter
    setSelectedCategoryFilter(category);
  };

  useEffect(() => {
    let filteredByCategory = courses;

    if (selectedCategoryFilter) {
      filteredByCategory = courses.filter(
        (course) =>
          course.category && course.category.includes(selectedCategoryFilter)
      );
    }

    let filteredByPrice = filteredByCategory;
    if (selectedPriceFilter) {
      switch (selectedPriceFilter) {
        case "lessThan50":
          filteredByPrice = filteredByCategory.filter(
            (course) => course.price < 50
          );
          break;
        case "lessThan100":
          filteredByPrice = filteredByCategory.filter(
            (course) => course.price < 100
          );
          break;
        case "moreThan100":
          filteredByPrice = filteredByCategory.filter(
            (course) => course.price > 100
          );
          break;
        default:
          break;
      }
    }

    setFilteredCourses(filteredByPrice);
  }, [
    selectedCategoryFilter,
    selectedPriceFilter,
    selectedLanguageFilter,
    courses,
  ]);
  const handleLanguageClick = (language) => {
    setSelectedLanguageFilter(language);
  };

  return (
    <>
      {/* <Navigation /> */}
      <Newnav />
      <div className="container mx-auto p-6 flex">
        <div className="flex flex-col p-4" style={{ width: "20vw" }}>
          <Accordion selectionMode="multiple" variant="shadow">
            <AccordionItem
              key="1"
              aria-label="Rating"
              title="Category"
              titleClass="font-bold text-gray-800"
              className="mb-2 border-b"
            >
              <div className="p-4">
                <ol className="list list-inside">
                  {/* Ordered list with decimal numbering */}
                  <li
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick("science")}
                  >
                    science
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick("technology")}
                  >
                    technology
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick("Category 3")}
                  >
                    Category 3
                  </li>
                </ol>
              </div>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Language"
              title="Language"
              titleClass="font-bold text-gray-800"
              className="mb-2 border-b"
            >
              <div className="p-4">
                <ul className="list list-inside">
                  <li
                    className="cursor-pointer"
                    onClick={() => handleLanguageClick("English")}
                  >
                    English
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleLanguageClick("Albanian")}
                  >
                    Albanian
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Price"
              title="Price"
              titleClass="font-bold text-gray-800"
              className="mb-2 border-b"
            >
              <div className="p-4">
                <ul className="list list-inside">
                  <li
                    className="cursor-pointer"
                    onClick={() => setSelectedPriceFilter("lessThan50")}
                  >
                    Less than $50
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => setSelectedPriceFilter("lessThan100")}
                  >
                    Less than $100
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => setSelectedPriceFilter("moreThan100")}
                  >
                    More than $100
                  </li>
                </ul>
              </div>
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="Accordion 2"
              title="Professor"
              titleClass="font-bold text-gray-800"
              className="border-b"
            >
              <div className="p-4">rioni</div>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-grow pl-4">
          <h1 className="text-2xl font-bold mb-4">All Courses</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col border rounded-lg shadow-lg h-full"
              >
                <Link
                  href={`/courses/${course._id}`}
                  className="block flex-grow"
                >
                  <div className="p-4">
                    <p className=" font-semibold">
                      {course.title} - {course.description}
                    </p>
                  </div>
                </Link>
                {!enrolledCourses.includes(course._id) && (
                  <div className="p-4 border-t">
                    <Button
                      className="w-full bg-blue-500  py-2 px-4 rounded shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none"
                      onClick={() => handleEnrollment(course._id)}
                    >
                      Enroll
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CoursesList;
