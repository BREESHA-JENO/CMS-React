import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import './AELanding.css';

const AELanding = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const modules = [
    {
      id: 1,
      title: 'Temporary Patient',
      subtitle: 'Register unknown patients',
      icon: 'fa-user-injured',
      iconColor: '#28a745',
      borderColor: '#28a745',
      path: '/ae-module/temp-patient-menu'
    },
    {
      id: 2,
      title: 'A&E Case Management',
      subtitle: 'Emergency case registration',
      icon: 'fa-procedures',
      iconColor: '#dc3545',
      borderColor: '#dc3545',
      path: '/ae-module/ae-case-menu'
    },
    {
      id: 3,
      title: 'Treatment Management',
      subtitle: 'Record treatments',
      icon: 'fa-pills',
      iconColor: '#17a2b8',
      borderColor: '#17a2b8',
      path: '/ae-module/treatment-menu'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`ae-landing-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="ae-landing-container">
        <div className="ae-landing-content">
          <div className="ae-landing-header">
            <h1>Accident & Emergency Module</h1>
            <p>Comprehensive emergency patient care and case management</p>
          </div>

          <div className="ae-cards-grid">
            {modules.map((module) => (
              <div
                key={module.id}
                className="ae-card"
                style={{ borderTopColor: module.borderColor }}
                onClick={() => navigate(module.path)}
              >
                <div
                  className="ae-card-icon"
                  style={{ backgroundColor: module.iconColor }}
                >
                  <i className={`fas ${module.icon}`}></i>
                </div>
                <h3 className="ae-card-title">{module.title}</h3>
                <p className="ae-card-subtitle">{module.subtitle}</p>
                <div className="ae-card-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default AELanding;
