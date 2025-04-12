import '../styles/coursecard.css';
import React from 'react';

export function CourseCard({ imgPath, title, description }) {
  return (
    <div className="course-card-container">
      <img src={imgPath} alt={title} />
      <h3 className="course-card">{title}</h3>
      <p className="course-card">{description}</p>
    </div>
  );
}
