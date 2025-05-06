import { useState, useEffect } from 'react';
import '../styles/courseform.css';

export default function CourseAddForm({ onSubmit, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    status: 'upcoming',
    enrollmentCapacity: 30,
    startDate: '',
    endDate: '',
    imageUrl: '',
  });

  // If editing existing course, populate form with course data
  useEffect(() => {
    if (initialData) {
      // Format dates for form inputs
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };
      
      setFormData({
        title: initialData.title || '',
        code: initialData.code || '',
        description: initialData.description || '',
        status: initialData.status || 'upcoming',
        enrollmentCapacity: initialData.enrollmentCapacity || 30,
        startDate: formatDate(initialData.startDate),
        endDate: formatDate(initialData.endDate),
        imageUrl: initialData.imageUrl || initialData.img || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      enrollmentCapacity: parseInt(formData.enrollmentCapacity, 10) || 30
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="registration-section course-form-overlay">
      <h2>{initialData ? 'Edit Course' : 'Add New Course'}</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-row">
          <div className="form-group floating">
            <input
              type="text"
              id="title"
              name="title"
              placeholder=" "
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="form-group floating">
            <input
              type="text"
              id="code"
              name="code"
              placeholder=" "
              value={formData.code}
              onChange={handleChange}
              required
              disabled={!!initialData} // Disable code field when editing
            />
            <label htmlFor="code">Course Code</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <label htmlFor="status" className="select-label">Status</label>
          </div>
          <div className="form-group floating">
            <input
              type="number"
              id="enrollmentCapacity"
              name="enrollmentCapacity"
              placeholder=" "
              value={formData.enrollmentCapacity}
              onChange={handleChange}
              min="1"
              max="500"
            />
            <label htmlFor="enrollmentCapacity">Capacity</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <input
              type="date"
              id="startDate"
              name="startDate"
              placeholder=" "
              value={formData.startDate}
              onChange={handleChange}
            />
            <label htmlFor="startDate">Start Date</label>
          </div>
          <div className="form-group floating">
            <input
              type="date"
              id="endDate"
              name="endDate"
              placeholder=" "
              value={formData.endDate}
              onChange={handleChange}
            />
            <label htmlFor="endDate">End Date</label>
          </div>
        </div>

        <div className="form-group floating">
          <textarea
            id="description"
            name="description"
            placeholder=" "
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
          <label htmlFor="description" className="textarea-label">Description</label>
        </div>

        <div className="form-group floating">
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder=" "
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <label htmlFor="imageUrl">Image URL</label>
        </div>

        <div className="form-group submit-group">
          <button type="submit" className="enroll-btn">
            {initialData ? 'Update Course' : 'Add Course'}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}