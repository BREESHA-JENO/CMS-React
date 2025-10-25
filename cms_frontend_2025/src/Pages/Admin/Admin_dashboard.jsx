// AdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaKey, FaClipboardList, FaBriefcaseMedical } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Staff Management',
      icon: <FaUsers />,
      color: '#003087',
      path: '/admin/staff-management',
      description: 'Manage staff records and details',
    },
    {
      title: 'Specializations',
      icon: <FaBriefcaseMedical />,
      color: '#11457e',
      path: '/admin/specializations-dashboard',
      description: 'Manage medical specializations',
    },
    {
      title: 'Leave Requests',
      icon: <FaClipboardList />,
      color: '#194276',
      path: '/leave-list',
      description: 'Review and manage leave requests',
    },
    {
      title: 'Generate Password',
      icon: <FaKey />,
      color: '#dc3545',
      path: '/admin/forgot-password-requests',
      description: 'Handle password generation requests',
    },
  ];

  return (
    <div className={`dashboard-container${darkMode ? ' dark' : ''}`}>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Manage system settings and user accounts</p>
        </div>

        <div className="cards-grid">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="dashboard-card nav-card"
              onClick={() => navigate(card.path)}
              style={{ borderTop: `4px solid ${card.color}` }}
              tabIndex={0}
              role="button"
            >
              <div className="card-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
