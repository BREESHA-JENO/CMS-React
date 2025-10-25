import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaHome } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ open, role, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  // Get user data for doctor details
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  let links = [];
  if (role === "ADMIN") {
    links = [
      { path: "/admin", label: "Admin Dashboard" },
      { path: "/admin/staff-form/:id?", label: "Add Staff" },
      { path: "/admin/staff-list", label: "Staff List" },
      { path: "/leave-list", label: "Leave Requests" },
      { path: "/admin/ambulance", label: "Ambulance Management" }, 
      { path: "/admin/ambulance-requests", label: "Ambulance Requests" },
      { path: "/settings", label: "Settings" }
    ];
  } else if (role === "REC") {
    links = [
      { path: "/receptionist", label: "Receptionist Dashboard" },
      { path: "/manage-patients", label: "Patients" },
      { path: "/manage-appointments", label: "Appointments" },
      { path: "/manage-billing", label: "Billing" },
      { path: "/ae-module", label: "Accident & Emergency" }
    ];
  }

  return (
    <aside className="sidebar">
      <button className="sidebar-close" onClick={onClose}>&times;</button>
      
      {/* Doctor Details Section */}
      {role === "DOC" && (
        <div className="sidebar-doctor-info">
          <div className="sidebar-doctor-avatar">
            <FaUserMd size={48} />
          </div>
          <div className="sidebar-doctor-details">
            <h3 className="sidebar-doctor-name">Dr. {user?.name || user?.username || 'Doctor'}</h3>
            <p className="sidebar-doctor-id">Staff ID: {user?.staff_id || user?.id || 'N/A'}</p>
            <p className="sidebar-doctor-specialty">{user?.specialization || 'Medical Doctor'}</p>
          </div>
        </div>
      )}

      <ul>
        {links.map(link => (
          <li key={link.path}>
            <button 
              className="nav-link" 
              onClick={() => { 
                navigate(link.path); 
                onClose(); 
              }}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
