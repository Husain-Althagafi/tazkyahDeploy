import React from 'react';
import { NewCourses } from './NewCourses';
import { FilterBar } from './FilterBar';
import '../styles/coursespage.css';

function CoursesPage() {
  return (
    <div className="courses-page-container">
      <NewCourses />
      <FilterBar />
    </div>
  );
}

export default CoursesPage;