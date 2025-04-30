import '../styles/newcourses.css';
import React, { useState } from 'react';

export function NewCourses() {
  const newCoursesImgs = [
    { id: 1, img: 'https://placehold.co/200x200?text=Course+1' },
    { id: 2, img: 'https://placehold.co/200x200?text=Course+2' },
    { id: 3, img: 'https://placehold.co/200x200?text=Course+3' },
    { id: 4, img: 'https://placehold.co/200x200?text=Course+4' },
    { id: 5, img: 'https://placehold.co/200x200?text=Course+5' }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const totalCourses = newCoursesImgs.length;

  const nextCourses = () => {
    setStartIndex((prev) => (prev + 1) % totalCourses);
  };

  const prevCourses = () => {
    setStartIndex((prev) => (prev - 1 + totalCourses) % totalCourses);
  };

  const displayedCourses = [
    newCoursesImgs[startIndex],
    newCoursesImgs[(startIndex + 1) % totalCourses],
    newCoursesImgs[(startIndex + 2) % totalCourses]
  ];

  return (
    <div className="new-courses-container">
      <button onClick={prevCourses}>◀</button>
      <div className="new-courses-imgs-container">
        {displayedCourses.map((course) => (
          <img key={course.id} src={course.img} alt={`Course ${course.id}`} />
        ))}
      </div>
      <button onClick={nextCourses}>▶</button>
    </div>
  );
}
