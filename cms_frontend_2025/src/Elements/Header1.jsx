import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaUserCircle, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Header1.css";

const Header1 = ({
  onSidebarToggle,
  darkMode,
  setDarkMode,
  notifications = [],
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className={`dashboard-header${darkMode ? " dark" : ""}`}>
      <button className="header1-hamburger" onClick={onSidebarToggle} aria-label="Open menu">
        <FaBars />
      </button>
      <div className="dashboard-title">HealthIs</div>
      <div className="header-icons">
        <button className="theme-btn" onClick={handleThemeToggle} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="notification">
          <button className="notify-btn" title="Notifications">
            <FaBell />
            {notifications.length > 0 && (
              <span className="notify-badge">{notifications.length}</span>
            )}
          </button>
        </div>
        <div className="user-info" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setOpen((prev) => !prev)}>
            <FaUserCircle size={34} />
          </button>
          {open && (
            <div className="profile-dropdown">
              <div className="profile-details">
                <div className="profile-name">{user?.username || "User"}</div>
                <div className="profile-email">{user?.email}</div>
                <div className="profile-role">{user?.role}</div>
              </div>
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/change-password")}>Change Password</button>
              <button onClick={() => navigate("/leave-form")}>Leave Form</button>
              <button onClick={() => navigate("/leave-list")}>Leave List</button>
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header1;
