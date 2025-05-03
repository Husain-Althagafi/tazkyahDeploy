import { useState, useEffect } from 'react';
import '../styles/courseform.css'; // make sure to create or reuse your form styles

export default function AddCourseForm({ onSubmit, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    instructor: '',
    completion: '',
    image: '',
    category: '',
    lastAccessed: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
              disabled={!!initialData} 
            />
            <label htmlFor="code">Course Code</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <input
              type="text"
              id="instructor"
              name="instructor"
              placeholder=" "
              value={formData.instructor}
              onChange={handleChange}
            />
            <label htmlFor="instructor">Instructor (optional)</label>
          </div>
          <div className="form-group floating">
            <input
              type="number"
              id="completion"
              name="completion"
              placeholder=" "
              value={formData.completion}
              onChange={handleChange}
              min="0"
              max="100"
            />
            <label htmlFor="completion">Completion % (optional)</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group floating">
            <input
              type="text"
              id="image"
              name="image"
              placeholder=" "
              value={formData.image}
              onChange={handleChange}
            />
            <label htmlFor="image">Image URL (optional)</label>
          </div>
          <div className="form-group floating">
            <input
              type="text"
              id="category"
              name="category"
              placeholder=" "
              value={formData.category}
              onChange={handleChange}
            />
            <label htmlFor="category">Category (optional)</label>
          </div>
        </div>

        <div className="form-group floating">
          <input
            type="date"
            id="lastAccessed"
            name="lastAccessed"
            placeholder=" "
            value={formData.lastAccessed}
            onChange={handleChange}
          />
          <label htmlFor="lastAccessed">Last Accessed (optional)</label>
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
