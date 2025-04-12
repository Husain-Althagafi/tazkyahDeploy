import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

//component import
import LoginRegister from './components/LoginRegister';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CoursesPage from './components/CoursesPage';
import EnrollConfirmation from './components/EnrollConfirmation';
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
            <Route path="/courses" element={<><CoursesPage/></>} />
            <Route path="/core-values" element={<></>} />
            <Route path="/join-us" element={<><EnrollConfirmation/></>} />
            <Route path="/login-register" element={<LoginRegister/>} />
          </Routes>
          <Footer/>
        </Router>
      </header>
    </div>
  );
}

export default App;