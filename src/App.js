import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
<<<<<<< HEAD
import ConfirmedRegistration from './components/ConfirmedRegistration';
import LoginRegister from './components/LoginRegister';
import { FilterBar, NewCourses, MainHeader} from "./components/CoursesR";



function App() {
  return (
    <ConfirmedRegistration/>
=======
import LoginRegister from './components/LoginRegister';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
//import end

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/about" element={<></>} />
            <Route path="/courses" element={<></>} />
            <Route path="/core-values" element={<></>} />
            <Route path="/join-us" element={<></>} />
            <Route path="/login-register" element={<LoginRegister/>} />
          </Routes>
          <Footer/>
        </Router>
      </header>
    </div>
>>>>>>> oukba
  );
}

export default App;