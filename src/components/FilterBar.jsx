import '../styles/filterbar.css';
import React, { useState } from 'react';
import { CourseCard } from './CourseCard';

export function FilterBar() {
  const allCourses = [
    { id: 1, imgPath: 'https://placehold.co/200x200?text=Available+1', title: 'Course 1', description: 'Course Description', courseStatus: 'Available' },
    { id: 2, imgPath: 'https://placehold.co/200x200?text=Unavailable+1', title: 'Course 2', description: 'Course Description', courseStatus: 'Unavailable' },
    { id: 3, imgPath: 'https://placehold.co/200x200?text=Available+2', title: 'Course 3', description: 'Course Description', courseStatus: 'Available' },
    { id: 4, imgPath: 'https://placehold.co/200x200?text=Unavailable+2', title: 'Course 4', description: 'Course Description', courseStatus: 'Unavailable' },
    { id: 5, imgPath: 'https://placehold.co/200x200?text=Unavailable+3', title: 'Course 5', description: 'Course Description', courseStatus: 'Unavailable' }
  ];

  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  const filterCourses = (status) => {
    if (status === 'All') {
      setFilteredCourses(allCourses);
    } else {
      setFilteredCourses(allCourses.filter(c => c.courseStatus === status));
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const term = e.target.value.toLowerCase();
      setFilteredCourses(allCourses.filter(c => c.title.toLowerCase().includes(term)));
    }
  };

  return (
    <>
      <div className="btn-container">
        <button onClick={() => filterCourses('All')} className="filter-btn">All</button>
        <button onClick={() => filterCourses('Available')} className="filter-btn">Available</button>
        <button onClick={() => filterCourses('Unavailable')} className="filter-btn">Unavailable</button>
        <input onKeyDown={handleSearch} type="text" id="searchBar" name="searchBar" />
      </div>
      <div className="cards-container">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            imgPath={course.imgPath}
            title={course.title}
            description={course.description}
          />
        ))}
      </div>
    </>
  );
}
