// src/components/About.jsx
import React from 'react';
import '../styles/about.css';

// Import the images from the images folder
import teamImage from '../images/navbarLogo.png'; // Replace with actual team image
import classroomImage from '../images/navbarLogo.png'; // Replace with classroom image
import studentsImage from '../images/navbarLogo.png'; // Replace with students image

function About() {
  return (
    <section className="about">
      <div className="about-text">
        <h2>About Tazkyah</h2>
        <h3>Our Story</h3>
        <p>
          Tazkyah was founded in 2020 with a mission to nurture a generation of responsible 
          and principled youth. We recognized the growing challenges parents face in balancing 
          work demands and technological changes while instilling strong moral values in their children.
        </p>
        <p>
          Our team of over 15 professional mentors brings decades of experience in education, 
          child development, and ethics. We've designed our curriculum to be engaging, interactive, 
          and effective in planting essential moral values that will guide children throughout their lives.
        </p>
        <p>
          Today, Tazkyah serves hundreds of families across the country, providing a supportive 
          community where children can learn, grow, and develop into the leaders of tomorrow.
        </p>
      </div>

      <div className="about-images">
        <img src={teamImage} alt="Our Team" />
        <img src={classroomImage} alt="Our Classroom" />
        <img src={studentsImage} alt="Our Students" />
      </div>
    </section>
  );
}

export default About;