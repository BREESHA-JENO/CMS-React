import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTempPatient.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ViewTempPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/ae/temp-patient/${id}/`);
      setPatient(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load patient details');
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (patient?.status) {
      case 'Active':
        return 'success';
      case 'Merged':
        return 'primary';
      case 'Deceased':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
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
      <div className={`view-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-temp-patient-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading patient details...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`view-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-temp-patient-container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/ae-module/list-temp-patients')}>
              Back to List
            </button>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`view-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="view-temp-patient-container">
        <div className="view-temp-patient-content">
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
              onClick={() => navigate('/ae-module/temp-patient-menu')}
            >
              <span>Temp Patient Menu</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module/list-temp-patients')}
            >
              <span>List Patients</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">View Patient</span>
          </div>

          <div className="patient-header-card">
            <div className="header-left">
              <div className="patient-avatar">
                <i className="fas fa-user-injured"></i>
              </div>
              <div className="header-info">
                <h1>{patient.name}</h1>
                <div className="badge-row">
                  <span className="code-badge">{patient.temp_patient_code}</span>
                  <span className={`status-badge badge-${getStatusColor()}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              {patient.status === 'Active' && (
                <>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/ae-module/update-temp-patient/${id}`)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Patient
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/ae-module/convert-to-permanent/${id}`)}
                  >
                    <i className="fas fa-user-check me-2"></i>
                    Convert to Permanent
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="details-grid">
            
            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-user"></i>
                <h3>Personal Information</h3>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{patient.name}</span>
                </div>
                <div className="info-item">
                  <label>Approximate Age</label>
                  <span>{patient.approx_age ? `${patient.approx_age} years` : 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <span>{patient.gender || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  <span>
                    {patient.emergency_contact ? (
                      <>
                        <i className="fas fa-phone me-2"></i>
                        {patient.emergency_contact}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-info-circle"></i>
                <h3>Registration Information</h3>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Patient Code</label>
                  <span className="highlight">{patient.temp_patient_code}</span>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span className={`status-badge badge-${getStatusColor()}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="info-item">
                  <label>Registered On</label>
                  <span>
                    <i className="fas fa-calendar me-2"></i>
                    {formatDate(patient.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {patient.description && (
              <div className="detail-card full-width">
                <div className="card-header">
                  <i className="fas fa-file-medical"></i>
                  <h3>Patient Description</h3>
                </div>
                <div className="card-body">
                  <p className="description-text">{patient.description}</p>
                </div>
              </div>
            )}

            {patient.identification_marks && (
              <div className="detail-card full-width">
                <div className="card-header">
                  <i className="fas fa-fingerprint"></i>
                  <h3>Identification Marks</h3>
                </div>
                <div className="card-body">
                  <p className="description-text">{patient.identification_marks}</p>
                </div>
              </div>
            )}

          </div>

          {patient.status === 'Merged' && (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Merged:</strong> This temporary patient has been converted to a permanent patient record.
            </div>
          )}

          {patient.status === 'Deceased' && (
            <div className="alert alert-danger">
              <i className="fas fa-cross me-2"></i>
              <strong>Deceased:</strong> This patient is marked as deceased.
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ViewTempPatient;
