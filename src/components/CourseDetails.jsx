import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/courseDetails.css'

function CourseDetails() {
    const { courseId } = useParams(); // getting the ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    // This should come from an API. Below is just a sample.
    const courseData = {
      title: "SWE 363",
      description:
        "Web Development Course using HTML, CSS, and JS. Building upon those fundamentals, you learn react, and then tie itv all together with a brief discussion about full-stack development.",
      image: "https://placehold.co/400x400" // placeholder image
    };

    // function that handles any change
    const handleChange = (e) => {
        // destructuring
        const { name, value } = e.target;
        // adding the new values to our variables
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // when submitting the form
    const handleSubmit = (e) => {
        e.preventDefault(); // essential to add our own behavior
        console.log('Form submitted:', formData);
        
        // Sending Data to Backend occurs here.
        // After a successful submission, we need to redirect to enrollment confirmation page
        navigate('/join-us');
    };

    // Going Back: Needs to be checked depending on the team's work
    const handleGoBack = () => {
        navigate('/courses');
    }

    // returning the Component

    return (
        <div className="course-details-container">
            <div className="course-info">
                <div className="course-text">
                    <h1>{courseData.title}</h1>
                    <p>{courseData.description}</p>
                    <button className="go-back-btn" onClick={handleGoBack}>Go back</button>
                </div>

                <div className="course-image">
                    <img src={courseData.image} alt={courseData.title} />
                </div>
            </div>

            <div className="registration-section">
                <h2>Course Registration Form</h2>
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <input
                                type="text"
                                id="lastName"
                                name="lastname"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="form-group">
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        </div>
                    </div>

                    <div className="form-group submit-group">
                        <button type="submit" className="enroll-btn">Enroll</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CourseDetails;