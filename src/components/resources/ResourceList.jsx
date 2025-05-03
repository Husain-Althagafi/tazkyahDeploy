import React, { useState, useEffect } from "react";
import { useResources } from "../../contexts/ResourceContext";
import ResourceCard from "./ResourceCard";
import ResourceFilter from "./ResourceFilter";
import ResourceSearch from "./ResourceSearch";
import ResourcePreview from "./ResourcePreview";
import "../../styles/resourceList.css";


const ResourceList = ({ courseId }) => {
  const {
    resources,
    loading,
    error,
    fetchResources,
    filterResourcesByType,
    searchResources,
    clearError,
  } = useResources();

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

  // Resource type icons map
  const typeIcons = {
    document: "📄",
    image: "🖼️",
    video: "🎥",
    audio: "🎧",
    pdf: "📕",
    office: "📊",
    other: "📦",
  };

  // Group resources by type for better organization
  const groupedResources = resources.reduce((acc, resource) => {
    const type = resource.fileType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(resource);
    return acc;
  }, {});

  return (
    <div className="resource-list-container">
      <div className="resource-controls">
        <h2>Course Resources</h2>
        <div className="resource-actions">
          <ResourceFilter
            activeFilter={filterType}
            onFilterChange={handleFilterChange}
          />
          <ResourceSearch value={searchQuery} onSearch={handleSearch} />
        </div>
      </div>

      {loading && <div className="resource-loading">Loading resources...</div>}

      {error && (
        <div className="resource-error">
          <p>Error: {error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="resource-empty">
          <p>No resources found for this course.</p>
          {searchQuery && (
            <button onClick={() => handleSearch("")}>Clear search</button>
          )}
        </div>
      )}

      {filterType === "all" ? (
        // Display resources grouped by type
        Object.entries(groupedResources).map(([type, typeResources]) => (
          <div key={type} className="resource-group">
            <h3 className="resource-group-title">
              <span className="resource-group-icon">
                {typeIcons[type] || typeIcons.other}
              </span>
              {type.charAt(0).toUpperCase() + type.slice(1)}s
              <span className="resource-count">{typeResources.length}</span>
            </h3>
            <div className="resource-cards">
              {typeResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          </div>
        ))
      ) : (
        // Display filtered resources
        <div className="resource-cards">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;
