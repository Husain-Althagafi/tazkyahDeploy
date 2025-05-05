// src/components/CoreValues.jsx
import React from 'react';
import '../styles/corevalues.css';

function CoreValues() {
  return (
    <section className="core-values">
      <div className="core-values-container">
        <h1>Our Core Values</h1>
        
        <div className="values-intro">
          <p>
            At Tazkyah, our core values guide everything we do. They shape our teaching approach, 
            our interactions with students, and our vision for nurturing the next generation.
          </p>
        </div>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Growth Mindset</h3>
            <p>We believe in the potential of every child to grow and develop. We foster a growth mindset 
            that encourages children to embrace challenges, persist through obstacles, and see effort as 
            a path to mastery.</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Respect & Empathy</h3>
            <p>We teach children to respect themselves, others, and their environment. Through empathy 
            and understanding, children learn to appreciate diverse perspectives and build meaningful 
            relationships.</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Critical Thinking</h3>
            <p>We encourage children to think critically, ask questions, and explore ideas. By developing 
            strong analytical skills, children become independent thinkers capable of making sound decisions.</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Global Citizenship</h3>
            <p>We prepare children to become responsible global citizens who understand their place in the world 
            and their responsibility to contribute positively to society.</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">⚖️</div>
            <h3>Integrity & Ethics</h3>
            <p>We emphasize the importance of integrity, honesty, and ethical behavior. Children learn to 
            make principled choices and take responsibility for their actions.</p>
          </div>
          
          <div className="value-card">
            <div className="value-icon">🔄</div>
            <h3>Continuous Improvement</h3>
            <p>We are committed to continuously improving our teaching methods and curriculum to provide the 
            best possible learning experience for our students.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreValues;