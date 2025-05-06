// src/components/instructor/InstructorCourses.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/instructorCourses.css";
import LoadingSpinner from "../common/LoadingSpinner";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Get all courses and filter on client side for instructor
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Get instructor ID
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const instructorId = userResponse.data.data.id;

          // Filter courses where this instructor is the instructor
          const instructorCourses = response.data.data.filter(
            (course) => course.instructorId === instructorId
          );

          setCourses(instructorCourses);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching instructor courses:", err);
        setError("An error occurred while fetching your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and status filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading your courses..." />;
  }

  if (error) {
    return (
      <div className="instructor-courses-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="reload-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="instructor-courses-container">
      <div className="instructor-header">
        <h1>My Teaching</h1>
        {/* Removed Create New Course button here */}
      </div>

      <div className="instructor-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <p>You don't have any courses assigned to you yet.</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-courses">
          <p>No courses match your filters.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="instructor-course-card">
              <div className="course-image-container">
                <img
                  src={
                    course.img ||
                    "https://placehold.co/400x300?text=Course+Image"
                  }
                  alt={course.title}
                  className="course-image"
                />
                <div className={`course-status ${course.status}`}>
                  {course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)}
                </div>
              </div>

              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-code">Code: {course.code}</p>

                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-label">Students:</span>
                    <span className="stat-value">
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Capacity:</span>
                    <span className="stat-value">
                      {course.enrollmentCapacity || "Unlimited"}
                    </span>
                  </div>
                </div>

                <div className="course-dates">
                  <div className="date">
                    <span className="date-label">Start:</span>
                    <span className="date-value">
                      {formatDate(course.startDate)}
                    </span>
                  </div>
                  <div className="date">
                    <span className="date-label">End:</span>
                    <span className="date-value">
                      {formatDate(course.endDate)}
                    </span>
                  </div>
                </div>

                <div className="course-actions">
                  {/* Removed Edit button */}
                  <Link
                    to={`/instructor/courses/${course.code}/students`}
                    className="students-btn"
                  >
                    Students
                  </Link>
                  <Link
                    to={`/instructor/courses/${course._id}/resources`}
                    className="resources-btn"
                  >
                    Resources
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
