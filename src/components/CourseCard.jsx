import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/courseCard.css';

export function CourseCard({ code, imgPath, title, description }) {
  return (
    <Link to={`/courses/course-details/${code}`} className="course-card-container" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img className="card-img" src={imgPath} alt={title} />
      <div className="course-info">
        <h3 className="course-title">{title}</h3>
        <div className="course-code">Code: {code}</div>
        {description && <p className="course-description">{description}</p>}
      </div>
    </Link>
  );
}