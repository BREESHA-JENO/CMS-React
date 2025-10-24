import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSearch, FaListAlt, FaEdit, FaUserSlash } from "react-icons/fa";
import "./SpecializationDashboard.css";

const specializationCards = [
  { key: "addSpecialization", label: "Add Specialization", icon: <FaUserPlus /> },
  { key: "listSpecialization", label: "List Specializations", icon: <FaListAlt /> },
  { key: "searchSpecialization", label: "Search Specialization", icon: <FaSearch /> },
  { key: "editSpecialization", label: "Edit/View Specialization", icon: <FaEdit /> },
  { key: "disableSpecialization", label: "Disable Specialization", icon: <FaUserSlash /> }
];

const SpecializationsDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleCardClick = (key) => {
    if (key === "addSpecialization") {
      navigate("/admin/specializations/add");
    } else if (key === "listSpecialization" || key === "editSpecialization" || key === "disableSpecialization") {
      navigate("/admin/specializations");
    } else if (key === "searchSpecialization") {
      navigate("/admin/specializations/search");
    }
  };

  return (
    <div className="specdash-root">
      <button onClick={() => navigate("/admin")} style={{ marginBottom: "1rem" }}>Back to Admin Dashboard</button>
      <main className={`specdash-main${darkMode ? " dark" : ""}`}>
        <div className={`specdash-cards-grid${darkMode ? " dark" : ""}`}>
          {specializationCards.map(item => (
            <div
              key={item.key}
              className={`specdash-card${darkMode ? " dark" : ""}`}
              onClick={() => handleCardClick(item.key)}
              tabIndex={0}
              role="button"
            >
              <span className="specdash-card-icon">{item.icon}</span>
              <span className="specdash-card-label">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SpecializationsDashboard;
