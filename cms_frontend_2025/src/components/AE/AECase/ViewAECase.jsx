import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewAECase.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ViewAECase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const response = await api.get(`/ae/case/${id}/`);
      setCaseData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load case details');
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (caseData?.case_status) {
      case 'Active':
        return 'danger';
      case 'Under Treatment':
        return 'warning';
      case 'Discharged':
        return 'success';
      case 'Admitted':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getTriageColor = (triage) => {
    switch (triage) {
      case 'Red':
        return '#dc3545';
      case 'Orange':
        return '#fd7e14';
      case 'Yellow':
        return '#ffc107';
      case 'Green':
        return '#28a745';
      case 'Blue':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className={`view-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-ae-case-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading case details...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`view-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-ae-case-container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/ae-module/list-ae-cases')}>
              Back to List
            </button>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`view-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="view-ae-case-container">
        <div className="view-ae-case-content">
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
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module/ae-case-menu')}
            >
              <span>A&E Case Menu</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module/list-ae-cases')}
            >
              <span>Cases List</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">View Case</span>
          </div>

          {/* Case Header Card */}
          <div className="case-header-card">
            <div className="header-left">
              <div className="case-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <div className="header-info">
                <h1>A&E Case Details</h1>
                <div className="badge-row">
                  <span className="code-badge">{caseData.case_code}</span>
                  <span className={`status-badge badge-${getStatusColor()}`}>
                    {caseData.case_status}
                  </span>
                  {caseData.triage_category && (
                    <span 
                      className="triage-badge"
                      style={{ backgroundColor: getTriageColor(caseData.triage_category) }}
                    >
                      {caseData.triage_category} Priority
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="header-actions">
              {caseData.case_status === 'Active' && (
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/ae-module/update-ae-case/${id}`)}
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit Case
                </button>
              )}
            </div>
          </div>

          <div className="details-grid">
            
            {/* Patient Information */}
            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-user"></i>
                <h3>Patient Information</h3>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Patient Type</label>
                  <span className={`badge badge-${caseData.patient_type === 'Permanent' ? 'primary' : 'warning'}`}>
                    {caseData.patient_type}
                  </span>
                </div>
                <div className="info-item">
                  <label>Patient Name</label>
                  <span>{caseData.patient_name || 'Unknown'}</span>
                </div>
                {caseData.patient_code && (
                  <div className="info-item">
                    <label>Patient Code</label>
                    <span className="highlight">{caseData.patient_code}</span>
                  </div>
                )}
                {caseData.temp_patient_code && (
                  <div className="info-item">
                    <label>Temp Patient Code</label>
                    <span className="highlight">{caseData.temp_patient_code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Case Information */}
            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-info-circle"></i>
                <h3>Case Information</h3>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Case Code</label>
                  <span className="highlight">{caseData.case_code}</span>
                </div>
                <div className="info-item">
                  <label>Arrival Time</label>
                  <span>
                    <i className="fas fa-calendar me-2"></i>
                    {formatDateTime(caseData.arrival_time)}
                  </span>
                </div>
                <div className="info-item">
                  <label>Case Status</label>
                  <span className={`status-badge badge-${getStatusColor()}`}>
                    {caseData.case_status}
                  </span>
                </div>
                {caseData.triage_category && (
                  <div className="info-item">
                    <label>Triage Category</label>
                    <span 
                      className="triage-badge"
                      style={{ backgroundColor: getTriageColor(caseData.triage_category) }}
                    >
                      {caseData.triage_category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ambulance Information */}
            {caseData.ambulance_number && (
              <div className="detail-card">
                <div className="card-header">
                  <i className="fas fa-ambulance"></i>
                  <h3>Ambulance Details</h3>
                </div>
                <div className="card-body">
                  <div className="info-item">
                    <label>Vehicle Number</label>
                    <span>{caseData.ambulance_number}</span>
                  </div>
                  {caseData.ambulance_driver && (
                    <div className="info-item">
                      <label>Driver</label>
                      <span>{caseData.ambulance_driver}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Doctor Information */}
            {caseData.referring_doctor_name && (
              <div className="detail-card">
                <div className="card-header">
                  <i className="fas fa-user-md"></i>
                  <h3>Referring Doctor</h3>
                </div>
                <div className="card-body">
                  <div className="info-item">
                    <label>Doctor Name</label>
                    <span>Dr. {caseData.referring_doctor_name}</span>
                  </div>
                  {caseData.doctor_specialization && (
                    <div className="info-item">
                      <label>Specialization</label>
                      <span>{caseData.doctor_specialization}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chief Complaint */}
            <div className="detail-card full-width">
              <div className="card-header">
                <i className="fas fa-file-medical"></i>
                <h3>Chief Complaint</h3>
              </div>
              <div className="card-body">
                <p className="description-text">{caseData.chief_complaint}</p>
              </div>
            </div>

            {/* Vital Signs */}
            {caseData.vital_signs && (
              <div className="detail-card full-width">
                <div className="card-header">
                  <i className="fas fa-heartbeat"></i>
                  <h3>Vital Signs</h3>
                </div>
                <div className="card-body">
                  <p className="description-text">{caseData.vital_signs}</p>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {caseData.notes && (
              <div className="detail-card full-width">
                <div className="card-header">
                  <i className="fas fa-notes-medical"></i>
                  <h3>Additional Notes</h3>
                </div>
                <div className="card-body">
                  <p className="description-text">{caseData.notes}</p>
                </div>
              </div>
            )}

          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {caseData.case_status === 'Active' && (
              <>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/ae-module/update-ae-case/${id}`)}
                >
                  <i className="fas fa-edit me-2"></i>
                  Update Case
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/ae-module/add-treatment/${id}`)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Treatment
                </button>
              </>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/ae-module/list-ae-cases')}
            >
              <i className="fas fa-list me-2"></i>
              View All Cases
            </button>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ViewAECase;
