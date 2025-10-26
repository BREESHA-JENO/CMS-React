import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaUserCircle, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAllRead } from "../Service/admin_api";
import "./Header1.css";

const Header1 = ({ onSidebarToggle, darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log('Latest notifications:', response.data);
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else if (response.data.results) {
        setNotifications(response.data.results);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown and notif on outside click
  useEffect(() => {
    function handleClick(e) {
      // Close profile dropdown if clicked outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
      // Close notifications dropdown if clicked outside (also if not bell)
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target) &&
        // not clicked on bell icon either
        !(e.target.closest(".notify-btn"))
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    if (!notifOpen) {
      fetchNotifications();
    }
    setNotifOpen((prev) => !prev);
  };

  // Mark all notifications as read - update UI after API succeeds
  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  // Toggle dark mode
  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate unread count safely
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

  return (
    <header className={`dashboard-header${darkMode ? " dark" : ""}`}>
      <button
        className="header1-hamburger"
        onClick={onSidebarToggle}
        aria-label="Open menu"
      >
        <FaBars />
      </button>
      <div className="dashboard-title">HealthIs</div>
      <div className="header-icons">
        <button
          className="theme-btn"
          onClick={handleThemeToggle}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {/* Notifications */}
        <div className="notification" ref={notifDropdownRef}>
          <button
            className="notify-btn"
            title="Notifications"
            onClick={toggleNotifications}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notify-badge">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className={`notification-dropdown${darkMode ? " dark" : ""}`}>
              <button onClick={handleMarkAllRead} className="mark-read-btn">
                Mark all as read
              </button>
              {notifications.length === 0 ? (
                <p className="no-notifications">No notifications</p>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    className={`notification-item ${
                      note.is_read ? "read" : "unread"
                    }`}
                  >
                    <p className="notification-title">{note.title}</p>
                    <p className="notification-message">{note.message}</p>
                    <p className="notification-time">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* Profile/user */}
        <div className="user-info" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setOpen((prev) => !prev)}
            style={{ padding: 0, border: "none", background: "transparent" }}
          >
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={`${user.username}'s profile`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FaUserCircle size={34} />
            )}
          </button>
          {open && (
            <div className="profile-dropdown">
              <div className="profile-details">
                <div className="profile-name">{user?.username || "User"}</div>
                <div className="profile-email">{user?.email}</div>
                <div className="profile-role">{user?.role}</div>
              </div>
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/change-password")}>
                Change Password
              </button>
              <button onClick={() => navigate("/leave-form")}>Leave Form</button>
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
