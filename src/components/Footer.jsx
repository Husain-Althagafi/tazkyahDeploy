import React from 'react';
import footerLogo from '../images/navbarLogo.png'
import '../styles/footer.css'
//import end

function Footer() {
  return (
    <footer>
      <div className="logo-secondary">
        <img src={footerLogo} alt="Tazkyah Logo" />
      </div>

      <section className="footer-navigation">
        <nav>
          <h3>Doormat Navigation</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#menu">Courses</a></li>
            <li><a href="#reservations">Core Values</a></li>
            <li><a href="#order-online">Join Us</a></li>
            <li><a href="#login">Login</a></li>
          </ul>
        </nav>
      </section>

      <section className="contact">
        <h3>Contact</h3>
        <p>Address</p>
        <p>Phone number</p>
        <p>Email</p>
      </section>

      <section className="social-media">
        <h3>Social Media Links</h3>
        <p>Address</p>
        <p>Phone number</p>
        <p>Email</p>
      </section>
    </footer>
  );
}

export default Footer;
