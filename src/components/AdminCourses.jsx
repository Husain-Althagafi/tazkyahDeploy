// Enhanced AdminCourses.jsx with proper enrollment count display

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "../styles/admincourses.css";
import CourseAddForm from "./CourseAddForm";
import LoadingSpinner from "./common/LoadingSpinner";


// CourseCard component for displaying individual courses
function CourseCard({
  course,
  onDelete,
  onEdit,
  instructorName,
  enrollmentCount,
}) {
  // Note: Added enrollmentCount parameter to accurately display enrollment numbers

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={
            course.image ||
            course.img ||
            "https://placehold.co/600x400?text=Course"
          }
          alt={course.title}
          className="course-image"
        />
        <div className={`course-status ${course.status}`}>
          {course.status
            ? course.status.charAt(0).toUpperCase() + course.status.slice(1)
            : "Unknown"}
        </div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">
          Instructor: {instructorName || "Not assigned"}
        </p>
        <div className="course-progress-container">
          <div className="progress-header">
            <span className="progress-label">Students</span>
            <span className="progress-percentage">
              {/* Use the passed enrollmentCount instead of course.enrolledStudents */}
              {enrollmentCount} enrolled
            </span>
          </div>
          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  course.enrollmentCapacity
                    ? (enrollmentCount / course.enrollmentCapacity) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <p className="course-last-accessed">
          Created:{" "}
          {course.lastAccessed ||
            new Date(course.createdAt).toLocaleDateString()}
        </p>
        <div className="course-actions">
          <button className="delete-btn" onClick={() => onDelete(course.code)}>
            Delete
          </button>
          <button className="edit-btn" onClick={() => onEdit(course.code)}>
            Edit
          </button>
          <Link
            to={`/admin/courses/${course.code}/details`}
            className="details-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState({}); // New state to store enrollment counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Available categories (status types)
  const categories = ["All", "active", "upcoming", "inactive"];

  // New function to fetch enrollment counts for all courses
  const fetchEnrollmentCounts = async (coursesList) => {
    try {
      // Create an object to store enrollment counts
      const enrollmentCounts = {};

      // For each course, fetch its enrolled students
      for (const course of coursesList) {
        try {
          const response = await axios.get(
            `${process.env.API_URL}/courses/${course.code}/students`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            // Store the count of enrolled students for this course
            enrollmentCounts[course._id] = response.data.data.length;
          }
        } catch (err) {
          console.error(
            `Error fetching enrollments for course ${course.code}:`,
            err
          );
          // If there's an error, set the count to 0
          enrollmentCounts[course._id] = 0;
        }
      }

      setEnrollmentData(enrollmentCounts);
    } catch (err) {
      console.error("Error fetching enrollment counts:", err);
      if (toastError) toastError("Failed to load enrollment data");
    }
  };

  // Fetch all courses and instructors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all courses
        const coursesResponse = await axios.get(
          `${process.env.API_URL}/courses/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!coursesResponse.data.success) {
          throw new Error(
            coursesResponse.data.error || "Failed to fetch courses"
          );
        }

        const fetchedCourses = coursesResponse.data.data;
        setCourses(fetchedCourses);

        // Fetch enrollment counts for all courses
        await fetchEnrollmentCounts(fetchedCourses);

        // Fetch all instructors to get their names
        const instructorsResponse = await axios.get(
          `${process.env.API_URL}/users/role/instructor`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!instructorsResponse.data.success) {
          throw new Error(
            instructorsResponse.data.error || "Failed to fetch instructors"
          );
        }

        setInstructors(instructorsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load courses"
        );
        if (toastError) toastError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, toastError]);

  // Helper function to get instructor name from ID
  const getInstructorName = (instructorId) => {
    if (!instructorId) return null;

    const instructor = instructors.find((inst) => inst._id === instructorId);
    if (!instructor || !instructor.person) return "Unknown Instructor";

    return `${instructor.person.firstName || ""} ${
      instructor.person.lastName || ""
    }`;
  };

  // Get enrollment count for a course
  const getEnrollmentCount = (courseId) => {
    return enrollmentData[courseId] || 0;
  };

  // Filter courses based on search term and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || course.status === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle delete course with student warning
  const handleDelete = async (code) => {
    // First, get the course details to check enrollment
    try {
      const course = courses.find((c) => c.code === code);
      const enrollmentCount = getEnrollmentCount(course._id);

      // Check if students are enrolled
      if (enrollmentCount > 0) {
        // Show warning about enrolled students
        const deleteConfirm = window.confirm(
          `Warning: This course has ${enrollmentCount} enrolled student(s). ` +
            `Deleting this course will remove it from their enrolled courses. ` +
            `Do you want to proceed with deletion?`
        );

        if (!deleteConfirm) {
          return; // Cancel deletion
        }
      } else {
        // Standard confirmation without enrollment warning
        const deleteConfirm = window.confirm(
          "Are you sure you want to delete this course?"
        );
        if (!deleteConfirm) {
          return;
        }
      }

      // Proceed with deletion
      const response = await axios.delete(
        `${process.env.API_URL}/courses/${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the course from our state
        const deletedCourse = courses.find((c) => c.code === code);
        setCourses((prev) => prev.filter((course) => course.code !== code));

        // Also remove the enrollment data for this course
        if (deletedCourse) {
          setEnrollmentData((prevData) => {
            const newData = { ...prevData };
            delete newData[deletedCourse._id];
            return newData;
          });
        }

        success("Course deleted successfully");
      } else {
        throw new Error(response.data.error || "Failed to delete course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      if (toastError)
        toastError(
          err.response?.data?.error || err.message || "Failed to delete course"
        );
    }
  };

  // Handle edit course
  const handleEdit = (code) => {
    const courseToEdit = courses.find((course) => course.code === code);
    if (courseToEdit) {
      setEditingCourse(courseToEdit);
      setShowAddForm(true);
    }
  };

  // Handle add/update course
  const handleSaveCourse = async (courseData) => {
    try {
      let response;

      if (editingCourse) {
        // Update existing course
        response = await axios.put(
          `${process.env.API_URL}/courses/${courseData.code}`,
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setCourses((prev) =>
            prev.map((course) =>
              course.code === courseData.code ? response.data.data : course
            )
          );
          success("Course updated successfully");
        } else {
          throw new Error(response.data.error || "Failed to update course");
        }
      } else {
        // Add new course
        response = await axios.post(
          `${process.env.API_URL}/courses/`,
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          const newCourse = response.data.data;
          setCourses((prev) => [...prev, newCourse]);

          // Initialize enrollment count for new course
          setEnrollmentData((prevData) => ({
            ...prevData,
            [newCourse._id]: 0,
          }));

          success("Course added successfully");
        } else {
          throw new Error(response.data.error || "Failed to add course");
        }
      }

      // Close form on success
      setShowAddForm(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Error saving course:", err);
      if (toastError)
        toastError(
          err.response?.data?.error || err.message || "Failed to save course"
        );
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading courses..." />;
  }

  // If the add/edit form is active, show it
  if (showAddForm) {
    return (
      <CourseAddForm
        onSubmit={handleSaveCourse}
        onClose={() => {
          setShowAddForm(false);
          setEditingCourse(null);
        }}
        initialData={editingCourse}
      />
    );
  }

  return (
    <div className="courses-container">
      <h1 className="courses-title">Manage Courses</h1>

      {/* Filters and Search */}
      <div className="courses-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
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

        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id || course.code}
              course={course}
              onDelete={handleDelete}
              onEdit={handleEdit}
              instructorName={getInstructorName(course.instructorId)}
              enrollmentCount={getEnrollmentCount(course._id)}
            />
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <p className="no-courses-message">
            No courses found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("All");
            }}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Add Course Button */}
      <div className="explore-section">
        <h2 className="explore-title">Manage Course Catalog</h2>
        <p className="explore-description">
          Add new courses or modify existing ones
        </p>
        <button
          className="add-course-btn"
          onClick={() => {
            setEditingCourse(null);
            setShowAddForm(true);
          }}
        >
          + Add New Course
        </button>
      </div>
    </div>
  );
}
