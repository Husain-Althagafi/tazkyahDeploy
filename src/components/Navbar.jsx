import React from 'react';
import { Link } from "react-router-dom";
import navbarLogo from '../images/navbarLogo.png'
import '../styles/navbar.css';
//import end

function Navbar() {
  return (
    <nav>
      <img src={navbarLogo} alt="Tazkyah Logo" />
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/core-values">Core Values</Link></li>
        <li><Link to="/join-us">Join Us</Link></li>
        <li><Link to="/login-register">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;