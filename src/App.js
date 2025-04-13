import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

/*
To test my code go http://localhost:3000/courses/1

The code needs to be modified depending on how the others worked and named their code functions and components.


*/

//component import
import LoginRegister from "./components/LoginRegister";
import CourseDetails from "./components/CourseDetails";
//import end

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/courses/:courseId" element={<CourseDetails/>} />
            <Route path="/login-register" element={<LoginRegister />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
