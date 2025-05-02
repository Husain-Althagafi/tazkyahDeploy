import { useState } from 'react';
import '../styles/adminschools.css';

// SchoolCard component for displaying individual schools
function SchoolCard({ school }) {
  const { name, principal, rating, image, type, lastUpdated } = school;
  
  const handleDelete = () => {
    alert('School deleted');
  };
  
  const handleEdit = () => {
    alert('School is being edited');
  };
  
  return (
    <div className="school-card">
      <div className="school-image-container">
        <img 
          src={image} 
          alt={name} 
          className="school-image"
        />
        <div className="school-type">{type}</div>
      </div>
      <div className="school-content">
        <h3 className="school-title">{name}</h3>
        <p className="school-principal">Principal: {principal}</p>
        <div className="school-rating-container">
          <div className="rating-header">
            <span className="rating-label">Rating</span>
            <span className="rating-value">{rating}/5</span>
          </div>
          <div className="rating-bar-background">
            <div 
              className="rating-bar-fill" 
              style={{ width: `${(rating / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="school-last-updated">Last updated: {lastUpdated}</p>
        <div className="school-actions">
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSchools() {
  // Sample school data
  const [schools] = useState([
    {
      id: 1,
      name: "Westside Elementary School",
      principal: "Dr. James Wilson",
      rating: 4.5,
      image: "/api/placeholder/400/300",
      type: "Elementary",
      lastUpdated: "April 29, 2025"
    },
    {
      id: 2,
      name: "Riverdale High School",
      principal: "Amanda Rodriguez",
      rating: 4.2,
      image: "/api/placeholder/400/300",
      type: "High School",
      lastUpdated: "April 30, 2025"
    },
    {
      id: 3,
      name: "Oak Park Middle School",
      principal: "Thomas Johnson",
      rating: 3.8,
      image: "/api/placeholder/400/300",
      type: "Middle School",
      lastUpdated: "April 27, 2025"
    },
    {
      id: 4,
      name: "Sunshine Montessori",
      principal: "Elizabeth Chen",
      rating: 4.7,
      image: "/api/placeholder/400/300",
      type: "Montessori",
      lastUpdated: "April 28, 2025"
    },
    {
      id: 5,
      name: "Lakeside Academy",
      principal: "Michael Brooks",
      rating: 4.0,
      image: "/api/placeholder/400/300",
      type: "Private",
      lastUpdated: "April 25, 2025"
    },
    {
      id: 6,
      name: "Tech Prep Charter School",
      principal: "Sarah Anderson",
      rating: 4.3,
      image: "/api/placeholder/400/300",
      type: "Charter",
      lastUpdated: "April 26, 2025"
    }
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const types = ['All', 'Elementary', 'Middle School', 'High School', 'Charter', 'Private', 'Montessori'];

  // Filter schools based on search term and type
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          school.principal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || school.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleAddSchool = () => {
    alert('School added');
  };

  return (
    <div className="schools-container">
      <h1 className="schools-title">Manage Schools</h1>
      
      {/* Filters and Search */}
      <div className="schools-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search schools..."
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
        
        <div className="type-filter">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="type-select"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* School Grid */}
      {filteredSchools.length > 0 ? (
        <div className="schools-grid">
          {filteredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="no-schools">
          <p className="no-schools-message">No schools found matching your filters.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterType('All');}}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}
      
      {/* Register School CTA */}
      <div className="register-section">
        <h2 className="register-title">Looking to register a new school?</h2>
        <p className="register-description">Add your educational institution to our network and reach more students.</p>
        <button className="register-btn">
          Register School
        </button>
        <button className="add-school-btn" onClick={handleAddSchool}>
          + Add School
        </button>
      </div>
    </div>
  );
}