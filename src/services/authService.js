// src/services/authService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Get stored token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return response.data;
    } else {
      throw new Error(response.data.error || "Login failed");
    }
  } catch (error) {
    throw error.response?.data?.error || error.message || "Login failed";
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return response.data;
    } else {
      throw new Error(response.data.error || "Registration failed");
    }
  } catch (error) {
    throw error.response?.data?.error || error.message || "Registration failed";
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid, log out
      logout();
    }
    throw (
      error.response?.data?.error || error.message || "Failed to get user data"
    );
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      throw new Error(response.data.error || "Failed to refresh token");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid, log out
      logout();
    }
    throw (
      error.response?.data?.error || error.message || "Failed to refresh token"
    );
  }
};

// Create axios instance with auth header
export const authAxios = () => {
  const token = getToken();

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth header if token exists
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Add response interceptor to handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and not a retry, attempt to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();

          // Update authorization header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Retry the original request
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          logout();
          window.location.href = "/login-register";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
