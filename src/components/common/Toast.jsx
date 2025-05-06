// In src/components/common/Toast.jsx
import React, { useEffect, useState } from "react";
import "../../styles/toast.css";

const Toast = ({ type, message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  // Set up the automatic timeout
  useEffect(() => {
    // Only set a timeout if duration is positive
    if (duration > 0) {
      const id = setTimeout(() => {
        setVisible(false);
        // Wait for fade-out animation before actually closing
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, duration);

      setTimeoutId(id);

      // Clean up the timeout if component unmounts
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    // Clear the automatic timeout
    if (timeoutId) clearTimeout(timeoutId);

    setVisible(false);
    // Wait for fade-out animation before actually closing
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`toast-container ${type} ${visible ? "visible" : "hiding"}`}
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        ✕
      </button>
    </div>
  );
};

export default Toast;
