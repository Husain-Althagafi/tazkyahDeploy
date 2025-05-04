import React from "react";
import { Link } from "react-router-dom";
import "../../styles/unauthorized.css";

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <div className="unauthorized-icon">🔒</div>
      <p>You don't have permission to access this page.</p>
      <div className="unauthorized-actions">
        <Link to="/" className="home-button">
          Return to Home
        </Link>
        <Link to="/login-register" className="login-button">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
