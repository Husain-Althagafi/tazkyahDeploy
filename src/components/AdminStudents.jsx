import { useState } from 'react';
import '../styles/adminstudents.css';

// StudentCard component for displaying individual students
function StudentCard({ student }) {
  const { name, grade, attendance, image, program, lastActive } = student;
  
  const handleDelete = () => {
    alert('Student deleted');
  };
  
  const handleEdit = () => {
    alert('Student is being edited');
  };
  
  return (
    <div className="student-card">
      <div className="student-image-container">
        <img 
          src={image} 
          alt={name} 
          className="student-image"
        />
        <div className="student-program">{program}</div>
      </div>
      <div className="student-content">
        <h3 className="student-name">{name}</h3>
        <p className="student-grade">Grade: {grade}</p>
        <div className="student-attendance-container">
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
        </div>
        <p className="student-last-active">Last active: {lastActive}</p>
        <div className="student-actions">
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminStudents() {
  // Sample student data
  const [students] = useState([
    {
      id: 1,
      name: "Emma Thompson",
      grade: "10th",
      attendance: 95,
      image: "/api/placeholder/400/300",
      program: "Advanced Placement",
      lastActive: "May 1, 2025"
    },
    {
      id: 2,
      name: "Alex Rivera",
      grade: "12th",
      attendance: 88,
      image: "/api/placeholder/400/300",
      program: "STEM",
      lastActive: "April 30, 2025"
    },
    {
      id: 3,
      name: "Jordan Smith",
      grade: "9th",
      attendance: 92,
      image: "/api/placeholder/400/300",
      program: "Arts",
      lastActive: "April 29, 2025"
    },
    {
      id: 4,
      name: "Taylor Johnson",
      grade: "11th",
      attendance: 78,
      image: "/api/placeholder/400/300",
      program: "General Education",
      lastActive: "April 28, 2025"
    },
    {
      id: 5,
      name: "Morgan Lee",
      grade: "10th",
      attendance: 97,
      image: "/api/placeholder/400/300",
      program: "Honors",
      lastActive: "May 1, 2025"
    },
    {
      id: 6,
      name: "Casey Williams",
      grade: "12th",
      attendance: 85,
      image: "/api/placeholder/400/300",
      program: "International Baccalaureate",
      lastActive: "April 30, 2025"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  
  const programs = ['All', 'Advanced Placement', 'STEM', 'Arts', 'General Education', 'Honors', 'International Baccalaureate'];

  // Filter students based on search term and program
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'All' || student.program === filterProgram;
    
    return matchesSearch && matchesProgram;
  });

  const handleAddStudent = () => {
    alert('Student added');
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="program-filter">
          <select 
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="program-select"
          >
            {programs.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Student Grid */}
      {filteredStudents.length > 0 ? (
        <div className="students-grid">
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="no-students">
          <p className="no-students-message">No students found matching your filters.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterProgram('All');}}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}
      
      {/* Student Enrollment CTA */}
      <div className="enrollment-section">
        <h2 className="enrollment-title">Need to register new students?</h2>
        <p className="enrollment-description">Quickly add students to your institution and get them started with learning.</p>
        <button className="enrollment-btn">
          Start Enrollment Process
        </button>
        <button className="add-student-btn" onClick={handleAddStudent}>
          + Add Student
        </button>
      </div>
    </div>
  );
}