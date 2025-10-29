import React from "react";
import { FaCalendarDay, FaCheckCircle, FaHourglassHalf, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import "../../Pages/Doctor/DoctorDashboard.css";

const Doctor = ({ onAction, doctorInfo, dashboardStats, darkMode }) => {
  const actionButtons = [
    {
      title: "View Appointments",
      description: "Manage appointments and consult patients",
      icon: <FaCalendarAlt />,
      action: "viewAppointments"
    },
  ];

  return (
    <div className="doctor-dashboard-root">
      <div className={`doctor-dashboard-main${darkMode ? " dark" : ""}`}>
        {/* Header Section */}
        <div className={`doctor-dashboard-header${darkMode ? " dark" : ""}`}>
          <h1 className={`doctor-dashboard-title${darkMode ? " dark" : ""}`}>Doctor Dashboard</h1>
          {doctorInfo && (
            <div className="doctor-info-card">
              <p className="doctor-info-name">
                Welcome, Dr. {doctorInfo.name || 'Doctor'}
              </p>
              <p className="doctor-info-id">
                Staff ID: {doctorInfo.staff_id || 'N/A'}
              </p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="doctor-stats-grid">
          <div className={`doctor-stat-card${darkMode ? " dark" : ""}`}>
            <div className="doctor-stat-icon"><FaCalendarDay /></div>
            <span className={`doctor-stat-number${darkMode ? " dark" : ""}`}>{dashboardStats?.todayAppointments || 0}</span>
            <div className={`doctor-stat-label${darkMode ? " dark" : ""}`}>Today's Appointments</div>
          </div>
          <div className={`doctor-stat-card${darkMode ? " dark" : ""}`}>
            <div className="doctor-stat-icon"><FaCheckCircle /></div>
            <span className={`doctor-stat-number${darkMode ? " dark" : ""}`}>{dashboardStats?.todayConsulted || 0}</span>
            <div className={`doctor-stat-label${darkMode ? " dark" : ""}`}>Consulted Today</div>
          </div>
          <div className={`doctor-stat-card${darkMode ? " dark" : ""}`}>
            <div className="doctor-stat-icon"><FaHourglassHalf /></div>
            <span className={`doctor-stat-number${darkMode ? " dark" : ""}`}>{dashboardStats?.todayRemaining || 0}</span>
            <div className={`doctor-stat-label${darkMode ? " dark" : ""}`}>Remaining Today</div>
          </div>
          <div className={`doctor-stat-card${darkMode ? " dark" : ""}`}>
            <div className="doctor-stat-icon"><FaCalendarWeek /></div>
            <span className={`doctor-stat-number${darkMode ? " dark" : ""}`}>{dashboardStats?.tomorrowAppointments || 0}</span>
            <div className={`doctor-stat-label${darkMode ? " dark" : ""}`}>Tomorrow's Appointments</div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="doctor-actions-section">
          <h2 className={`doctor-actions-title${darkMode ? " dark" : ""}`}>Quick Actions</h2>
          <div className="doctor-actions-grid">
            {actionButtons.map((btn, i) => (
              <div
                key={i}
                className={`doctor-action-card${darkMode ? " dark" : ""}`}
                onClick={() => {
                  console.log('Action card clicked:', btn.action);
                  onAction(btn.action);
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onAction(btn.action)}
              >
                <div className="doctor-action-icon">{btn.icon}</div>
                <div className={`doctor-action-title${darkMode ? " dark" : ""}`}>{btn.title}</div>
                <div className={`doctor-action-description${darkMode ? " dark" : ""}`}>{btn.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;