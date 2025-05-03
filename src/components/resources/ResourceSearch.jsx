// src/components/resources/ResourceSearch.jsx
import React, { useState } from "react";
import "../../styles/resourceSearch.css";

const ResourceSearch = ({ value, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(value || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form className="resource-search" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button type="submit" className="search-btn" aria-label="Search">
        🔍
      </button>
    </form>
  );
};

export default ResourceSearch;
