import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/courseDetails.css'
import imgPath from '../images/image.png';
import { useEffect } from 'react';

function CourseDetails() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })

  const courseData = {
    title: 'SWE 363',
    description:
      'Web Development Course using HTML, CSS, and JS. Building upon those fundamentals, you learn react, and then tie it all together with a brief discussion about full-stack development.',
    image: 'https://placehold.co/400x400'
  }

    useEffect(() => {
      async function fetchCourses() {
        try {
          const response = await fetch('http://localhost:5000/api/courses/', {
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
  
         // setAllCourses(result.data); // Store the fetched courses
          //setFilteredCourses(result.data); // Show all courses initially
        } catch (error) {
          console.error('Error fetching courses:', error.message);
        }
      }
  
      fetchCourses();
    }, []);

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    navigate('/courses/course-details/enrolled')
  }

  const handleGoBack = () => {
    navigate('/courses')
  }
// Replace imgPath with courseData.imagePath later
  return (
    <div className="course-details-container">
      <div className="course-info">
        <div className="course-text">
          <h1>{courseData.title}</h1>
          <p>{courseData.description}</p>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go back
          </button>
        </div>
        <div className="course-image">
          <img className="img-format" src={imgPath} alt={courseData.title} />
        {/* </div>    ### Original code from main branch
          <img src={courseData.image} alt={courseData.title} />
        </div> */}
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

export default CourseDetails
