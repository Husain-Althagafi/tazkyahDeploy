// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../images/navbarLogo.png';
import '../styles/footer.css';
import { authAxios } from '../services/authService';

function Footer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
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
  }, []); 

  // Navigation links based on user role
  const getNavigationLinks = () => {
    if (!user) {
      // Guest navigation links
      return (
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/core-values">Core Values</Link></li>
          <li><Link to="/join-us">Join Us</Link></li>
          <li><Link to="/login-register">Login / Register</Link></li>
        </>
      );
    }

    // Common links for all authenticated users
    const commonLinks = (
      <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/core-values">Core Values</Link></li>
      </>
    );

    // Role-specific links
    if (user.role === 'admin') {
      return (
        <>
          {commonLinks}
          <li><Link to="/admin-courses">Manage Courses</Link></li>
          <li><Link to="/admin-students">Manage Students</Link></li>
          <li><Link to="/admin-schools">Manage Schools</Link></li>
          <li><Link to="/admin-profile">Profile</Link></li>
        </>
      );
    } else if (user.role === 'instructor') {
      return (
        <>
          {commonLinks}
          <li><Link to="/instructor-courses">My Teaching</Link></li>
          <li><Link to="/instructor-profile">Profile</Link></li>
        </>
      );
    } else { // student
      return (
        <>
          {commonLinks}
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/user-courses">My Courses</Link></li>
          <li><Link to="/user-profile">Profile</Link></li>
        </>
      );
    }
  };

  return (
    <footer>
      <div className="logo-secondary">
        <Link to="/">
          <img src={footerLogo} alt="Tazkyah Logo" />
        </Link>
      </div>

      <section className="footer-navigation">
        <nav>
          <h3>Navigation</h3>
          <ul>
            {!loading && getNavigationLinks()}
          </ul>
        </nav>
      </section>

      <section className="contact">
        <h3>Contact Us</h3>
        <p>Email: contact@tazkyah.org</p>
        <p>Phone: +966 123 456 789</p>
        <p>Riyadh, Saudi Arabia</p>
      </section>

      <section className="social-media">
        <h3>Connect With Us</h3>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </section>
    </footer>
  );
}

export default Footer;