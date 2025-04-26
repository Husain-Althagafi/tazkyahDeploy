// import React from 'react';
// import { NewCourses } from './NewCourses';
// import { FilterBar } from './FilterBar';
// import '../styles/coursespage.css';

// function CoursesPage() {
//   return (
//     <div className="courses-page-container">
//       <NewCourses />
//       <FilterBar />
//     </div>
//   );
// }

// export default CoursesPage;

// New CoursesPage component
// This component fetches and displays a list of courses from the backend API.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewCourses } from './NewCourses';
import { FilterBar } from './FilterBar';
import '../styles/coursespage.css';

function CoursesPage() {
    const [courses, setCourses] = useState([]);

    // Fetch courses from the backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses'); // Adjust the URL if needed
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="courses-page-container">
            {/* Render the NewCourses and FilterBar components */}
            <NewCourses />
            <FilterBar />

            {/* Render the list of courses */}
            <div className="courses-page">
                <h1>Available Courses</h1>
                <div className="courses-list">
                    {courses.map((course) => (
                        <div key={course._id} className="course-card">
                            <img src={course.image} alt={course.title} />
                            <h2>{course.title}</h2>
                            <p>{course.description.substring(0, 100)}...</p>
                            <Link to={`/courses/${course._id}`} className="details-link">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CoursesPage;