// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import navbarLogo from '../images/navbarLogo.png';
import '../styles/navbar.css';
import { authAxios } from '../services/authService';

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user data on component mount and when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const response = await authAxios().get('/auth/me');
        
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          // Handle invalid token
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token'); // Clear invalid token
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [location.pathname]); // Re-fetch when route changes to ensure navbar updates

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);

    window.dispatchEvent(new CustomEvent('user-logout'));

    navigate('/');

    window.location.reload();
  };

  // Check if current path matches the given path
  const isActive = (path) => location.pathname === path;

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={navbarLogo} alt="Tazkyah Logo" />
      </Link>
      
      <div className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Common links for all users */}
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        </li>
        <li className={isActive('/about') ? 'active' : ''}>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
        </li>
        
        {/* Show Courses link for everyone except admins and instructors */}
        {(!user || (user?.role !== 'admin' && user?.role !== 'instructor')) && (
          <li className={isActive('/courses') ? 'active' : ''}>
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
          </li>
        )}
        
        <li className={isActive('/core-values') ? 'active' : ''}>
          <Link to="/core-values" onClick={() => setMobileMenuOpen(false)}>Core Values</Link>
        </li>
        
        {loading ? (
          // Show loading state
          <li className="loading-indicator">
            <span>Loading...</span>
          </li>
        ) : user ? (
          // Authenticated user - show role-specific links
          <>
            {/* Student links */}
            {user.role === 'student' && (
              <li className={isActive('/user-courses') ? 'active' : ''}>
                <Link to="/user-courses" onClick={() => setMobileMenuOpen(false)}>My Courses</Link>
              </li>
            )}
            
            {/* Instructor links */}
            {user.role === 'instructor' && (
              <li className={isActive('/instructor-courses') ? 'active' : ''}>
                <Link to="/instructor-courses" onClick={() => setMobileMenuOpen(false)}>My Teaching</Link>
              </li>
            )}
            
            {/* Admin links */}
            {user.role === 'admin' && (
              <>
                <li className={isActive('/admin-courses') ? 'active' : ''}>
                  <Link to="/admin-courses" onClick={() => setMobileMenuOpen(false)}>Manage Courses</Link>
                </li>
                <li className={isActive('/admin-students') ? 'active' : ''}>
                  <Link to="/admin-students" onClick={() => setMobileMenuOpen(false)}>Manage Students</Link>
                </li>
              </>
            )}
            
            {/* User dropdown menu */}
            <li className="user-dropdown">
              <button className="user-button">
                {user.firstName} {user.lastName} 
                <span className="dropdown-icon">▼</span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to={
                      user.role === 'admin' ? '/admin-profile' :
                      user.role === 'instructor' ? '/instructor-profile' : 
                      '/user-profile'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to={
                      user.role === 'admin' ? '/admin-settings' :
                      user.role === 'instructor' ? '/instructor-settings' : 
                      '/user-settings'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
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
          // Guest links
          <>
            <li className={isActive('/login-register') ? 'active' : ''}>
              <Link to="/login-register" className="login-button" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;