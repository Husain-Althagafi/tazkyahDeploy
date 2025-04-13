import '../styles/coursecard.css';
import React from 'react';
import { Link } from 'react-router-dom';

export function CourseCard({ id, imgPath, title, description }) {
  return (
    <Link to={`/courses/${id}`} className="course-card-link">
      <div className="course-card-container">
        <img src={imgPath} alt={title} />
        <h3 className="course-card">{title}</h3>
        <p className="course-card">{description}</p>
      </div>
    </Link>
  );
}