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
      { path: "/add-staff", label: "Add Staff" },
      { path: "/staff-list", label: "Staff List" },
      { path: "/leave-list", label: "Leave Requests" },
      { path: "/settings", label: "Settings" }
    ];
  } else if (role === "REC") {
    links = [
      { path: "/receptionist", label: "Receptionist Dashboard" },
      { path: "/patient-list", label: "Patient List" },
      { path: "/manage-appointments", label: "Appointments" }
    ];
  }
  // add more roles as needed...

  return (
    <aside className="sidebar">
      <button className="sidebar-close" onClick={onClose}>&times;</button>
      <ul>
        {links.map(link => (
          <li key={link.path}>
            <button className="nav-link" onClick={() => { navigate(link.path); onClose(); }}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
