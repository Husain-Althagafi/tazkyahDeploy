// src/components/instructor/CourseForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/courseFormInstructor.css";
import { useToast } from "../../contexts/ToastContext";
import LoadingSpinner from "../common/LoadingSpinner";

const CourseForm = () => {
  const { id } = useParams(); // This could be course._id
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    status: "upcoming",
    enrollmentCapacity: 30,
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  const [courseImage, setCourseImage] = useState(null);

  useEffect(() => {
    // If ID is provided, fetch course data for editing
    if (id) {
      const fetchCourse = async () => {
        try {
          const token = localStorage.getItem("token");
          // Try fetching by id first
          const response = await axios.get(
            `http://localhost:5005/api/courses/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            const course = response.data.data;

            // Format dates for date inputs
            const formatDate = (dateString) => {
              if (!dateString) return "";

              const date = new Date(dateString);
              return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            };

            setFormData({
              title: course.title || "",
              code: course.code || "",
              description: course.description || "",
              status: course.status || "upcoming",
              enrollmentCapacity: course.enrollmentCapacity || 30,
              startDate: formatDate(course.startDate),
              endDate: formatDate(course.endDate),
              imageUrl: course.imageUrl || course.img || "",
            });
          } else {
            throw new Error("Failed to fetch course details");
          }
        } catch (err) {
          console.error("Error fetching course details:", err);
          
          // If we get an error, let's try fetching by course code as a fallback
          try {
            // Try assuming the id is actually a course code
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `http://localhost:5005/api/courses/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.data.success) {
              const course = response.data.data;

              // Format dates for date inputs
              const formatDate = (dateString) => {
                if (!dateString) return "";

                const date = new Date(dateString);
                return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
              };

              setFormData({
                title: course.title || "",
                code: course.code || "",
                description: course.description || "",
                status: course.status || "upcoming",
                enrollmentCapacity: course.enrollmentCapacity || 30,
                startDate: formatDate(course.startDate),
                endDate: formatDate(course.endDate),
                imageUrl: course.imageUrl || course.img || "",
              });
            } else {
              throw new Error("Failed to fetch course details");
            }
          } catch (secondErr) {
            console.error("Error fetching course details (2nd attempt):", secondErr);
            setError("Failed to load course data");
            toastError("Failed to load course data");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id, toastError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastError("Image size exceeds 5MB limit");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toastError("Only image files are allowed");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setCourseImage({
          file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Course title is required");
      }

      if (!formData.code.trim()) {
        throw new Error("Course code is required");
      }

      // Format data for submission
      const courseData = {
        ...formData,
        enrollmentCapacity: parseInt(formData.enrollmentCapacity, 10) || 30,
      };

      let response;
      let courseCode = formData.code;

      if (id) {
        // If there's a course image, update the imageUrl in the courseData
        if (courseImage?.file) {
          // Prepare a reader to convert the image file to a data URL
          const reader = new FileReader();
          
          reader.onload = async () => {
            const imageData = reader.result;
            
            // Include the image data in the course update
            const updatedCourseData = {
              ...courseData,
              imageUrl: imageData,
              img: imageData // Include both imageUrl and img for compatibility
            };
            
            // Update existing course
            try {
              response = await axios.put(
                `http://localhost:5005/api/courses/${courseCode}`,
                updatedCourseData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              
              if (response.data.success) {
                success("Course updated successfully!");
                navigate("/instructor-courses");
              } else {
                throw new Error(response.data.error || "Failed to update course");
              }
            } catch (err) {
              console.error("Error updating course:", err);
              setError(
                err.response?.data?.error || err.message || "Failed to update course"
              );
              toastError(
                err.response?.data?.error || err.message || "Failed to update course"
              );
              setSubmitting(false);
            }
          };
          
          reader.readAsDataURL(courseImage.file);
          return; // Exit early since we're handling the submit in the reader.onload callback
        } else {
          // Update without image change
          response = await axios.put(
            `http://localhost:5005/api/courses/${courseCode}`,
            courseData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } else {
        // Creating a new course
        if (courseImage?.file) {
          // Convert image to data URL for new course
          const reader = new FileReader();
          
          reader.onload = async () => {
            const imageData = reader.result;
            
            // Include the image data in the new course
            const newCourseData = {
              ...courseData,
              imageUrl: imageData,
              img: imageData
            };
            
            try {
              response = await axios.post(
                "http://localhost:5005/api/courses",
                newCourseData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              
              if (response.data.success) {
                success("Course created successfully!");
                navigate("/instructor-courses");
              } else {
                throw new Error(response.data.error || "Failed to create course");
              }
            } catch (err) {
              console.error("Error creating course:", err);
              setError(
                err.response?.data?.error || err.message || "Failed to create course"
              );
              toastError(
                err.response?.data?.error || err.message || "Failed to create course"
              );
              setSubmitting(false);
            }
          };
          
          reader.readAsDataURL(courseImage.file);
          return; // Exit early
        } else {
          // Create without image
          response = await axios.post(
            "http://localhost:5005/api/courses",
            courseData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      // Handle response for cases without image processing
      if (response && response.data.success) {
        success(
          id ? "Course updated successfully!" : "Course created successfully!"
        );
        navigate("/instructor-courses");
      } else if (response) {
        throw new Error(response.data.error || "Failed to save course");
      }
    } catch (err) {
      console.error("Error saving course:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to save course"
      );
      toastError(
        err.response?.data?.error || err.message || "Failed to save course"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/instructor-courses");
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading course data..." />;
  }

  return (
    <div className="course-form-container">
      <h1 className="form-title">{id ? "Edit Course" : "Create New Course"}</h1>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-layout">
          <div className="form-main">
            <div className="form-group">
              <label htmlFor="title">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="Enter a unique code (e.g., CS101)"
                disabled={!!id} // Disable code editing for existing courses
              />
              {id && (
                <p className="field-hint">
                  Course code cannot be changed after creation
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the course content and objectives"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="enrollmentCapacity">Enrollment Capacity</label>
                <input
                  type="number"
                  id="enrollmentCapacity"
                  name="enrollmentCapacity"
                  value={formData.enrollmentCapacity}
                  onChange={handleChange}
                  min="1"
                  max="500"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-sidebar">
            <div className="image-upload-container">
              <label className="image-label">Course Image</label>
              <div className="image-preview">
                {courseImage?.preview ? (
                  <img src={courseImage.preview} alt="Course Preview" />
                ) : formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Course" />
                ) : (
                  <div className="image-placeholder">
                    <span>No image selected</span>
                  </div>
                )}
              </div>
              <div className="image-upload-actions">
                <label className="image-upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {formData.imageUrl || courseImage
                    ? "Change Image"
                    : "Upload Image"}
                </label>
                {(formData.imageUrl || courseImage) && (
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => {
                      setCourseImage(null);
                      setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="image-hint">Recommended size: 800x400px, max 5MB</p>
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update Course"
              : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;