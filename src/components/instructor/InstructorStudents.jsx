import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/instructorStudents.css";
import LoadingSpinner from "../common/LoadingSpinner";

const InstructorStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Try fetching by ID, then fallback to code
        try {
          const courseResponse = await axios.get(
            `${process.env.API_URL}/courses/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!courseResponse.data.success) {
            throw new Error(
              courseResponse.data.error || "Failed to fetch course details"
            );
          }

          setCourse(courseResponse.data.data);
          const code = courseResponse.data.data.code;
          const studentsResponse = await axios.get(
            `${process.env.API_URL}/courses/${code}/students`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!studentsResponse.data.success) {
            throw new Error(
              studentsResponse.data.error || "Failed to fetch enrolled students"
            );
          }

          setStudents(studentsResponse.data.data || []);
        } catch {
          // Fallback: treat courseId as code
          const courseResponse = await axios.get(
            `${process.env.API_URL}/courses/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!courseResponse.data.success) {
            throw new Error(
              courseResponse.data.error || "Failed to fetch course details"
            );
          }

          setCourse(courseResponse.data.data);
          const studentsResponse = await axios.get(
            `${process.env.API_URL}/courses/${courseId}/students`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!studentsResponse.data.success) {
            throw new Error(
              studentsResponse.data.error || "Failed to fetch enrolled students"
            );
          }

          setStudents(studentsResponse.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  const filteredStudents = students.filter((enrollment) => {
    const person = enrollment.userId?.person;
    if (!person) return false;
    const term = searchTerm.toLowerCase();
    return (
      person.firstName?.toLowerCase().includes(term) ||
      person.lastName?.toLowerCase().includes(term) ||
      person.email?.toLowerCase().includes(term)
    );
  });

  const handleBack = () => navigate("/instructor-courses");

  if (loading) {
    return <LoadingSpinner size="large" text="Loading student data..." />;
  }
  if (error) {
    return (
      <div className="instructor-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleBack} className="back-btn">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="instructor-students-container">
      <div className="students-header">
        <h1>Students in {course?.title || "Course"}</h1>
        <button onClick={handleBack} className="back-btn">
          Back to Courses
        </button>
      </div>

      <div className="students-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
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

        <div className="students-info">
          <div className="student-count">
            Total Students: <span>{students.length}</span>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <p>No students enrolled in this course yet.</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="no-students">
          <p>No students found matching your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="clear-filters-btn"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Enrollment Date</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((enrollment) => {
                const student = enrollment.userId.person;
                return (
                  <tr key={enrollment._id}>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.email}</td>
                    <td>
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="progress-cell">
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${enrollment.status}`}>
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;
