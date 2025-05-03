// src/components/resources/ResourcePreview.jsx
import React, { useState } from "react";
import { useResources } from "../../contexts/ResourceContext";
import "../../styles/resourcePreview.css";

const ResourcePreview = ({ resource, onClose }) => {
  const { downloadResource } = useResources();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Safety check after hooks are declared
  if (!resource) {
    return null;
  }

  // Handle download
  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      // Extract filename from the fileUrl
      const filename = resource.fileUrl.split("/").pop().substring(14); // Remove timestamp
      await downloadResource(resource._id, filename);
    } catch (err) {
      setError("Failed to download resource");
    } finally {
      setDownloading(false);
    }
  };

  // Get preview component based on resource type
  const renderPreview = () => {
    const fileType = resource.fileType;

    // For images
    if (fileType === "image") {
      return (
        <div className="preview-image-container">
          <img
            src={`/api/resources/${resource._id}/view`}
            alt={resource.title}
            className="preview-image"
          />
        </div>
      );
    }

    // For PDFs
    if (fileType === "pdf") {
      return (
        <div className="preview-pdf-container">
          <iframe
            src={`/api/resources/${resource._id}/view`}
            title={resource.title}
            className="preview-pdf"
          />
        </div>
      );
    }

    // For videos
    if (fileType === "video") {
      return (
        <div className="preview-video-container">
          <video controls className="preview-video">
            <source src={`/api/resources/${resource._id}/view`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // For audio
    if (fileType === "audio") {
      return (
        <div className="preview-audio-container">
          <audio controls className="preview-audio">
            <source src={`/api/resources/${resource._id}/view`} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // For other file types (no preview available)
    return (
      <div className="preview-unavailable">
        <div className="preview-icon">📄</div>
        <p>No preview available for this file type.</p>
        <p>Please download the file to view it.</p>
      </div>
    );
  };

  return (
    <div className="resource-preview-overlay">
      <div className="resource-preview-container">
        <div className="preview-header">
          <h2>{resource.title}</h2>
          <button className="preview-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="preview-content">{renderPreview()}</div>

        <div className="preview-footer">
          <div className="preview-info">
            <p className="preview-description">{resource.description}</p>
            <p className="preview-meta">
              Uploaded on {new Date(resource.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="preview-actions">
            <button
              className="preview-download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download"}
            </button>
          </div>
        </div>

        {error && <div className="preview-error">{error}</div>}
      </div>
    </div>
  );
};

export default ResourcePreview;
