// src/pages/Receptionist/Receptionist_Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaFileInvoiceDollar, FaUserInjured, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI, appointmentAPI, billingAPI } from '../../Service/recep_api';
import './Receptionist_Dashboard.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
    pendingBilling: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [patientsCount, appointmentsCount, billingCount] = await Promise.all([
          patientAPI.getCount(),
          appointmentAPI.getPendingCount(),
          billingAPI.getPendingCount(),
        ]);

        setStats({
          totalPatients: patientsCount,
          pendingAppointments: appointmentsCount,
          pendingBilling: billingCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Patients',
      icon: <FaUsers />,
      color: '#003087',
      path: '/manage-patients',
      description: 'Manage patient records',
    },
    {
      title: 'Appointments',
      icon: <FaCalendarAlt />,
      color: '#11457e',
      path: '/manage-appointments',
      description: 'Schedule and manage appointments',
    },
    {
      title: 'Billing',
      icon: <FaFileInvoiceDollar />,
      color: '#194276',
      path: '/manage-billing',
      description: 'Handle billing and payments',
    },
  ];

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <FaUserInjured />,
      color: '#28a745',
      path: '/patient-list',
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: <FaClock />,
      color: '#ffc107',
      path: '/appointment-list',
    },
    {
      title: 'Pending Billing',
      value: stats.pendingBilling,
      icon: <FaMoneyBillWave />,
      color: '#dc3545',
      path: '/billing-list',
    },
  ];

  return (
    <div className={`dashboard-container${darkMode ? ' dark' : ''}`}>
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

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome to Reception, {user?.username || 'User'}!</h1>
          <p>Manage patients, appointments, and billing efficiently</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Navigation Cards */}
            <div className="cards-grid">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className="dashboard-card nav-card"
                  onClick={() => navigate(card.path)}
                  style={{ borderTop: `4px solid ${card.color}` }}
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

            {/* Statistics Cards */}
            <div className="stats-grid">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className="dashboard-card stat-card"
                  onClick={() => navigate(card.path)}
                  style={{ borderLeft: `5px solid ${card.color}` }}
                >
                  <div className="stat-content">
                    <div className="stat-info">
                      <p className="stat-label">{card.title}</p>
                      <h2 className="stat-value">{card.value}</h2>
                    </div>
                    <div className="stat-icon" style={{ background: card.color }}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default ReceptionistDashboard;
