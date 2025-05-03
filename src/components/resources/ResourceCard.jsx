// src/components/resources/ResourceCard.jsx
import React, { useState } from 'react';
import { useResources } from '../../contexts/ResourceContext';
import '../../styles/resourceCard.css';

const ResourceCard = ({ resource, onClick }) => {
  const { downloadResource } = useResources();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Handle download
  const handleDownload = async (e) => {
    // Prevent the card click event from triggering
    e.stopPropagation();
    
    setDownloading(true);
    setError(null);
    try {
      // Extract filename from the fileUrl
      const filename = resource.fileUrl.split('/').pop().substring(14); // Remove timestamp
      await downloadResource(resource._id, filename);
    } catch (err) {
      setError('Failed to download resource');
    } finally {
      setDownloading(false);
    }
  };

  // Get appropriate icon for resource type
  const getResourceIcon = () => {
    switch (resource.fileType) {
      case 'pdf':
        return '📕';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎧';
      case 'office':
        return '📊';
      case 'document':
        return '📄';
      default:
        return '📦';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get file extension from URL
  const getFileExtension = () => {
    const filename = resource.fileUrl.split('/').pop();
    const extension = filename.split('.').pop();
    return extension.toUpperCase();
  };

  return (
    <div 
      className="resource-card"
      onClick={() => onClick && onClick(resource)}
    >
      <div className="resource-icon">
        {getResourceIcon()}
        <span className="resource-extension">{getFileExtension()}</span>
      </div>
      <div className="resource-content">
        <h3 className="resource-title">{resource.title}</h3>
        <p className="resource-description">{resource.description || 'No description provided'}</p>
        <div className="resource-meta">
          <span className="resource-date">Uploaded on {formatDate(resource.uploadedAt)}</span>
        </div>
      </div>
      <div className="resource-actions">
        <button 
          className="resource-download-btn" 
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
      {error && <div className="resource-error">{error}</div>}
    </div>
  );
};

export default ResourceCard;