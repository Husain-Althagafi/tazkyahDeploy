// src/components/resources/ResourceUpload.jsx
import React, { useState, useRef } from 'react';
import { useResources } from '../../contexts/ResourceContext';
import '../../styles/resourceUpload.css';

const ResourceUpload = ({ courseId, onClose }) => {
  const { uploadResource, uploadProgress } = useResources();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("description", description);
      formData.append("courseId", courseId);

      // Upload resource
      await uploadResource(courseId, formData);

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setSuccess(true);

      // Close modal after a delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to upload resource");
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Get file size display
  const getFileSizeDisplay = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <div className="resource-upload-container">
      <div className="upload-header">
        <h2>Upload Resource</h2>
        {onClose && (
          <button className="upload-close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource title (will use filename if empty)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a description for this resource"
            rows="3"
          />
        </div>

        <div
          className={`upload-area ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />

          {file ? (
            <div className="file-info">
              <div className="file-preview">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="File preview"
                    className="file-thumbnail"
                  />
                ) : (
                  <div className="file-icon">📄</div>
                )}
              </div>
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{getFileSizeDisplay(file.size)}</p>
                <p className="file-type">{file.type}</p>
              </div>
              <button
                type="button"
                className="file-remove-btn"
                onClick={() => setFile(null)}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📤</div>
              <p>Drag & drop your file here or</p>
              <button
                type="button"
                className="file-select-btn"
                onClick={onButtonClick}
              >
                Browse Files
              </button>
              <p className="upload-help">Maximum file size: 10MB</p>
            </div>
          )}
        </div>

        {error && <div className="upload-error">{error}</div>}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{uploadProgress}% Uploaded</span>
          </div>
        )}

        {success && (
          <div className="upload-success">
            <div className="success-icon">✅</div>
            <p>Resource uploaded successfully!</p>
          </div>
        )}

        <div className="form-actions">
          {onClose && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="submit-btn"
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Upload Resource"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceUpload;