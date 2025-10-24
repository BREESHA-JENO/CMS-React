// src/pages/Receptionist/ManagePatients.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaList, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import './ManagePatients.css';

const ManagePatients = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const actionButtons = [
    {
      title: 'Add Patient',
      icon: <FaUserPlus />,
      color: '#28a745',
      path: '/add-patient',
      description: 'Register new patient',
    },
    {
      title: 'List Patients',
      icon: <FaList />,
      color: '#003087',
      path: '/patient-list',
      description: 'View all patients',
    },
    {
      title: 'Search and View',
      icon: <FaSearch />,
      color: '#17a2b8',
      path: '/patient-search',
      description: 'Search by ID or phone',
    },
    {
      title: 'Edit / Disable',
      icon: <FaEdit />,
      color: '#ffc107',
      path: '/edit-patient',
      description: 'Update patient details',
    },
    {
      title: 'Delete Patient',
      icon: <FaTrash />,
      color: '#dc3545',
      path: '/delete-patient',
      description: 'Remove patient record',
    },
  ];

  return (
    <div className={`manage-container${darkMode ? ' dark' : ''}`}>
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar
        open={sidebarOpen}
        role={user?.role}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="manage-content">
        <div className="manage-header">
          <h1>Manage Patients</h1>
          <p>Complete patient management system</p>
        </div>

        <div className="action-buttons-grid">
          {actionButtons.map((button, index) => (
            <div
              key={index}
              className="action-button-card"
              onClick={() => navigate(button.path)}
              style={{ borderTop: `4px solid ${button.color}` }}
            >
              <div className="action-icon" style={{ background: button.color }}>
                {button.icon}
              </div>
              <h3>{button.title}</h3>
              <p>{button.description}</p>
              <div className="action-arrow" style={{ color: button.color }}>
                →
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ManagePatients;
