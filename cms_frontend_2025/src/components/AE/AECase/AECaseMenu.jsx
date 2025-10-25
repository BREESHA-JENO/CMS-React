import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AECaseMenu.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const AECaseMenu = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const actions = [
    {
      id: 1,
      title: 'Register A&E Case',
      subtitle: 'New emergency case',
      icon: 'fa-ambulance',
      iconColor: '#dc3545',
      borderColor: '#dc3545',
      path: '/ae-module/add-ae-case'
    },
    {
      id: 2,
      title: 'Active Cases',
      subtitle: 'View ongoing cases',
      icon: 'fa-heartbeat',
      iconColor: '#28a745',
      borderColor: '#28a745',
      path: '/ae-module/list-ae-cases'
    },
    {
      id: 3,
      title: 'Search Case',
      subtitle: 'Find specific case',
      icon: 'fa-search',
      iconColor: '#17a2b8',
      borderColor: '#17a2b8',
      path: '/ae-module/search-ae-case'
    },
    {
      id: 4,
      title: 'Case History',
      subtitle: 'View all cases',
      icon: 'fa-history',
      iconColor: '#6c757d',
      borderColor: '#6c757d',
      path: '/ae-module/case-history'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`ae-case-menu-wrapper ${darkMode ? 'dark' : ''}`}>
      <Header1
        onSidebarToggle={handleSidebarToggle}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar
        open={sidebarOpen}
        role={role}
        onClose={handleCloseSidebar}
      />

      <div className="ae-case-menu-container">
        <div className="ae-case-menu-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module')}
            >
              <i className="fas fa-chevron-left"></i>
              <span>A&E Module</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">A&E Case Management</span>
          </div>

          {/* Header */}
          <div className="ae-case-menu-header">
            <h1>
              <i className="fas fa-procedures me-3"></i>
              A&E Case Management
            </h1>
            <p>Register and manage accident & emergency cases</p>
          </div>

          {/* Cards Grid */}
          <div className="ae-case-cards-grid">
            {actions.map((action) => (
              <div
                key={action.id}
                className="ae-case-card"
                style={{ borderTopColor: action.borderColor }}
                onClick={() => navigate(action.path)}
              >
                <div 
                  className="ae-case-card-icon" 
                  style={{ backgroundColor: action.iconColor }}
                >
                  <i className={`fas ${action.icon}`}></i>
                </div>
                <h3>{action.title}</h3>
                <p>{action.subtitle}</p>
                <div 
                  className="ae-case-card-arrow" 
                  style={{ color: action.borderColor }}
                >
                  →
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card red">
              <i className="fas fa-exclamation-circle"></i>
              <div>
                <h4>Critical</h4>
                <p>Emergency cases requiring immediate attention</p>
              </div>
            </div>
            <div className="stat-card green">
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>Stable</h4>
                <p>Cases under observation and treatment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default AECaseMenu;
