import '../styles/newcourses.css';
import React, { useState, useEffect } from 'react';

export function NewCourses() {
  const [newCourses, setNewCourses] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('http://localhost:5005/api/courses/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const result = await response.json();

        const onlyNewCourses = result.data.filter(
          (course) => course.courseModernity === 'New'
        );

        setNewCourses(onlyNewCourses);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
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

  if (totalCourses === 0) {
    return <div>Loading courses...</div>;
  }

  const displayedCourses = [
    newCourses[startIndex],
    newCourses[(startIndex + 1) % totalCourses],
    newCourses[(startIndex + 2) % totalCourses]
  ];

  return (
    <div className="new-courses-container">
      <button onClick={prevCourses}>◀</button>
      <div className="new-courses-imgs-container">
        {displayedCourses.map((course, index) => (
          course && (
            <img className = "course-img" key={course.id || index} src={course.img} alt={`Course ${course.id}`} />
          )
        ))}
      </div>
      <button onClick={nextCourses}>▶</button>
    </div>
  );
}
