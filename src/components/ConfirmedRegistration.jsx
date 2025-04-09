import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EnrollConfirmation.css';

function ConfirmedRegistration() {
  

  return (
    <section className="confirmed-registration">
      <h1>Registration Confirmed!</h1>
      <h2>Your enrollment has been successfully processed. We look forward to seeing you!</h2>
      <button>Return to Home</button>
    </section>
  );
}

export default ConfirmedRegistration;