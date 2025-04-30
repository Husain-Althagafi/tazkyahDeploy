import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/courseCard.css';

export function CourseCard({ id, imgPath, title, description }) {
  return (
    <Link
      to={`/courses/course-details`}
      className="course-card-container"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <img src={imgPath} alt={title} />
      <h3 className="course-card">{title}</h3>
      <p className="course-card">{description}</p>
    </Link>
  );
}


