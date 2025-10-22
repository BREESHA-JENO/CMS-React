import React, { useState } from "react";
import {
  FaUserPlus, FaUsers, FaEdit, FaKey, FaClipboardList, FaCog
} from "react-icons/fa";
import "./AdminDashboard.css";

const dashboardCards = [
  { key: "addStaff", label: "Add Staff", icon: <FaUserPlus /> },
  { key: "staffList", label: "Staff List", icon: <FaUsers /> },
  { key: "updateStaff", label: "Update Staff", icon: <FaEdit /> },
  { key: "generatePassword", label: "Generate Password", icon: <FaKey /> },
  { key: "leaveRequests", label: "Leave Requests", icon: <FaClipboardList /> },
  { key: "settings", label: "Settings", icon: <FaCog /> }
];

const AdminDashboard = ({ darkMode }) => {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <div className="admindash-root">
      <main className={`admindash-main${darkMode ? " dark" : ""}`}>
        {!activePanel && (
          <div className={`admindash-cards-grid${darkMode ? " dark" : ""}`}>
            {dashboardCards.map(item => (
              <div
                key={item.key}
                className={`admindash-card${darkMode ? " dark" : ""}`}
                onClick={() => setActivePanel(item.key)}
                tabIndex={0}
                role="button"
              >
                <span className="admindash-card-icon">{item.icon}</span>
                <span className="admindash-card-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {activePanel && (
          <div className={`admindash-panel${darkMode ? " dark" : ""}`}>
            <h2>{dashboardCards.find(c => c.key === activePanel)?.label}</h2>
            <div className={`admindash-placeholder${darkMode ? " dark" : ""}`}>
              {dashboardCards.find(c => c.key === activePanel)?.label} Panel Content
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
