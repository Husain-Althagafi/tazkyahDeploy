import React from "react";
import { ResourceProvider } from "../contexts/ResourceContext";
import ResourceManagement from "../components/resources/ResourceManagement";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useNavigate, useParams } from "react-router-dom";

const InstructorResourcesContainer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Handler for error boundary
  const handleError = () => {
    navigate("/instructor/courses");
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ResourceProvider courseId={courseId}>
        <div className="page-container">
          <ResourceManagement courseId={courseId} />
        </div>
      </ResourceProvider>
    </ErrorBoundary>
  );
};

export default InstructorResourcesContainer;
