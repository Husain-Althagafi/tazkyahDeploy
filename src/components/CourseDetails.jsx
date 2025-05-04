// src/components/CourseDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/courseDetails.css";
import LoadingSpinner from "./common/LoadingSpinner";

function CourseDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [courseDetails, setCourseDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // If logged in, get user info to pre-fill form
      fetchUserInfo(token);
    }
  }, []);

  // Fetch user information if logged in
  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get("http://localhost:5005/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch course details - Enhanced error handling and response processing
  useEffect(() => {
    async function fetchCourseDetails() {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching course details for code: ${code}`);
        const response = await axios.get(
          `http://localhost:5005/api/courses/${code}`
        );

        if (response.data.success) {
          console.log("Course details fetched:", response.data.data);
          setCourseDetails(response.data.data);
        } else {
          throw new Error(response.data.error || "Failed to fetch course details");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(
          err.response?.data?.error || 
          err.message || 
          "An error occurred while fetching course details"
        );
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      fetchCourseDetails();
    }
  }, [code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    setEnrollmentError(null);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setEnrollmentError("You must be logged in to enroll in courses");
        setEnrolling(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:5005/api/courses/${code}/enroll`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/courses/course-details/enrolled", {
          state: { course: courseDetails }
        });
      } else {
        setEnrollmentError(response.data.error || "Enrollment failed");
      }
    } catch (error) {
      console.error("Error during enrollment:", error);
      if (error.response?.data?.code === 11000) {
        setEnrollmentError('You are already enrolled in this course');
      }
      else {
        setEnrollmentError(
          error.response?.data?.error || "Failed to enroll in the course"
        );
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleGoBack = () => {
    navigate("/courses");
  };

  const handleLogin = () => {
    navigate("/login-register", { 
      state: { returnUrl: `/courses/course-details/${code}` } 
    });
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading course details..." />;
  }

  if (error) {
    return (
      <div className="course-error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleGoBack} className="go-back-btn">
          Go back to courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <div className="course-info">
        <div className="course-text">
          <h1>{courseDetails?.title || "Course details"}</h1>
          <p>{courseDetails?.description || "No description available"}</p>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go back
          </button>
        </div>
        <div className="course-image">
          <img
            src={courseDetails.img || "https://placehold.co/400x400"}
            alt={courseDetails.title || "Course image"}
            className="img-format"
          />
        </div>
      </div>

      <div className="registration-section">
        <h2>Course Registration Form</h2>
        
        {!isLoggedIn ? (
          <div className="login-prompt">
            <p>You need to be logged in to enroll in this course.</p>
            <button onClick={handleLogin} className="login-redirect-btn">
              Log in to continue
            </button>
          </div>
        ) : (
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

            {enrollmentError && (
              <div className="enrollment-error">{enrollmentError}</div>
            )}

            <div className="form-group submit-group">
              <button 
                type="submit" 
                className="enroll-btn"
                disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;