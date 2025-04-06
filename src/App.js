import React from 'react';
// CSS Import
import './App.css';

// React Files Imports
import LoginRegister from './components/LoginRegister';
import { FilterBar, NewCourses, MainHeader} from "./components/CoursesR";



function App() {
  return (
    <div className="App">
{ 
      <div className='page-container'>
        <MainHeader/>
        <h1>New Courses!</h1>
        <NewCourses/>
        <FilterBar/>
      </div> }
      
      {/* <header className="App-header">
        <LoginRegister />
      </header> */}
    </div>
  );
}

export default App;