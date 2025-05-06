// In src/components/common/Toast.jsx - Enhanced version
import React, { useEffect, useState, useRef } from "react";
import "../../styles/toast.css";

const Toast = ({ type, message, duration = 5000, hiding = false, onClose }) => {
  const [visible, setVisible] = useState(true);
  const timeoutIdRef = useRef(null);

  // Handle the case when the toast is manually marked as hiding
  useEffect(() => {
    if (hiding) {
      setVisible(false);
    }
  }, [hiding]);

  // Set up the automatic timeout
  useEffect(() => {
    // Only set a timeout if duration is positive and not already hiding
    if (duration > 0 && !hiding) {
      timeoutIdRef.current = setTimeout(() => {
        setVisible(false);
        // Wait for fade-out animation before actually closing
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, duration);

      // Clean up the timeout if component unmounts
      return () => {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      };
    }
  }, [duration, onClose, hiding]);

  // Handle manual close
  const handleClose = () => {
    // Clear the automatic timeout
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

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