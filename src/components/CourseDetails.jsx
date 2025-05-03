import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/courseDetails.css'
import imgPath from '../images/image.png';
import { useEffect } from 'react';

function CourseDetails() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })
  const [courseDetails, setCourseDetails] = useState({})

// Finally working on the displaying the course by code!
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`http://localhost:5005/api/courses/${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const result = await response.json();
        console.log(result); // Just for debugging

        setCourseDetails(result.data);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    }

    fetchCourses();
  }, [code]);
  

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token'); 
  
      const response = await fetch(`http://localhost:5005/api/courses/${code}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to enroll');
      }
  
      const result = await response.json();
      console.log('Enrollment successful:', result);
  
      navigate('/courses/course-details/enrolled');
    } catch (error) {
      console.error('Error during enrollment:', error.message);
    }
  }
  

  const handleGoBack = () => {
    navigate('/courses')
  }
// Replace imgPath with courseData.imagePath later
  return (
    <div className="course-details-container">
      <div className="course-info">
        <div className="course-text">
          <h1>{courseDetails?.title || 'Loading title...'}</h1>
          <p>{courseDetails?.description || 'Loading description...'}</p>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go back
          </button>
        </div>
        <div className="course-image">
        <img src={courseDetails.img || 'https://placehold.co/400x400'} alt={courseDetails.title} />
        </div>
      </div>
  
      <div className="registration-section">
        <h2>Course Registration Form</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group floating">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder=" "
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="form-group floating">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder=" "
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group floating">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group floating">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder=" "
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <label htmlFor="phoneNumber">Phone Number</label>
            </div>
          </div>

          <div className="form-group submit-group">
            <button type="submit" className="enroll-btn">
              Enroll
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseDetails;
