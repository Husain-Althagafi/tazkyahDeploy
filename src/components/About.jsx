import React from 'react';
import '../styles/about.css';

// Import the images from the images folder
import navbarLogo from '../images/navbarLogo.png';

function About() {
  return (
    <section className="about">
      <div className="about-text">
        <h2>Tazkyah</h2>
        <h3>About us</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      </div>

      <div className="about-images">
        <img src={navbarLogo} alt="About" />
        <img src={navbarLogo} alt="About" />
        <img src={navbarLogo} alt="About" />
      </div>
    </section>
  );
}

export default About;