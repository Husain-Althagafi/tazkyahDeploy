// src/components/resources/ResourceFilter.jsx
import React from "react";
import "../../styles/resourceFilter.css";

const ResourceFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "document", label: "Documents" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
    { value: "pdf", label: "PDFs" },
    { value: "office", label: "Office Files" },
  ];

  return (
    <div className="resource-filter">
      <span className="filter-label">Filter:</span>
      <div className="filter-options">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-btn ${
              activeFilter === filter.value ? "active" : ""
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResourceFilter;
