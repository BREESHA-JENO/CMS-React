// StaffManagementDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaEdit, FaSearch } from 'react-icons/fa';
import './StaffDashboard.css';

const StaffManagementDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const staffCards = [
    {
      title: 'Add Staff',
      icon: <FaUserPlus />,
      color: '#003087',
      path: '/admin/staff-form',
      description: 'Add new staff members',
    },
    {
      title: 'Staff List',
      icon: <FaUsers />,
      color: '#11457e',
      path: '/admin/staff-list',
      description: 'View all staff members',
    },
    {
      title: 'Search/View Staff',
      icon: <FaSearch />,
      color: '#194276',
      path: '/admin/staff-search',
      description: 'Search and view staff details',
    },
    {
      title: 'Edit/Disable Staff',
      icon: <FaEdit />,
      color: '#28a745',
      path: '/admin/staff-list',
      description: 'Edit or disable staff records',
    },
  ];

  return (
    <div className={`dashboard-container${darkMode ? ' dark' : ''}`}>
      <div className="dashboard-content">
        <div className="back-button-container">
          <button 
            onClick={() => navigate('/admin')} 
            className="btn-back"
          >
            ← Back to Admin Dashboard
          </button>
        </div>

        <div className="welcome-section">
          <h1>Staff Management</h1>
          <p>Manage staff records and information</p>
        </div>

        <div className="cards-grid">
          {staffCards.map((card, index) => (
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

export default StaffManagementDashboard;
