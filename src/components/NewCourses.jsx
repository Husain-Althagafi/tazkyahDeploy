import React, { useEffect, useState } from "react";
import "../styles/newcourses.css";
import { Link } from 'react-router-dom';

export function NewCourses() {
  const [newCourses, setNewCourses] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('http://localhost:5005/api/courses/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const result = await response.json();

        const onlyNewCourses = result.data.filter(
          (course) => course.courseModernity === "New"
        );

        setNewCourses(onlyNewCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const totalCourses = newCourses.length;

  const nextCourses = () => {
    setStartIndex((prev) => (prev + 1) % totalCourses);
  };

  const prevCourses = () => {
    setStartIndex((prev) => (prev - 1 + totalCourses) % totalCourses);
  };

  if (loading) {
    return <div className="new-courses-loading">Loading featured courses...</div>;
  }

  if (totalCourses === 0) {
    return null; // Don't show anything if there are no new courses
  }

  const displayedCourses = [
    newCourses[startIndex],
    newCourses[(startIndex + 1) % totalCourses],
    newCourses[(startIndex + 2) % totalCourses],
  ].filter(course => course); // Filter out undefined courses

  return (
    <div className="new-courses-section">
      <h2 className="new-courses-title">Featured New Courses</h2>
      <div className="new-courses-container">
        <button onClick={prevCourses} className="carousel-btn">◀</button>
        <div className="new-courses-imgs-container">
          {displayedCourses.map((course, index) => (
            <Link 
              to={`/courses/course-details/${course.code}`}
              key={course._id || index} 
              className="carousel-course"
            >
              <img
                className="course-img"
                src={course.img}
                alt={course.title}
              />
              <div className="carousel-info">
                <span className="carousel-title">{course.title}</span>
                <span className="carousel-code">Code: {course.code}</span>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={nextCourses} className="carousel-btn">▶</button>
      </div>
    </div>
  );
}