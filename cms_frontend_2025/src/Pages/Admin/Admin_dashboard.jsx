import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaKey, FaClipboardList, FaBriefcaseMedical } from "react-icons/fa";
import "./AdminDashboard.css";

const dashboardCards = [
  { key: "staffManagement", label: "Staff Management", icon: <FaUsers /> },
  { key: "specializations", label: "Specializations", icon: <FaBriefcaseMedical /> },
  { key: "leaveRequests", label: "Leave Requests", icon: <FaClipboardList /> },
  { key: "generatePassword", label: "Generate Password", icon: <FaKey /> }
];

const AdminDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleCardClick = (key) => {
    if (key === "staffManagement") {
      navigate("/admin/staff-management");
    } else if (key === "specializations") {
      navigate("/admin/specializations-dashboard");
    } else if (key === "leaveRequests") {
      navigate("/leave-list");
    } else if (key === "generatePassword") {
      navigate("/admin/forgot-password-requests");
    }
  };

  return (
    <div className="admindash-root">
      <main className={`admindash-main${darkMode ? " dark" : ""}`}>
        <div className={`admindash-cards-grid${darkMode ? " dark" : ""}`}>
          {dashboardCards.map(item => (
            <div
              key={item.key}
              className={`admindash-card${darkMode ? " dark" : ""}`}
              onClick={() => handleCardClick(item.key)}
              tabIndex={0}
              role="button"
            >
              <span className="admindash-card-icon">{item.icon}</span>
              <span className="admindash-card-label">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
