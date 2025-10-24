// src/pages/Receptionist/ManageAppointments.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaList, FaSearch, FaEdit } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import './ManageAppointments.css';

const ManageAppointments = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={`manage-appointments-container${darkMode ? ' dark' : ''}`}>
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

      <div className="manage-appointments-content">
        <div className="page-header">
          <h1>Manage Appointments</h1>
          <p>Schedule, view, search, and manage patient appointments</p>
        </div>

        <div className="action-cards">
          {/* Card 1: Schedule Appointment */}
          <div 
            className="action-card schedule-card"
            onClick={() => navigate('/add-appointment')}
          >
            <div className="card-icon">
              <FaCalendarPlus />
            </div>
            <h3>Schedule Appointment</h3>
            <p>Book new appointment</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 2: List Appointments */}
          <div 
            className="action-card list-card"
            onClick={() => navigate('/appointment-list')}
          >
            <div className="card-icon">
              <FaList />
            </div>
            <h3>List Appointments</h3>
            <p>View all appointments</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 3: Search Appointments */}
          <div 
            className="action-card search-card"
            onClick={() => navigate('/appointment-search')}
          >
            <div className="card-icon">
              <FaSearch />
            </div>
            <h3>Search Appointments</h3>
            <p>Find appointments</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 4: Edit Appointment */}
          <div 
            className="action-card edit-card"
            onClick={() => navigate('/appointment-list')}
          >
            <div className="card-icon">
              <FaEdit />
            </div>
            <h3>Edit/Disable Appointments</h3>
            <p>Update appointment details</p>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ManageAppointments;
