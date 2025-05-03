import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with auth header
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all resources for a course
export const getCourseResources = async (courseId) => {
  try {
    const response = await axios.get(
      `${API_URL}/resources/course/${courseId}`, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch resources';
  }
};

// Get resources by type for a course
export const getResourcesByType = async (courseId, type) => {
  try {
    const response = await axios.get(
      `${API_URL}/resources/course/${courseId}/type/${type}`, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch resources';
  }
};

// Search resources
export const searchResources = async (courseId, query) => {
  try {
    const response = await axios.get(
      `${API_URL}/resources/course/${courseId}/search?q=${query}`, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to search resources';
  }
};

// Get a single resource
export const getResource = async (resourceId) => {
  try {
    const response = await axios.get(
      `${API_URL}/resources/${resourceId}`, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch resource';
  }
};

// Download a resource
export const downloadResource = async (resourceId) => {
  try {
    const response = await axios.get(
      `${API_URL}/resources/${resourceId}/download`, 
      {
        ...createAuthHeader(),
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to download resource';
  }
};

// Upload a resource
export const uploadResource = async (courseId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/resources`, 
      formData, 
      {
        ...createAuthHeader(),
        headers: {
          ...createAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to upload resource';
  }
};

// Update a resource
export const updateResource = async (resourceId, updateData) => {
  try {
    const response = await axios.put(
      `${API_URL}/resources/${resourceId}`, 
      updateData, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update resource';
  }
};

// Delete a resource
export const deleteResource = async (resourceId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/resources/${resourceId}`, 
      createAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete resource';
  }
};