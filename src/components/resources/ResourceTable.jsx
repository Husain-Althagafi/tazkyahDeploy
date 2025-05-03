// src/components/resources/ResourceTable.jsx
import React, { useState } from "react";
import { useResources } from "../../contexts/ResourceContext";
import "../../styles/resourceTable.css";

const ResourceTable = ({ resources, onEdit }) => {
  const { deleteResource, downloadResource } = useResources();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  // Handle delete confirmation
  const handleConfirmDelete = async (resourceId) => {
    setActionLoading(resourceId);
    setError(null);
    try {
      await deleteResource(resourceId);
      setConfirmDelete(null);
    } catch (err) {
      setError(`Failed to delete resource: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Handle download
  const handleDownload = async (resource) => {
    setActionLoading(resource._id);
    setError(null);
    try {
      const filename = resource.fileUrl.split("/").pop().substring(14);
      await downloadResource(resource._id, filename);
    } catch (err) {
      setError(`Failed to download resource: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get file size display from fileUrl (this is a mock - in a real app you'd store file size)
  const getFileSizeDisplay = (index) => {
    // Mock file sizes for demonstration
    const sizes = ["2.5 MB", "563 KB", "1.2 MB", "4.7 MB", "825 KB"];
    return sizes[index % sizes.length];
  };

  // Get appropriate icon for resource type
  const getResourceTypeIcon = (type) => {
    switch (type) {
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

  return (
    <div className="resource-table-container">
      {error && (
        <div className="table-error">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <table className="resource-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date Uploaded</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <tr key={resource._id}>
              <td className="resource-type-cell">
                <span className="resource-type-icon">
                  {getResourceTypeIcon(resource.fileType)}
                </span>
                <span className="resource-type-text">
                  {resource.fileType.charAt(0).toUpperCase() +
                    resource.fileType.slice(1)}
                </span>
              </td>
              <td>{resource.title}</td>
              <td className="resource-description-cell">
                <div className="description-truncate">
                  {resource.description || "No description"}
                </div>
              </td>
              <td>{formatDate(resource.uploadedAt)}</td>
              <td>{getFileSizeDisplay(index)}</td>
              <td className="action-cell">
                {confirmDelete === resource._id ? (
                  <div className="confirm-actions">
                    <span>Delete?</span>
                    <button
                      className="confirm-yes"
                      onClick={() => handleConfirmDelete(resource._id)}
                      disabled={actionLoading === resource._id}
                    >
                      Yes
                    </button>
                    <button
                      className="confirm-no"
                      onClick={handleCancelDelete}
                      disabled={actionLoading === resource._id}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="resource-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(resource)}
                      title="Edit resource"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn download-btn"
                      onClick={() => handleDownload(resource)}
                      disabled={actionLoading === resource._id}
                      title="Download resource"
                    >
                      ⬇️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setConfirmDelete(resource._id)}
                      disabled={actionLoading === resource._id}
                      title="Delete resource"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
