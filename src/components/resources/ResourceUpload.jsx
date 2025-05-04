import React, { useState, useRef, useEffect } from 'react';
import { useResources } from '../../contexts/ResourceContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/resourceUpload.css';

const ResourceUpload = ({ courseId, onClose }) => {
  const { uploadResource, uploadProgress, clearError } = useResources();
  const { success, error: toastError } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const fileInputRef = useRef(null);

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
    
    // Validate courseId
    if (!courseId) {
      setError("Course ID is missing. Cannot upload resources.");
    }
    
    // Cleanup function
    return () => {
      // Clear any file object URLs on unmount
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [clearError, courseId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!courseId) {
      setError("Course ID is missing. Cannot upload resources.");
      return;
    }
    
    // File size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit");
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
      const result = await uploadResource(courseId, formData);
      
      if (result && result.success) {
        setSuccessState(true);
        success("Resource uploaded successfully!");
        
        // Reset form
        setTitle("");
        setDescription("");
        setFile(null);
        
        // Close modal after a delay
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error(result?.error || "Failed to upload resource");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to upload resource";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Create a preview URL if it's an image
      if (selectedFile.type.startsWith('image/')) {
        selectedFile.preview = URL.createObjectURL(selectedFile);
      }
      
      setFile(selectedFile);
      
      // Auto-fill title with file name (without extension)
      if (!title) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setTitle(fileName);
      }
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
      const droppedFile = e.dataTransfer.files[0];
      
      // Create a preview URL if it's an image
      if (droppedFile.type.startsWith('image/')) {
        droppedFile.preview = URL.createObjectURL(droppedFile);
      }
      
      setFile(droppedFile);
      
      // Auto-fill title with file name (without extension)
      if (!title) {
        const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
        setTitle(fileName);
      }
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

  // Determine if file type is allowed
  const isAllowedFileType = (file) => {
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
      // Documents
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      // Video
      'video/mp4', 'video/quicktime',
      // Audio
      'audio/mpeg', 'audio/wav',
      // Archives
      'application/zip', 'application/x-rar-compressed'
    ];
    
    return allowedTypes.includes(file.type);
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
          className={`upload-area ${dragActive ? "drag-active" : ""} ${error ? "upload-area-error" : ""}`}
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
                {file.type.startsWith("image/") && file.preview ? (
                  <img
                    src={file.preview}
                    alt="File preview"
                    className="file-thumbnail"
                  />
                ) : (
                  <div className="file-icon">
                    {file.type.includes('pdf') ? '📕' :
                     file.type.includes('image') ? '🖼️' :
                     file.type.includes('video') ? '🎥' :
                     file.type.includes('audio') ? '🎧' :
                     file.type.includes('word') || file.type.includes('office') ? '📄' :
                     file.type.includes('zip') || file.type.includes('rar') ? '📦' : 
                     '📄'}
                  </div>
                )}
              </div>
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{getFileSizeDisplay(file.size)}</p>
                <p className="file-type">{file.type || 'Unknown type'}</p>
                {!isAllowedFileType(file) && (
                  <p className="file-warning">Warning: This file type may not be supported</p>
                )}
              </div>
              <button
                type="button"
                className="file-remove-btn"
                onClick={() => {
                  if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                  }
                  setFile(null);
                }}
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
              <p className="upload-formats">
                Supported formats: Images, PDFs, Office files, Videos, Audio
              </p>
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

        {successState && (
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