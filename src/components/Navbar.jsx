// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import navbarLogo from '../images/navbarLogo.png';
import '../styles/navbar.css';
import axios from 'axios';

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:5005/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token'); // Clear invalid token
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Check if current path matches the given path
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={navbarLogo} alt="Tazkyah Logo" />
      </Link>
      
      <ul className="navbar-links">
        {/* Links visible to all users */}
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={isActive('/about') ? 'active' : ''}>
          <Link to="/about">About</Link>
        </li>
        <li className={isActive('/courses') ? 'active' : ''}>
          <Link to="/courses">Courses</Link>
        </li>
        <li className={isActive('/core-values') ? 'active' : ''}>
          <Link to="/core-values">Core Values</Link>
        </li>
        
        {/* Conditional links based on user role */}
        {user ? (
          <>
            {/* Student links */}
            {user.role === 'student' && (
              <>
                <li className={isActive('/user-courses') ? 'active' : ''}>
                  <Link to="/user-courses">My Courses</Link>
                </li>
              </>
            )}
            
            {/* Instructor links */}
            {user.role === 'instructor' && (
              <>
                <li className={isActive('/instructor-courses') ? 'active' : ''}>
                  <Link to="/instructor-courses">My Teaching</Link>
                </li>
              </>
            )}
            
            {/* Admin links */}
            {user.role === 'admin' && (
              <>
                <li className={isActive('/admin-courses') ? 'active' : ''}>
                  <Link to="/admin-courses">Manage Courses</Link>
                </li>
                <li className={isActive('/admin-students') ? 'active' : ''}>
                  <Link to="/admin-students">Manage Students</Link>
                </li>
              </>
            )}
            
            {/* User menu dropdown */}
            <li className="user-dropdown">
              <button className="user-button">
                {user.firstName} {user.lastName} 
                <span className="dropdown-icon">▼</span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to={
                    user.role === 'admin' ? '/admin-profile' :
                    user.role === 'instructor' ? '/instructor-profile' : 
                    '/user-profile'
                  }>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={
                    user.role === 'admin' ? '/admin-settings' :
                    user.role === 'instructor' ? '/instructor-settings' : 
                    '/user-settings'
                  }>
                    Settings
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </>
        ) : (
          // Links for unauthenticated users
          <>
            <li className={isActive('/join-us') ? 'active' : ''}>
              <Link to="/join-us">Join Us</Link>
            </li>
            <li className={isActive('/login-register') ? 'active' : ''}>
              <Link to="/login-register" className="login-button">Login</Link>
            </li>
          </>
        )}
      </ul>
      
      {/* Mobile menu button */}
      <div className="mobile-menu-button">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default Navbar;