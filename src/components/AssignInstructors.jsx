// src/components/AssignInstructors.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import "../styles/assigninstructors.css";
import LoadingSpinner from "./common/LoadingSpinner";

export default function AssignInstructors() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { success, error: toastError } = useToast();

  const token = localStorage.getItem("token");
  const statuses = ["All", "active", "upcoming", "inactive"];

  // Fetch all courses and instructors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all courses
        const coursesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses`,
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

        // Fetch all instructors
        const instructorsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/role/instructor`,
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

        setCourses(coursesResponse.data.data);
        setInstructors(instructorsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load data"
        );
        if (toastError) toastError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, toastError]);

  // Filter courses based on search term and status
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle instructor assignment
  const handleAssignInstructor = async (courseId, instructorId) => {
    try {
      // Call API to update course's instructor
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/courses/${courseId}`,
        { instructorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update the course in state
        setCourses(
          courses.map((course) =>
            course._id === courseId ? { ...course, instructorId } : course
          )
        );
        success("Instructor assigned successfully");
      } else {
        throw new Error(response.data.error || "Failed to assign instructor");
      }
    } catch (err) {
      console.error("Error assigning instructor:", err);
      toastError(
        err.response?.data?.error ||
          err.message ||
          "Failed to assign instructor"
      );
    }
  };

  // Find instructor name from ID
  const getInstructorName = (instructorId) => {
    if (!instructorId) return "Not assigned";

    const instructor = instructors.find((i) => i._id === instructorId);
    if (!instructor) return "Unknown instructor";

    return `${instructor.person?.firstName || ""} ${
      instructor.person?.lastName || ""
    }`;
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading courses..." />;
  }

  return (
    <div className="assign-container">
      <h1 className="assign-title">Assign Instructors to Courses</h1>

      {/* Filters and Search */}
      <div className="assign-filters">
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

        <div className="status-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "All"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Courses Table */}
      {filteredCourses.length > 0 ? (
        <div className="courses-table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Code</th>
                <th>Status</th>
                <th>Current Instructor</th>
                <th>Assign Instructor</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.code}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${course.status}`}>
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </span>
                  </td>
                  <td>{getInstructorName(course.instructorId)}</td>
                  <td>
                    <select
                      className="instructor-select"
                      value={course.instructorId || ""}
                      onChange={(e) =>
                        handleAssignInstructor(course._id, e.target.value)
                      }
                    >
                      <option value="">-- Select Instructor --</option>
                      {instructors.map((instructor) => (
                        <option key={instructor._id} value={instructor._id}>
                          {instructor.person?.firstName}{" "}
                          {instructor.person?.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-courses">
          <p className="no-courses-message">
            No courses found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("All");
            }}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}

      {instructors.length === 0 && (
        <div className="no-instructors">
          <p>
            No instructors available. Please add instructors before assigning
            them to courses.
          </p>
          <button
            className="add-instructor-btn"
            onClick={() => (window.location.href = "/admin-users")}
          >
            Add Instructors
          </button>
        </div>
      )}
    </div>
  );
}
