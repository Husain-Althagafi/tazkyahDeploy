import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './styles/global.css';

//component import
import LoginRegister from './components/LoginRegister';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CoursesPage from './components/CoursesPage';
import EnrollConfirmation from './components/EnrollConfirmation';
import Main from './components/Main';
import CourseDetails from './components/CourseDetails';
import Hero from './components/Hero';
import About from './components/About';
//component import end

function App() {
  return (
    <div className="app">
      <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<><Main/></>} />
        <Route path="/about" element={<><About/></>} />
        <Route path="/courses" element={<><CoursesPage/></>} />
        <Route path="/courses/course-details/:code" element={<><CourseDetails/></>} />
        <Route path="/courses/course-details/enrolled" element={<><EnrollConfirmation/></>} />
        <Route path="/core-values" element={<><About/></>} />
        <Route path="/join-us" element={<><Hero/></>} />
        <Route path="/login-register" element={<LoginRegister/>} />
      </Routes>
      <Footer/>
      </Router>
    </div>
  );
}

export default App;
