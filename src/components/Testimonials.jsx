import React from 'react';
import '../styles/testimonials.css';

// Import the images from the ./images folder
import SmilingDude from '../images/SmilingDude.jpg';
import OldLady from '../images/OldLady.jpg';
import CoolDude from '../images/CoolDude.png';
import WeirdLady from '../images/WeirdLady.png';

function Testimonials() {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial-cards">
        <article className="testimonial">
          <p>10/10</p>
          <img src={SmilingDude} alt="Testimonial from Miguel" />
          <h3>Miguel</h3>
          <p>Had a great anniversary party with my wife!</p>
        </article>
        <article className="testimonial">
          <p>8/10</p>
          <img src={OldLady} alt="Testimonial from Maria" />
          <h3>Maria</h3>
          <p>Great Mexican food!</p>
        </article>
        <article className="testimonial">
          <p>9/10</p>
          <img src={CoolDude} alt="Testimonial from Jin" />
          <h3>Jin</h3>
          <p>Great place to eat and chill with family!</p>
        </article>
        <article className="testimonial">
          <p>9/10</p>
          <img src={WeirdLady} alt="Testimonial from Amara" />
          <h3>Amara</h3>
          <p>Had a great birthday party with my friends!</p>
        </article>
      </div>
    </section>
  );
}

export default Testimonials;