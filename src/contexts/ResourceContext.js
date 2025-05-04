// src/contexts/ResourceContext.js (improved)
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAxios } from "../services/authService";

const ResourceContext = createContext();

// Initial state
const initialState = {
  resources: [],
  loading: false,
  error: null,
  selectedResource: null,
  uploadProgress: 0,
  filters: {
    type: "all",
    search: "",
  },
};

// Reducer
function resourceReducer(state, action) {
  switch (action.type) {
    case "FETCH_RESOURCES_START":
      return { ...state, loading: true, error: null };
    case "FETCH_RESOURCES_SUCCESS":
      return { ...state, resources: action.payload, loading: false };
    case "FETCH_RESOURCES_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_SELECTED_RESOURCE":
      return { ...state, selectedResource: action.payload };
    case "SET_UPLOAD_PROGRESS":
      return { ...state, uploadProgress: action.payload };
    case "ADD_RESOURCE":
      return { ...state, resources: [action.payload, ...state.resources] };
    case "UPDATE_RESOURCE":
      return {
        ...state,
        resources: state.resources.map((resource) =>
          resource._id === action.payload._id ? action.payload : resource
        ),
      };
    case "DELETE_RESOURCE":
      return {
        ...state,
        resources: state.resources.filter(
          (resource) => resource._id !== action.payload
        ),
      };
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.name]: action.payload.value,
        },
      };
    case "RESET_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// Provider component
export const ResourceProvider = ({ children, courseId }) => {
  const [state, dispatch] = useReducer(resourceReducer, initialState);

  // Fetch resources when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchResources(courseId);
    }
  }, [courseId]);

  // Fetch all resources for a course
  const fetchResources = async (courseId) => {
    if (!courseId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      const response = await authAxios().get(`/resources/course/${courseId}`);
      
      if (response.data.success) {
        dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to fetch resources');
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to fetch resources'
      });
    }
  };

  // Filter resources by type
  const filterResourcesByType = async (courseId, type) => {
    if (!courseId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      let response;
      
      if (type === "all") {
        response = await authAxios().get(`/resources/course/${courseId}`);
      } else {
        response = await authAxios().get(`/resources/course/${courseId}/type/${type}`);
      }
      
      if (response.data.success) {
        dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: response.data.data });
        dispatch({ type: "SET_FILTER", payload: { name: "type", value: type } });
      } else {
        throw new Error(response.data.error || 'Failed to filter resources');
      }
    } catch (error) {
      console.error("Error filtering resources:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to filter resources'
      });
    }
  };

  // Search resources
  const searchResources = async (courseId, query) => {
    if (!courseId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      if (!query.trim()) {
        return fetchResources(courseId);
      }
      
      const response = await authAxios().get(
        `/resources/course/${courseId}/search?q=${encodeURIComponent(query)}`
      );
      
      if (response.data.success) {
        dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: response.data.data });
        dispatch({
          type: "SET_FILTER",
          payload: { name: "search", value: query },
        });
      } else {
        throw new Error(response.data.error || 'Failed to search resources');
      }
    } catch (error) {
      console.error("Error searching resources:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to search resources'
      });
    }
  };

  // Upload a resource with progress tracking
  const uploadResource = async (courseId, formData) => {
    if (!courseId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      // Ensure courseId is in formData
      if (!formData.get('courseId')) {
        formData.append('courseId', courseId);
      }
      
      // Configure progress tracking
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch({ type: "SET_UPLOAD_PROGRESS", payload: percentCompleted });
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await authAxios().post('/resources', formData, config);
      
      if (response.data.success) {
        dispatch({ type: "ADD_RESOURCE", payload: response.data.data });
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to upload resource');
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to upload resource'
      });
      throw error; // Re-throw for component handling
    }
  };

  // Update a resource
  const updateResource = async (resourceId, updateData) => {
    if (!resourceId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      const response = await authAxios().put(`/resources/${resourceId}`, updateData);
      
      if (response.data.success) {
        dispatch({ type: "UPDATE_RESOURCE", payload: response.data.data });
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to update resource');
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to update resource'
      });
      throw error; // Re-throw for component handling
    }
  };

  // Delete a resource
  const deleteResource = async (resourceId) => {
    if (!resourceId) return;
    
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      const response = await authAxios().delete(`/resources/${resourceId}`);
      
      if (response.data.success) {
        dispatch({ type: "DELETE_RESOURCE", payload: resourceId });
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to delete resource');
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to delete resource'
      });
      throw error; // Re-throw for component handling
    }
  };

  // Download a resource
  const downloadResource = async (resourceId, filename) => {
    if (!resourceId) return;
    
    try {
      const response = await authAxios().get(`/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error("Error downloading resource:", error);
      dispatch({ 
        type: "FETCH_RESOURCES_ERROR", 
        payload: error.response?.data?.error || error.message || 'Failed to download resource'
      });
      throw error; // Re-throw for component handling
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "RESET_ERROR" });
  };

  const value = {
    ...state,
    fetchResources,
    filterResourcesByType,
    searchResources,
    uploadResource,
    updateResource,
    deleteResource,
    downloadResource,
    clearError,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};

// Custom hook for using the resource context
export const useResources = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResources must be used within a ResourceProvider");
  }
  return context;
};