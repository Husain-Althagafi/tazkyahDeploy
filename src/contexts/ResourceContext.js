import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as resourceService from "../services/resourceService";

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
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      const { data } = await resourceService.getCourseResources(courseId);
      dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
    }
  };

  // Filter resources by type
  const filterResourcesByType = async (courseId, type) => {
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      let data;
      if (type === "all") {
        data = await resourceService.getCourseResources(courseId);
      } else {
        data = await resourceService.getResourcesByType(courseId, type);
      }
      dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: data.data });
      dispatch({ type: "SET_FILTER", payload: { name: "type", value: type } });
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
    }
  };

  // Search resources
  const searchResources = async (courseId, query) => {
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      if (!query.trim()) {
        return fetchResources(courseId);
      }
      const { data } = await resourceService.searchResources(courseId, query);
      dispatch({ type: "FETCH_RESOURCES_SUCCESS", payload: data });
      dispatch({
        type: "SET_FILTER",
        payload: { name: "search", value: query },
      });
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
    }
  };

  // Upload a resource with progress tracking
  const uploadResource = async (courseId, formData) => {
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      // Add onUploadProgress handler to axios
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch({ type: "SET_UPLOAD_PROGRESS", payload: percentCompleted });
        },
      };

      const { data } = await resourceService.uploadResource(
        courseId,
        formData,
        config
      );
      dispatch({ type: "ADD_RESOURCE", payload: data.data });
      return data;
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
      throw error;
    }
  };

  // Update a resource
  const updateResource = async (resourceId, updateData) => {
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      const { data } = await resourceService.updateResource(
        resourceId,
        updateData
      );
      dispatch({ type: "UPDATE_RESOURCE", payload: data.data });
      return data;
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
      throw error;
    }
  };

  // Delete a resource
  const deleteResource = async (resourceId) => {
    dispatch({ type: "FETCH_RESOURCES_START" });
    try {
      await resourceService.deleteResource(resourceId);
      dispatch({ type: "DELETE_RESOURCE", payload: resourceId });
    } catch (error) {
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
      throw error;
    }
  };

  // Download a resource
  const downloadResource = async (resourceId, filename) => {
    try {
      const blob = await resourceService.downloadResource(resourceId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
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
      dispatch({ type: "FETCH_RESOURCES_ERROR", payload: error });
      throw error;
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
