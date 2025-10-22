import React, { useState } from 'react';
import './Receptionist_dashboard.css';
import Receptionist from '../../components/Receptionist/Receptionist';

function ReceptionistDashboard() {
  const [showSummary, setShowSummary] = useState(false);
  const [mode, setMode] = useState('');

  return (
    <div className="receptionist-dashboard-container">
      <div className="dashboard-summary-section">
        <button
          className="summary-dropdown-btn"
          onClick={() => setShowSummary(!showSummary)}
        >
          Summary ▼
        </button>
        {showSummary && (
          <div className="dashboard-summary-content">
            <div className="summary-item">
              <span>New Patients Today:</span>
              <strong>25</strong>
            </div>
            <div className="summary-item">
              <span>Appointments Scheduled:</span>
              <strong>40</strong>
            </div>
            <div className="summary-item">
              <span>Pending Bills:</span>
              <strong>15</strong>
            </div>
          </div>
        )}
      </div>
      {mode === "" && (
        <div className="patient-actions-grid">
          <button className="action-btn" onClick={() => setMode("add")}>Add Patient</button>
          <button className="action-btn" onClick={() => setMode("search")}>Search Patient</button>
          <button className="action-btn" onClick={() => setMode("appointments")}>View Appointments</button>
          <button className="action-btn" onClick={() => setMode("report")}>Generate Report</button>
        </div>
      )}
      {mode === "add" && <Receptionist onCancel={() => setMode("")} />}
      {/* Add other sections/components as needed for search/appointments/report */}
    </div>
  );
}

export default ReceptionistDashboard;
