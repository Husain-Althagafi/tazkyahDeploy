import React, { createContext, useContext, useState } from "react";
import Toast from "../components/common/Toast";
import "../styles/toastContainer.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast
  const addToast = (type, message, duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message, duration }]);
    return id;
  };

  // Remove a toast
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Helper functions for different toast types
  const success = (message, duration) => addToast("success", message, duration);
  const error = (message, duration) => addToast("error", message, duration);
  const warning = (message, duration) => addToast("warning", message, duration);
  const info = (message, duration) => addToast("info", message, duration);

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div className="toast-wrapper">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};