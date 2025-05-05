import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';
import { authAxios } from '../services/authService';

// Import the image from the images folder
import tazkyahBook from '../images/tazkyahBook.png';

function Hero() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
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

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('user-logout', handleLogout);
    
    fetchUserData();

    return () => {
      window.removeEventListener('user-logout', handleLogout);
    };
  }, []);

  // Render buttons based on user role
  const renderActionButtons = () => {
    if (loading) {
      return <div className="loading-button">Loading...</div>;
    }

    if (!user) {
      // Guest user
      return (
        <div className="hero-actions">
          <Link to="/courses">
            <button className="primary-action">Browse Courses</button>
          </Link>
          <Link to="/login-register">
            <button className="secondary-action">Sign Up / Login</button>
          </Link>
        </div>
      );
    }

    switch (user.role) {
      case 'admin':
        return (
          <div className="hero-actions">
            <Link to="/admin-courses">
              <button className="primary-action">Manage Courses</button>
            </Link>
            <Link to="/admin-students">
              <button className="secondary-action">Manage Students</button>
            </Link>
          </div>
        );
      case 'instructor':
        return (
          <div className="hero-actions">
            <Link to="/instructor-courses">
              <button className="primary-action">My Teaching</button>
            </Link>
          </div>
        );
      case 'student':
        return (
          <div className="hero-actions">
            <Link to="/user-courses">
              <button className="primary-action">My Courses</button>
            </Link>
            <Link to="/courses">
              <button className="secondary-action">Browse Courses</button>
            </Link>
          </div>
        );
      default:
        return (
          <Link to="/courses">
            <button>Available Courses</button>
          </Link>
        );
    }
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Tazkyah</h1>
        <h2>Welcome{user ? `, ${user.firstName}` : ''}!</h2>
        <p>
          The growth and purity of goodness in the souls of our children. A generation is being built - a country is rising
        </p>
        {renderActionButtons()}
      </div>
      <img src={tazkyahBook} alt="Tazkyah book logo" />
    </section>
  );
}

export default Hero;