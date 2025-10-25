// SpecializationsDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaListAlt, FaEdit, FaUserSlash } from 'react-icons/fa';
import './SpecializationDashboard.css';

const SpecializationsDashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  const specializationCards = [
    {
      title: 'Add Specialization',
      icon: <FaUserPlus />,
      color: '#003087',
      path: '/admin/specializations/add',
      description: 'Add new medical specializations',
    },
    {
      title: 'List Specializations',
      icon: <FaListAlt />,
      color: '#11457e',
      path: '/admin/specializations',
      description: 'View all specializations',
    },
    {
      title: 'Search Specialization',
      icon: <FaSearch />,
      color: '#194276',
      path: '/admin/specializations/search',
      description: 'Search for specific specializations',
    },
    {
      title: 'Edit/View Specialization',
      icon: <FaEdit />,
      color: '#28a745',
      path: '/admin/specializations',
      description: 'Edit or view specialization details',
    },
    {
      title: 'Disable Specialization',
      icon: <FaUserSlash />,
      color: '#dc3545',
      path: '/admin/specializations',
      description: 'Disable specializations',
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
          <h1>Specializations Management</h1>
          <p>Manage medical specializations and categories</p>
        </div>

        <div className="cards-grid">
          {specializationCards.map((card, index) => (
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

export default SpecializationsDashboard;
