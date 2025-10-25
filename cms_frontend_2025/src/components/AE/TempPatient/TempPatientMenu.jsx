import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';
import './TempPatientMenu.css';

const TempPatientMenu = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const actions = [
    {
      id: 1,
      title: 'Add Temp Patient',
      subtitle: 'Register unknown patient',
      icon: 'fa-user-plus',
      iconColor: '#28a745',
      borderColor: '#28a745',
      path: '/ae-module/add-temp-patient'
    },
    {
      id: 2,
      title: 'List Patients',
      subtitle: 'View all temporary patients',
      icon: 'fa-list',
      iconColor: '#003087',
      borderColor: '#003087',
      path: '/ae-module/list-temp-patients'
    },
    {
      id: 3,
      title: 'Search Patient',
      subtitle: 'Find specific patient',
      icon: 'fa-search',
      iconColor: '#17a2b8',
      borderColor: '#17a2b8',
      path: '/ae-module/search-temp-patient'
    },
    {
      id: 4,
      title: 'Update Patient',
      subtitle: 'Edit patient details',
      icon: 'fa-edit',
      iconColor: '#ffc107',
      borderColor: '#ffc107',
      path: '/ae-module/list-temp-patients'
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`temp-patient-menu-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="temp-patient-menu-container">
        <div className="temp-patient-menu-content">
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
            <span className="breadcrumb-current">Temp Patient Menu</span>
          </div>

          <div className="temp-patient-menu-header">
            <h1>Temporary Patient Management</h1>
            <p>Register and manage unknown/unconscious emergency patients</p>
          </div>

          <div className="temp-patient-cards-grid">
            {actions.map((action) => (
              <div
                key={action.id}
                className="temp-patient-card"
                style={{ borderTopColor: action.borderColor }}
                onClick={() => navigate(action.path)}
              >
                <div
                  className="temp-patient-card-icon"
                  style={{ backgroundColor: action.iconColor }}
                >
                  <i className={`fas ${action.icon}`}></i>
                </div>
                <h3>{action.title}</h3>
                <p>{action.subtitle}</p>
                <div
                  className="temp-patient-card-arrow"
                  style={{ color: action.borderColor }}
                >
                  →
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

export default TempPatientMenu;
