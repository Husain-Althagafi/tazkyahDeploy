import { useRef, useState } from 'react';
import '../styles/sidebar.css';

export default function SideBar() {
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const closeAllSubMenus = () => {
    const sidebar = sidebarRef.current;
    const openMenus = sidebar.querySelectorAll('.tzk-sidebar-submenu-show');
    openMenus.forEach(ul => {
      ul.classList.remove('tzk-sidebar-submenu-show');
      ul.previousElementSibling.classList.remove('tzk-sidebar-rotate');
    });
  };

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle('tzk-sidebar-close');
    toggleBtnRef.current.classList.toggle('tzk-sidebar-rotate');
    closeAllSubMenus();
  };

  const toggleSubMenu = (e) => {
    const button = e.currentTarget;
    const submenu = button.nextElementSibling;

    if (!submenu.classList.contains('tzk-sidebar-submenu-show')) {
      closeAllSubMenus();
    }

    submenu.classList.toggle('tzk-sidebar-submenu-show');
    button.classList.toggle('tzk-sidebar-rotate');

    if (sidebarRef.current.classList.contains('tzk-sidebar-close')) {
      sidebarRef.current.classList.remove('tzk-sidebar-close');
      toggleBtnRef.current.classList.toggle('tzk-sidebar-rotate');
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    // Implement actual logout functionality here
    window.location.href = '/login'; // Redirect to login page
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      <aside id="tzk-sidebar" ref={sidebarRef}>
        <ul className="tzk-sidebar-list">
          <li className="tzk-sidebar-item">
            <span className="tzk-sidebar-logo">TAZKYAH</span>
            <button onClick={toggleSidebar} id="tzk-sidebar-toggle-btn" ref={toggleBtnRef}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
          </li>
          
          {/* Profile Tab */}
          <li className="tzk-sidebar-item">
            <a href="/user-profile" className="tzk-sidebar-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <span>Profile</span>
            </a>
          </li>
          
          {/* Courses Tab */}
          <li className="tzk-sidebar-item">
            <a href="/user-courses" className="tzk-sidebar-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
              <span>Courses</span>
            </a>
          </li>
          
          {/* Settings Tab */}
          <li className="tzk-sidebar-item">
            <a href="/user-settings" className="tzk-sidebar-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span>Settings</span>
            </a>
          </li>
          
          {/* Log Out Tab */}
          <li className="tzk-sidebar-item">
            <a href="#" className="tzk-sidebar-link" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>Log Out</span>
            </a>
          </li>
        </ul>
      </aside>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="tzk-logout-overlay">
          <div className="tzk-logout-popup">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out of your account?</p>
            <div className="tzk-logout-actions">
              <button onClick={cancelLogout} className="tzk-logout-cancel">Cancel</button>
              <button onClick={confirmLogout} className="tzk-logout-confirm">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}