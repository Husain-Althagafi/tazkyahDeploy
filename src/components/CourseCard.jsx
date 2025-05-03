import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/coursecard.css';

export function CourseCard({ id, imgPath, title, description, code }) {
  return (
    // When user clicks a course card, Link element directs him to course details page wihtout reloading the page.
    // Unklike href which reloads the page.
    // The Link component is used to create a link to a different route in the application so that we could differentiate between pages urls.
    <Link to={`/courses/course-details/${code}`} className="course-card-container" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img className="card-img" src={imgPath} alt={title} />
      <h3 className="course-card">{title}</h3>
      <p className="course-card">{description}</p>
    </Link>
  );
}


