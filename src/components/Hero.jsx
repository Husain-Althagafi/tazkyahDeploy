import React from 'react';
import '../styles/hero.css';

// Import the image from the images folder
import navbarLogo from '../images/navbarLogo.png';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Tazkyah</h1>
        <h2>Welcome!</h2>
        <p>
          The growth and purity of goodness in the souls of our children. A generation is being built - a country is rising
        </p>
        <button>Available Courses</button>
      </div>
      <img src={navbarLogo} alt="Tazkyah logo" />
    </section>
  );
}

export default Hero;