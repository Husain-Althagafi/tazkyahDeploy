// In src/contexts/ToastContext.js - Enhanced version
import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import Toast from "../components/common/Toast";
import "../styles/toastContainer.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Use a ref to track if we're in the process of removing toasts
  const removingToast = useRef(false);
  // Use a ref to prevent duplicated toasts within a short timeframe
  const recentToasts = useRef(new Map());

  // Add a toast with duplicate prevention
  const addToast = useCallback((type, message, duration = 5000) => {
    const id = Date.now();
    const toastKey = `${type}-${message}`;
    
    // Check if this exact toast was shown recently (in the last 2 seconds)
    if (recentToasts.current.has(toastKey)) {
      const lastShown = recentToasts.current.get(toastKey);
      if (Date.now() - lastShown < 2000) {
        // Skip showing duplicate toast to prevent "toast flickering"
        return id;
      }
    }
    
    // Remember this toast to prevent fast duplicates
    recentToasts.current.set(toastKey, Date.now());
    
    // Clean up old entries from the Map (keep only recent ones)
    const now = Date.now();
    recentToasts.current.forEach((timestamp, key) => {
      if (now - timestamp > 10000) { // Remove entries older than 10 seconds
        recentToasts.current.delete(key);
      }
    });
    
    setToasts((prevToasts) => [...prevToasts, { id, type, message, duration }]);
    return id;
  }, []);

  // Remove a toast with smoother animation
  const removeToast = useCallback((id) => {
    // Prevent multiple removals at once causing visual glitches
    if (removingToast.current) return;
    
    removingToast.current = true;
    
    // Mark the toast as hiding first (for animation)
    setToasts((prevToasts) => 
      prevToasts.map(toast => 
        toast.id === id ? { ...toast, hiding: true } : toast
      )
    );
    
    // After animation completes, remove the toast
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      removingToast.current = false;
    }, 300); // Match the CSS transition duration
  }, []);

  // Helper functions for different toast types
  const success = useCallback((message, duration) => addToast("success", message, duration), [addToast]);
  const error = useCallback((message, duration) => addToast("error", message, duration), [addToast]);
  const warning = useCallback((message, duration) => addToast("warning", message, duration), [addToast]);
  const info = useCallback((message, duration) => addToast("info", message, duration), [addToast]);

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
            hiding={toast.hiding}
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