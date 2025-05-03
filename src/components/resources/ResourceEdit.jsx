import React, { useState } from "react";
import { useResources } from "../../contexts/ResourceContext";
import "../../styles/resourceEdit.css";

const ResourceEdit = ({ resource, onClose }) => {
  const { updateResource } = useResources();
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Update resource
      await updateResource(resource._id, {
        title,
        description,
      });

      setSuccess(true);

      // Close modal after a delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate icon for resource type
  const getResourceIcon = () => {
    switch (resource.fileType) {
      case "pdf":
        return "📕";
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎧";
      case "office":
        return "📊";
      case "document":
        return "📄";
      default:
        return "📦";
    }
  };

  // Get file extension from URL
  const getFileExtension = () => {
    const filename = resource.fileUrl.split("/").pop();
    const extension = filename.split(".").pop();
    return extension.toUpperCase();
  };

  return (
    <div className="resource-edit-container">
      <div className="edit-header">
        <h2>Edit Resource</h2>
        {onClose && (
          <button className="edit-close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="resource-info">
        <div className="resource-icon">
          {getResourceIcon()}
          <span className="resource-extension">{getFileExtension()}</span>
        </div>
        <div className="resource-details">
          <p className="file-path">{resource.fileUrl}</p>
          <p className="file-uploaded">
            Uploaded: {new Date(resource.uploadedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>

        {error && <div className="edit-error">{error}</div>}

        {success && (
          <div className="edit-success">
            <div className="success-icon">✅</div>
            <p>Resource updated successfully!</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceEdit;
