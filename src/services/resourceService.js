// src/services/resourceService.js (improved error handling)
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with auth header
const createAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all resources for a course
export const getCourseResources = async (courseId) => {
  try {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const response = await axios.get(
      `${API_URL}/resources/course/${courseId}`,
      createAuthHeader()
    );

    return response.data;
  } catch (error) {
    // Handle token errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Clear invalid token
      throw new Error("Your session has expired. Please log in again.");
    }

    throw (
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch resources"
    );
  }
};

// Upload a resource with better error handling
export const uploadResource = async (courseId, formData, config = {}) => {
  try {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const headers = createAuthHeader().headers;

    // Create a new FormData instance if the provided formData doesn't have the courseId
    if (!formData.get("courseId")) {
      const newFormData = new FormData();
      newFormData.append("courseId", courseId);

      // Copy all entries from the original formData
      for (const [key, value] of formData.entries()) {
        if (key !== "courseId") {
          // Avoid duplication
          newFormData.append(key, value);
        }
      }

      formData = newFormData;
    }

    const response = await axios.post(`${API_URL}/resources`, formData, {
      ...config,
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    // Check if the error is a network error (CORS, server down, etc.)
    if (error.message === "Network Error") {
      throw new Error(
        "Network error: Unable to connect to the server. Please check your connection."
      );
    }

    // Handle token errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Clear invalid token
      throw new Error("Your session has expired. Please log in again.");
    }

    // Handle file size errors
    if (error.response?.status === 413) {
      throw new Error("The file is too large. Maximum size allowed is 10MB.");
    }

    // Check for specific error messages in the response
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to upload resource";

    throw new Error(errorMessage);
  }
};
