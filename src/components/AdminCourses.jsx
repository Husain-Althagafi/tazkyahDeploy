import {useEffect, useState } from 'react';
import '../styles/admincourses.css';
import axios from 'axios'
import CourseAddForm from './CourseAddForm'



// CourseCard component for displaying individual courses
function CourseCard({ course, onDelete, onEdit }) {
  
  const { title, instructor, completion, image, category, lastAccessed } = course;
  
  return (
    <div className="course-card">
      <div className="course-image-container">
        <img 
          src={image} 
          alt={title} 
          className="course-image"
        />
        <div className="course-category">{category}</div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{title}</h3>
        <p className="course-instructor">Instructor: {instructor}</p>
        <div className="course-progress-container">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-percentage">{completion}%</span>
          </div>
          <div className="progress-bar-background">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
        <p className="course-last-accessed">Last accessed: {lastAccessed}</p>
        <div className="course-actions">
          <button className="delete-btn" onClick={onDelete}>Delete</button>
          <button className="edit-btn" onClick={onEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  // Courses data
  const [courses, setCourses] = useState([]);

  // States for forms
  const [showAddForm, setShowAddForm] = useState(false)
 

  // Get all courses via api
  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/')
      .then(res => {
        setCourses(res.data.data)
  })
      .catch(err => console.error(err));
  }, []); 


   // Filter states
   const [searchTerm, setSearchTerm] = useState('');
   const [filterCategory, setFilterCategory] = useState('All');
   
   const categories = ['All', 'Web Development', 'JavaScript', 'Design', 'Computer Science', 'Mobile Development', 'Databases'];

  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Function for deleting a course
  const handleDelete = (code) => {

    const deleteConfirm = window.confirm('Are you sure you want to delete this course?')
    if (!deleteConfirm) {
      return 
    }

    axios.delete(`http://localhost:5000/api/courses/${code}`) 
    .then(() => {
      setCourses(prev => prev.filter(course => course.code !== code))
    })
    .catch(err => {
      console.error(err)
    })
  }

  // Function for editing a course
  const handleEdit = (code) => {
    alert('editing course')
  }


  //Function for adding a course
  const handleAdd = (courseData) => {
    axios.post('http://localhost:5000/api/courses/', courseData)
    .then(res => {
      setCourses(prev => [...prev, res.data.data])
      setShowAddForm(false)
    })
    .catch(err => {
      console.error(err)
    })
    alert('Course added');

  };
  
  if (showAddForm) {
    return <CourseAddForm onSubmit={handleAdd} onClose={() => setShowAddForm(false)}/>
  }

  


  return (
    <div className="courses-container">
      {/* {showAddForm && (
        <CourseAddForm onSubmit={handleAddCourse} onClose={() => setShowAddForm(false)}/>
      )} */}
      <h1 className="courses-title">Manage Courses</h1>
      
      {/* Filters and Search */}
      <div className="courses-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="search-icon" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="category-filter">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      
      
      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.code} 
              course={course} 
              onDelete={() => handleDelete(course.code)}
              onEdit={() => handleEdit(course.code)}
            />
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <p className="no-courses-message">No courses found matching your filters.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterCategory('All');}}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}
      
      {/* Explore More Courses CTA */}
      <div className="explore-section">
        <h2 className="explore-title">Looking for more learning opportunities?</h2>
        <p className="explore-description">Explore our course catalog to find your next skill to master.</p>
        <button className="explore-btn">
          Explore Course Catalog
        </button>
        <button className="add-course-btn" onClick={() => setShowAddForm(true)}>
          + Add Course
        </button>
      </div>
    </div>
  );
}