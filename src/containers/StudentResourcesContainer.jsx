import React from "react";
import { ResourceProvider } from "../contexts/ResourceContext";
import ResourceList from "../components/resources/ResourceList";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useNavigate, useParams } from "react-router-dom";

const StudentResourcesContainer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Handler for error boundary
  const handleError = () => {
    navigate("/courses");
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ResourceProvider courseId={courseId}>
        <div className="page-container">
          <ResourceList courseId={courseId} />
        </div>
      </ResourceProvider>
    </ErrorBoundary>
  );
};

export default StudentResourcesContainer;
