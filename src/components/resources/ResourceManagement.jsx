import React, { useState, useEffect } from "react";
import { useResources } from "../../contexts/ResourceContext";
import ResourceTable from "./ResourceTable";
import ResourceUpload from "./ResourceUpload";
import ResourceFilter from "./ResourceFilter";
import ResourceSearch from "./ResourceSearch";
import ResourceEdit from "./ResourceEdit";
import "../../styles/resourceManagement.css";

const ResourceManagement = ({ courseId }) => {
  const {
    resources,
    loading,
    error,
    fetchResources,
    filterResourcesByType,
    searchResources,
    clearError,
  } = useResources();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchResources(courseId);
    }
  }, [courseId]);

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    filterResourcesByType(courseId, type);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    searchResources(courseId, query);
  };

  // Open edit modal
  const handleEdit = (resource) => {
    setEditingResource(resource);
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditingResource(null);
  };

  return (
    <div className="resource-management-container">
      <div className="management-header">
        <h2>Manage Course Resources</h2>
        <button
          className="add-resource-btn"
          onClick={() => setShowUploadModal(true)}
        >
          Add New Resource
        </button>
      </div>

      <div className="management-controls">
        <ResourceFilter
          activeFilter={filterType}
          onFilterChange={handleFilterChange}
        />
        <ResourceSearch value={searchQuery} onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="management-loading">Loading resources...</div>
      )}

      {error && (
        <div className="management-error">
          <p>Error: {error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="management-empty">
          <p>No resources found for this course.</p>
          {searchQuery && (
            <button onClick={() => handleSearch("")}>Clear search</button>
          )}
          <button
            className="add-first-resource-btn"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Your First Resource
          </button>
        </div>
      )}

      {resources.length > 0 && (
        <ResourceTable resources={resources} onEdit={handleEdit} />
      )}

      {/* Resource Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ResourceUpload
              courseId={courseId}
              onClose={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

      {/* Resource Edit Modal */}
      {editingResource && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ResourceEdit
              resource={editingResource}
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
