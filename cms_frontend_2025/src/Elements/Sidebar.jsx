import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ open, role, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  let links = [];
  if (role === "ADMIN") {
    links = [
      { path: "/admin", label: "Admin Dashboard" },
      { path: "/admin/staff-form/:id?", label: "Add Staff" },
      { path: "/admin/staff-list", label: "Staff List" },
      { path: "/leave-list", label: "Leave Requests" },
      { path: "/admin/ambulance", label: "Ambulance Management" }, 
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
