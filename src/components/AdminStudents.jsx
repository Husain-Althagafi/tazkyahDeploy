import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/adminstudents.css";
// StudentCard component for displaying individual students
function StudentCard({ student, handleDelete, handleEdit }) {
  const { firstName, lastName, email, phoneNumber, lastLogin, profilePicture } =
    student;

  // const handleDelete = () => {
  //   alert('Student deleted');
  // };

  // const handleEdit = () => {
  //   alert('Student is being edited');
  // };

  return (
    <div className="student-card">
      <div className="student-image-container">
        <img src={profilePicture} alt={firstName} className="student-image" />
      </div>
      <div className="student-content">
        <h3 className="student-firstName">{firstName}</h3>
        <h3 className="student-lastName">{lastName}</h3>
        <h3 className="student-email">{email}</h3>
        <h3 className="student-phone number">{phoneNumber}</h3>

        {/* <div className="student-attendance-container">
          <div className="attendance-header">
            <span className="attendance-label">Attendance</span>
            <span className="attendance-percentage">{attendance}%</span>
          </div>
          <div className="attendance-bar-background">
            <div 
              className="attendance-bar-fill" 
              style={{ width: `${attendance}%` }}
            ></div>
          </div>
        </div> */}
        <p className="student-last-active">Last active: {lastLogin}</p>
        <div className="student-actions">
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminStudents() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/users/role/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudents(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching students", err);
      });
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("All");

  const programs = [
    "All",
    "Advanced Placement",
    "STEM",
    "Arts",
    "General Education",
    "Honors",
    "International Baccalaureate",
  ];

  // Filter students based on search term and program
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram =
      filterProgram === "All" || student.program === filterProgram;

    return matchesSearch && matchesProgram;
  });

  // Add student function
  const handleAddStudent = () => {
    alert("Student added");
  };

  // Edit Student function

  // Delete Student function
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!deleteConfirm) {
      return;
    }

    axios
      .delete(`http://localhost:5005/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="students-container">
      <h1 className="students-title">Manage Students</h1>

      {/* Filters and Search */}
      <div className="students-filters">
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

        <div className="program-filter">
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="program-select"
          >
            {programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Grid */}
      {students.length > 0 ? (
        <div className="students-grid">
          {students.map((student) => (
            <StudentCard key={student.id} student={student.person} />
          ))}
        </div>
      ) : (
        <div className="no-students">
          <p className="no-students-message">
            No students found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterProgram("All");
            }}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Student Enrollment CTA */}
      <div className="enrollment-section">
        <h2 className="enrollment-title">Need to register new students?</h2>
        <p className="enrollment-description">
          Quickly add students to your institution and get them started with
          learning.
        </p>
        <button className="enrollment-btn">Start Enrollment Process</button>
        <button className="add-student-btn" onClick={handleAddStudent}>
          + Add Student
        </button>
      </div>
    </div>
  );
}
