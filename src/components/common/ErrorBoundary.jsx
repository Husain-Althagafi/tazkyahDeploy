import React, { Component } from "react";
import "../../styles/errorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading this component.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
          {this.props.onError && (
            <button onClick={this.props.onError}>Go Back</button>
          )}
          {this.state.error && (
            <details>
              <summary>Error Details</summary>
              <p>{this.state.error.toString()}</p>
              <p>Component Stack:</p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
