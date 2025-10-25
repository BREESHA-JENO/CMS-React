import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TreatmentMenu.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const TreatmentMenu = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const actions = [
    {
      id: 1,
      title: 'Add Treatment',
      subtitle: 'Record new treatment',
      icon: 'fa-pills',
      iconColor: '#17a2b8',
      borderColor: '#17a2b8',
      path: '/ae-module/select-case-for-treatment'
    },
    {
      id: 2,
      title: 'View Treatments',
      subtitle: 'View case treatments',
      icon: 'fa-list-alt',
      iconColor: '#6610f2',
      borderColor: '#6610f2',
      path: '/ae-module/select-case-for-view'
    },
    {
      id: 3,
      title: 'Treatment History',
      subtitle: 'All treatments log',
      icon: 'fa-history',
      iconColor: '#6c757d',
      borderColor: '#6c757d',
      path: '/ae-module/treatment-history'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`treatment-menu-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="treatment-menu-container">
        <div className="treatment-menu-content">
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
            <span className="breadcrumb-current">Treatment Menu</span>
          </div>

          {/* Header */}
          <div className="treatment-menu-header">
            <h1>
              <i className="fas fa-procedures me-3"></i>
              Treatment Management
            </h1>
            <p>Record and manage treatments for A&E cases</p>
          </div>

          {/* Cards Grid */}
          <div className="treatment-cards-grid">
            {actions.map((action) => (
              <div
                key={action.id}
                className="treatment-card"
                style={{ borderTopColor: action.borderColor }}
                onClick={() => navigate(action.path)}
              >
                <div 
                  className="treatment-card-icon" 
                  style={{ backgroundColor: action.iconColor }}
                >
                  <i className={`fas ${action.icon}`}></i>
                </div>
                <h3>{action.title}</h3>
                <p>{action.subtitle}</p>
                <div 
                  className="treatment-card-arrow" 
                  style={{ color: action.borderColor }}
                >
                  →
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="treatment-info-cards">
            <div className="info-card cyan">
              <i className="fas fa-syringe"></i>
              <div>
                <h4>Medications</h4>
                <p>Record medicines administered to patients</p>
              </div>
            </div>
            <div className="info-card purple">
              <i className="fas fa-procedures"></i>
              <div>
                <h4>Procedures</h4>
                <p>Document medical procedures performed</p>
              </div>
            </div>
            <div className="info-card gray">
              <i className="fas fa-notes-medical"></i>
              <div>
                <h4>Observations</h4>
                <p>Track patient monitoring and observations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default TreatmentMenu;
