import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUsers, FaEdit, FaSearch, FaUserSlash } from "react-icons/fa";
import "./StaffDashboard.css";

const staffCards = [
  { key: "addStaff", label: "Add Staff", icon: <FaUserPlus /> },
  { key: "staffList", label: "Staff List", icon: <FaUsers /> },
  { key: "searchStaff", label: "Search/View Staff", icon: <FaSearch /> },
  { key: "editStaff", label: "Edit/Disable Staff", icon: <FaEdit /> }
];

const StaffManagementDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleCardClick = (key) => {
    if (key === "addStaff") {
      navigate("/admin/staff-form");
    } else if (key === "staffList") {
      navigate("/admin/staff-list");
    } else if (key === "searchStaff") {
      navigate("/admin/staff-search");
    } else if (key === "editStaff") {
      navigate("/admin/staff-list"); // assuming edit/disable from list
    }
  };

  return (
    <div className="staffdash-root">
      <button onClick={() => navigate("/admin")} style={{ marginBottom: "1rem" }}>Back to Admin Dashboard</button>
      <main className={`staffdash-main${darkMode ? " dark" : ""}`}>
        <div className={`staffdash-cards-grid${darkMode ? " dark" : ""}`}>
          {staffCards.map(item => (
            <div
              key={item.key}
              className={`staffdash-card${darkMode ? " dark" : ""}`}
              onClick={() => handleCardClick(item.key)}
              tabIndex={0}
              role="button"
            >
              <span className="staffdash-card-icon">{item.icon}</span>
              <span className="staffdash-card-label">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffManagementDashboard;
