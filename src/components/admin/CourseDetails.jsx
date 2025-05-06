// src/components/admin/CourseDetails.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import "../../styles/admincoursedetails.css";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AdminCourseDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { success, error: toastError } = useToast();
  const [instructorSelectDisabled, setInstructorSelectDisabled] =
    useState(false);

  const token = localStorage.getItem("token");

  // Fetch course details and enrolled students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/${code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!courseResponse.data.success) {
          throw new Error(
            courseResponse.data.error || "Failed to fetch course details"
          );
        }

        const courseData = courseResponse.data.data;
        setCourse(courseData);
        setInstructorSelectDisabled(!!courseData.instructorId);

        // Fetch enrolled students
        const studentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/courses/${code}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!studentsResponse.data.success) {
          throw new Error(
            studentsResponse.data.error || "Failed to fetch enrolled students"
          );
        }

        setEnrolledStudents(studentsResponse.data.data || []);

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

        setInstructors(instructorsResponse.data.data || []);

        // Fetch all students to get available students
        const allStudentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/role/student`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!allStudentsResponse.data.success) {
          throw new Error(
            allStudentsResponse.data.error || "Failed to fetch students"
          );
        }

        // Filter out already enrolled students
        const enrolledIds = enrolledStudents.map(
          (enrollment) => enrollment.userId._id
        );
        const available = allStudentsResponse.data.data.filter(
          (student) => !enrolledIds.includes(student._id)
        );

        setAvailableStudents(available);
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
  }, [code, token, toastError]);

  // We only need to update the functions that show toast notifications

  // Handle instructor assignment - updated version
  const handleAssignInstructor = async (instructorId) => {
    try {
      // Call API to update course's instructor
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/courses/${code}`,
        { instructorId: instructorId || null }, // Ensure null is sent when no instructor is selected
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update the course in state without causing a re-render cascade
        setCourse((prevCourse) => ({
          ...prevCourse,
          instructorId: instructorId || null,
        }));

        // Update the instructor selection disabled state independently
        setInstructorSelectDisabled(!!instructorId);

        // Show success toast
        success("Instructor assignment updated successfully");
      } else {
        throw new Error(
          response.data.error || "Failed to update instructor assignment"
        );
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

  // Handle enrolling a student
  const handleEnrollStudent = async (studentId) => {
    if (!studentId) return; // Skip if no student selected

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/courses/${code}/admin-enroll`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Show success toast first
        success("Student enrolled successfully");

        // Then refresh the enrolled students list
        fetchEnrolledStudents();
      } else {
        throw new Error(response.data.error || "Failed to enroll student");
      }
    } catch (err) {
      console.error("Error enrolling student:", err);
      toastError(
        err.response?.data?.error || err.message || "Failed to enroll student"
      );
    }
  };

  // Handle removing a student
  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/courses/${code}/admin-enroll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { studentId },
        }
      );

      if (response.data.success) {
        // Show success toast first
        success("Student removed successfully");

        // Then update the student list without causing full re-render
        setEnrolledStudents((prevStudents) =>
          prevStudents.filter(
            (enrollment) => enrollment.userId._id !== studentId
          )
        );

        // Also update available students
        setAvailableStudents((prevAvailable) => {
          // Find the removed student's info
          const removedStudent = enrolledStudents.find(
            (enrollment) => enrollment.userId._id === studentId
          )?.userId;

          if (removedStudent) {
            // Add the removed student to the available list
            return [...prevAvailable, removedStudent];
          }
          return prevAvailable;
        });
      } else {
        throw new Error(response.data.error || "Failed to remove student");
      }
    } catch (err) {
      console.error("Error removing student:", err);
      toastError(
        err.response?.data?.error || err.message || "Failed to remove student"
      );
    }
  };

  // Add a function to fetch enrolled students
  const fetchEnrolledStudents = async () => {
    try {
      const studentsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/courses/${code}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!studentsResponse.data.success) {
        throw new Error(
          studentsResponse.data.error || "Failed to fetch enrolled students"
        );
      }

      setEnrolledStudents(studentsResponse.data.data || []);

      // Update available students list
      const allStudentsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/role/student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!allStudentsResponse.data.success) {
        throw new Error(
          allStudentsResponse.data.error || "Failed to fetch students"
        );
      }

      // Filter out already enrolled students
      const enrolledIds = studentsResponse.data.data.map(
        (enrollment) => enrollment.userId._id
      );
      const available = allStudentsResponse.data.data.filter(
        (student) => !enrolledIds.includes(student._id)
      );

      setAvailableStudents(available);
    } catch (err) {
      console.error("Error fetching students:", err);
      toastError(
        err.response?.data?.error || err.message || "Failed to fetch students"
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
    return <LoadingSpinner size="large" text="Loading course details..." />;
  }

  if (error || !course) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || "Course not found"}</p>
        <button onClick={() => navigate("/admin-courses")} className="back-btn">
          Back to Courses
        </button>
      </div>
    );
  }

  // Filter enrolled students by search term
  const filteredStudents = enrolledStudents.filter((enrollment) => {
    if (!enrollment || !enrollment.userId) return false;

    const student = enrollment.userId;

    if (!student) return false;
    const fullName = `${student.person?.firstName || ""} ${
      student.person?.lastName || ""
    }`.toLowerCase();
    const email = student.person?.email?.toLowerCase() || "";

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="course-details-container">
      <div className="details-header">
        <button onClick={() => navigate("/admin-courses")} className="back-btn">
          ← Back to Courses
        </button>
        <h1>{course.title}</h1>
      </div>

      <div className="course-info-card">
        <div className="course-info-row">
          <div className="info-item">
            <h3>Course Code</h3>
            <p>{course.code}</p>
          </div>
          <div className="info-item">
            <h3>Status</h3>
            <p className={`status-badge ${course.status}`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </p>
          </div>
          <div className="info-item">
            <h3>Enrollment Capacity</h3>
            <p>{course.enrollmentCapacity}</p>
          </div>
        </div>

        <div className="course-info-row">
          <div className="info-item">
            <h3>Start Date</h3>
            <p>
              {course.startDate
                ? new Date(course.startDate).toLocaleDateString()
                : "Not set"}
            </p>
          </div>
          <div className="info-item">
            <h3>End Date</h3>
            <p>
              {course.endDate
                ? new Date(course.endDate).toLocaleDateString()
                : "Not set"}
            </p>
          </div>
          <div className="info-item instructor-item">
            <h3>Instructor</h3>
            <div className="instructor-control">
              <span className="current-instructor">
                {getInstructorName(course.instructorId)}
              </span>
              <div className="instructor-select-container">
                <select
                  className="instructor-select"
                  value={course.instructorId || ""}
                  onChange={(e) => handleAssignInstructor(e.target.value)}
                  disabled={instructorSelectDisabled}
                >
                  <option value="">-- Select Instructor --</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.person?.firstName}{" "}
                      {instructor.person?.lastName}
                    </option>
                  ))}
                </select>
                {instructorSelectDisabled && course.instructorId && (
                  <button
                    className="clear-instructor-btn"
                    onClick={() => handleAssignInstructor(null)}
                    title="Remove instructor assignment"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="course-description">
          <h3>Description</h3>
          <p>{course.description || "No description provided."}</p>
        </div>
      </div>

      <div className="enrolled-students-section">
        <div className="section-header">
          <h2>Enrolled Students ({enrolledStudents.length})</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students..."
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
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="no-students">
            <p>No students enrolled in this course.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-students">
            <p>No students match your search.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((enrollment) => {
                  const student = enrollment.userId;
                  if (!student || !student.person) return null;
                  return (
                    <tr key={enrollment._id}>
                      <td>
                        {student.person?.firstName} {student.person?.lastName}
                      </td>
                      <td>{student.person?.email}</td>
                      <td>
                        {new Date(
                          enrollment.enrollmentDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="progress-cell">
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`enrollment-status ${enrollment.status}`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveStudent(student._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="add-student-section">
          <h3>Add Student to Course</h3>
          <div className="add-student-control">
            <select
              className="student-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleEnrollStudent(e.target.value);
                  e.target.value = ""; // Reset select
                }
              }}
            >
              <option value="" disabled>
                -- Select Student to Enroll --
              </option>
              {availableStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.person?.firstName} {student.person?.lastName} (
                  {student.person?.email})
                </option>
              ))}
            </select>
            {availableStudents.length === 0 && (
              <p className="no-available-students">
                No available students to enroll
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
