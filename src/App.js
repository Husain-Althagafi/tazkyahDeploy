import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './styles/global.css';
import './styles/user-dashboard.css'; // Import the new CSS file
import './styles/user-components.css'; // Import user component styles

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
import UserProfile from './components/UserProfile';
import UserCourses from './components/UserCourses';
import UserSettings from './components/UserSettings';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import AdminCourses from './components/AdminCourses';
import AdminSchools from './components/AdminSchools';
import AdminStudents from './components/AdminStudents';
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

        {/* User dashboard routes using the layout component */}
        <Route element={<UserLayout />}>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-courses" element={<UserCourses />} />
          <Route path="/user-settings" element={<UserSettings />} />
        </Route>

        {/* Admin dashboard routes using the layout component */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-profile" element={<UserProfile />} />
          <Route path="/admin-courses" element={<AdminCourses />} />
          <Route path="/admin-students" element={<AdminStudents />} />
          <Route path="/admin-schools" element={<AdminSchools />} />
          <Route path="/admin-settings" element={<UserSettings />} />
        </Route>
      </Routes>
      <Footer/>
      </Router>
    </div>
  );
}

export default App;
