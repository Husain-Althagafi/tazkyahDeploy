// src/components/EnrollConfirmation.jsx (without image dependency)
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/enrollconfirmation.css';

function EnrollConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [courseDetails, setCourseDetails] = useState(null);
  
  useEffect(() => {
    // Try to get course details from location state
    if (location.state?.course) {
      setCourseDetails(location.state.course);
    }
    
    // Set up a timer to automatically redirect after 10 seconds
    const timer = setTimeout(() => {
      handleViewMyCourses();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [location]);

  const handleViewMyCourses = () => {
    navigate('/user-courses');
  };
  
  const handleViewCourse = () => {
    if (courseDetails?._id) {
      navigate(`/courses/${courseDetails._id}/view`);
    } else {
      navigate('/user-courses');
    }
  };
  
  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  return (
    <section className="confirmed-registration">
      <div className="enrollment-success-card">
        <div className="success-icon">✅</div>
        
        <h1>Enrollment Confirmed!</h1>
        
        {courseDetails ? (
          <h2>You have successfully enrolled in "{courseDetails.title}"</h2>
        ) : (
          <h2>Your enrollment has been successfully processed.</h2>
        )}
        
        <p className="success-message">
          We're excited to have you join this learning journey. Your course is now available in your dashboard, and you can start learning right away.
        </p>
        
        <div className="enrollment-actions">
          <button onClick={handleViewCourse} className="primary-action">
            Start Learning Now
          </button>
          <button onClick={handleViewMyCourses} className="secondary-action">
            View My Courses
          </button>
          <button onClick={handleBrowseCourses} className="text-action">
            Browse More Courses
          </button>
        </div>
        
        <div className="auto-redirect">
          You will be automatically redirected to your courses in 10 seconds...
        </div>
      </div>
    </section>
  );
}

export default EnrollConfirmation;