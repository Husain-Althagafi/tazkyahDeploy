import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5005/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token"); // Clear invalid token
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Verifying your access...</div>;
  }

  // No token or user data found
  if (!user) {
    return <Navigate to="/login-register" state={{ from: location }} replace />;
  }

  // User is authenticated but doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
