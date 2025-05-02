import { useState } from 'react';
import '../styles/usercourses.css';

// CourseCard component for displaying individual courses
function CourseCard({ course }) {
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
          <button className="continue-btn">Continue</button>
          <button className="details-btn">Details</button>
        </div>
      </div>
    </div>
  );
}

export default function UserCourses() {
  // Sample course data
  const [courses] = useState([
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "Sarah Johnson",
      completion: 75,
      image: "/api/placeholder/400/300",
      category: "Web Development",
      lastAccessed: "April 28, 2025"
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      instructor: "Michael Chen",
      completion: 45,
      image: "/api/placeholder/400/300",
      category: "JavaScript",
      lastAccessed: "April 30, 2025"
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Williams",
      completion: 90,
      image: "/api/placeholder/400/300",
      category: "Design",
      lastAccessed: "April 29, 2025"
    },
    {
      id: 4,
      title: "Data Structures and Algorithms",
      instructor: "Robert Brown",
      completion: 30,
      image: "/api/placeholder/400/300",
      category: "Computer Science",
      lastAccessed: "April 25, 2025"
    },
    {
      id: 5,
      title: "Mobile App Development with React Native",
      instructor: "Jessica Lee",
      completion: 60,
      image: "/api/placeholder/400/300",
      category: "Mobile Development",
      lastAccessed: "April 27, 2025"
    },
    {
      id: 6,
      title: "Database Design and Management",
      instructor: "David Miller",
      completion: 15,
      image: "/api/placeholder/400/300",
      category: "Databases",
      lastAccessed: "April 20, 2025"
    }
  ]);

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

  return (
    <div className="courses-container">
      <h1 className="courses-title">My Courses</h1>
      
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
            <CourseCard key={course.id} course={course} />
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
      </div>
    </div>
  );
}