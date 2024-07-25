const courseId = localStorage.getItem("courseid");

useEffect(() => {
  if (courseId) {
    async function fetchCourseDetail() {
      try {
        const token = localStorage.getItem("token");
        const data = await getCourseById(courseId, token);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    }

    fetchCourseDetail();
  }
}, [courseId]);
