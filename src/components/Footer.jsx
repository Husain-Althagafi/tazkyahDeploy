import React from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../images/navbarLogo.png';
import '../styles/footer.css';

function Footer() {
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/core-values">Core Values</Link></li>
            <li><Link to="/join-us">Join Us</Link></li>
            <li><Link to="/login-register">Login / Register</Link></li>
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