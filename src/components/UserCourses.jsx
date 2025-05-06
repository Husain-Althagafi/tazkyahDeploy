import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/usercourses.css';
import LoadingSpinner from './common/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

export default function UserCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { error: toastError } = useToast();
  
  // Available course categories (can be dynamic based on backend data)
  const categories = ['All', 'Web Development', 'JavaScript', 'Design', 'Computer Science', 'Mobile Development', 'Databases'];

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Get enrolled courses from backend
        const response = await axios.get('http://localhost:5005/api/courses/enrolled', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setEnrolledCourses(response.data.data);
        } else {
          throw new Error(response.data.error || 'Failed to fetch enrolled courses');
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError(err.message || 'Failed to load your courses');
        toastError('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, []);

  // Filter courses based on search term and category
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      filterCategory === 'All' || course.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle unenrolling from a course
  const handleUnenroll = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${courseName}"?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5005/api/courses/${courseId}/enroll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove course from state
      setEnrolledCourses(prev => prev.filter(course => course._id !== courseId));
    } catch (err) {
      console.error('Error unenrolling from course:', err);
      toastError(err.response?.data?.error || 'Failed to unenroll from course');
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading your courses..." />;
  }

  return (
    <div className="courses-container">
      <h1 className="courses-title">My Courses</h1>
      
      {/* Course statistics */}
      <div className="courses-stats">
        <div className="stat-box">
          <h3>{enrolledCourses.length}</h3>
          <p>Enrolled Courses</p>
        </div>
        <div className="stat-box">
          <h3>{enrolledCourses.filter(course => course.enrollment.progress === 100).length}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-box">
          <h3>
            {Math.round(
              enrolledCourses.reduce((sum, course) => sum + course.enrollment.progress, 0) / 
              (enrolledCourses.length || 1)
            )}%
          </h3>
          <p>Average Progress</p>
        </div>
      </div>
      
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="category-filter">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="courses-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="reload-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Course Grid */}
      {!error && (
        <>
          {enrolledCourses.length === 0 ? (
            <div className="no-courses">
              <p>You are not enrolled in any courses yet.</p>
              <Link to="/courses" className="browse-courses-btn">
                Browse Available Courses
              </Link>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="no-courses">
              <p>No courses match your search criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setFilterCategory('All');}}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="enrolled-courses">
              <h2>Enrolled Courses</h2>
              <div className="course-cards">
                {filteredCourses.map(course => (
                  <div 
                    key={course._id} 
                    className={`course-card ${course.enrollment.progress === 100 ? 'completed' : ''}`}
                  >
                    <div className="course-image">
                      <img 
                        src={course.imageUrl || "https://placehold.co/400x200?text=Course"} 
                        alt={course.title} 
                      />
                      {course.enrollment.progress === 100 && (
                        <div className="completed-badge">Completed</div>
                      )}
                    </div>
                    <div className="course-details">
                      <h3>{course.title}</h3>
                      <p>Instructor: {course.instructorName || 'Not specified'}</p>
                      
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${course.enrollment.progress}%` }}
                          ></div>
                        </div>
                        <div className="progress-info">
                          <span>{course.enrollment.progress}% Complete</span>
                          <span>Enrolled: {formatDate(course.enrollment.enrollmentDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="course-actions">
                      <Link to={`/courses/${course._id}/view`} className="course-button primary">
                        {course.enrollment.progress > 0 ? 'Continue' : 'Start'} Course
                      </Link>
                      <Link to={`/courses/${course._id}/resources`} className="course-button secondary">
                        Resources
                      </Link>
                      <button 
                        className="course-button danger"
                        onClick={() => handleUnenroll(course._id, course.title)}
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    
          {/* Recommended Courses Section */}
          <div className="recommended-courses">
            <h2>Recommended for You</h2>
            <p>Based on your enrolled courses and interests</p>
            <Link to="/courses" className="browse-button">
              Browse All Courses
            </Link>
          </div>
        </>
      )}
    </div>
  );
}