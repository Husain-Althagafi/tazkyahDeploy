// src/App.js (modified version)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./styles/global.css";
import "./styles/user-dashboard.css";
import "./styles/user-components.css";

// Import components
import LoginRegister from "./components/LoginRegister";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CoursesPage from "./components/CoursesPage";
import EnrollConfirmation from "./components/EnrollConfirmation";
import Main from "./components/Main";
import CourseDetails from "./components/CourseDetails";
import Hero from "./components/Hero";
import About from "./components/About";
import UserProfile from "./components/UserProfile";
import UserCourses from "./components/UserCourses";
import UserSettings from "./components/UserSettings";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";
import AdminCourses from "./components/AdminCourses";
import AdminSchools from "./components/AdminSchools";
import AdminStudents from "./components/AdminStudents";
import StudentResourcesContainer from "./containers/StudentResourcesContainer";
import InstructorResourcesContainer from "./containers/InstructorResourcesContainer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UnauthorizedPage from "./components/auth/UnauthorizedPage";
import InstructorCourses from "./components/instructor/InstructorCourses";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route
            path="/courses/course-details/:code"
            element={<CourseDetails />}
          />
          <Route path="/core-values" element={<About />} />
          <Route path="/join-us" element={<Hero />} />
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/user-courses" element={<UserCourses />} />
              <Route path="/user-settings" element={<UserSettings />} />
              <Route
                path="/courses/:courseId/resources"
                element={<StudentResourcesContainer />}
              />
              <Route
                path="/courses/course-details/enrolled"
                element={<EnrollConfirmation />}
              />
            </Route>
          </Route>

          {/* Instructor routes */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/instructor-profile" element={<UserProfile />} />
              <Route
                path="/instructor-courses"
                element={<InstructorCourses />}
              />
              <Route
                path="/instructor/courses/:courseId/resources"
                element={<InstructorResourcesContainer />}
              />
              <Route path="/instructor-settings" element={<UserSettings />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin-profile" element={<UserProfile />} />
              <Route path="/admin-courses" element={<AdminCourses />} />
              <Route path="/admin-students" element={<AdminStudents />} />
              <Route path="/admin-schools" element={<AdminSchools />} />
              <Route path="/admin-settings" element={<UserSettings />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
      </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
