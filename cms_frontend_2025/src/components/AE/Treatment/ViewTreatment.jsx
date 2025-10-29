import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTreatment } from '../../../Service/ae_api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewTreatment.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ViewTreatment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTreatment();
  }, [id]);

  const fetchTreatment = async () => {
  try {
    const response = await getTreatment(id); // Uses aeapi.js wrapper
    setTreatment(response.data);
    setLoading(false);
  } catch (err) {
    setError('Failed to load treatment details');
    setLoading(false);
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

  const getTreatmentIcon = (type) => {
    switch (type) {
      case 'Medication':
        return 'fa-pills';
      case 'Procedure':
        return 'fa-procedures';
      case 'Observation':
        return 'fa-eye';
      case 'Surgery':
        return 'fa-cut';
      case 'Diagnostic':
        return 'fa-x-ray';
      default:
        return 'fa-notes-medical';
    }
  };

  const getTreatmentColor = (type) => {
    switch (type) {
      case 'Medication':
        return '#17a2b8';
      case 'Procedure':
        return '#6610f2';
      case 'Observation':
        return '#28a745';
      case 'Surgery':
        return '#dc3545';
      case 'Diagnostic':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className={`view-treatment-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-treatment-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading treatment details...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`view-treatment-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="view-treatment-container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`view-treatment-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="view-treatment-container">
        <div className="view-treatment-content">
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
              onClick={() => navigate(`/ae-module/view-ae-case/${treatment.ae_case_id}`)}
            >
              <span>View Case</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              className="breadcrumb-back"
              onClick={() => navigate(`/ae-module/case-treatments/${treatment.ae_case_id}`)}
            >
              <span>Treatments</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">View Treatment</span>
          </div>

          {/* Treatment Header Card */}
          <div className="treatment-header-card" style={{ borderColor: getTreatmentColor(treatment.treatment_type) }}>
            <div className="header-left">
              <div className="treatment-icon" style={{ backgroundColor: getTreatmentColor(treatment.treatment_type) }}>
                <i className={`fas ${getTreatmentIcon(treatment.treatment_type)}`}></i>
              </div>
              <div className="header-info">
                <h1>Treatment Details</h1>
                <div className="badge-row">
                  <span className="type-badge" style={{ backgroundColor: getTreatmentColor(treatment.treatment_type) }}>
                    {treatment.treatment_type}
                  </span>
                  <span className="time-badge">
                    <i className="fas fa-clock me-2"></i>
                    {formatDateTime(treatment.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-grid">
            
            {/* Case Information */}
            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-file-medical"></i>
                <h3>Linked Case</h3>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Case Code</label>
                  <span className="highlight">{treatment.case_code}</span>
                </div>
                <div className="info-item">
                  <label>Patient Name</label>
                  <span>{treatment.patient_name || 'Unknown'}</span>
                </div>
                <div className="info-item-action">
                  <button
                    className="btn btn-sm btn-view-case"
                    onClick={() => navigate(`/ae-module/view-ae-case/${treatment.ae_case_id}`)}
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    View Case Details
                  </button>
                </div>
              </div>
            </div>

            {/* Treatment Type */}
            <div className="detail-card">
              <div className="card-header">
                <i className="fas fa-tag"></i>
                <h3>Treatment Type</h3>
              </div>
              <div className="card-body">
                <div className="type-display" style={{ backgroundColor: `${getTreatmentColor(treatment.treatment_type)}15` }}>
                  <i className={`fas ${getTreatmentIcon(treatment.treatment_type)}`} style={{ color: getTreatmentColor(treatment.treatment_type) }}></i>
                  <span style={{ color: getTreatmentColor(treatment.treatment_type) }}>{treatment.treatment_type}</span>
                </div>
              </div>
            </div>

            {/* Medication Details (if applicable) */}
            {treatment.medication_name && (
              <div className="detail-card">
                <div className="card-header">
                  <i className="fas fa-prescription-bottle"></i>
                  <h3>Medication Details</h3>
                </div>
                <div className="card-body">
                  <div className="info-item">
                    <label>Medication Name</label>
                    <span className="highlight">{treatment.medication_name}</span>
                  </div>
                  {treatment.dosage && (
                    <div className="info-item">
                      <label>Dosage</label>
                      <span>{treatment.dosage}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Administered By */}
            {treatment.administered_by_name && (
              <div className="detail-card">
                <div className="card-header">
                  <i className="fas fa-user-md"></i>
                  <h3>Administered By</h3>
                </div>
                <div className="card-body">
                  <div className="info-item">
                    <label>Staff Name</label>
                    <span>{treatment.administered_by_name}</span>
                  </div>
                  {treatment.staff_role && (
                    <div className="info-item">
                      <label>Role</label>
                      <span>{treatment.staff_role}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Treatment Details - Full Width */}
            <div className="detail-card full-width">
              <div className="card-header">
                <i className="fas fa-info-circle"></i>
                <h3>Treatment Details</h3>
              </div>
              <div className="card-body">
                <p className="description-text">{treatment.treatment_details}</p>
              </div>
            </div>

            {/* Additional Notes - Full Width */}
            {treatment.notes && (
              <div className="detail-card full-width notes-card">
                <div className="card-header">
                  <i className="fas fa-sticky-note"></i>
                  <h3>Additional Notes</h3>
                </div>
                <div className="card-body">
                  <p className="description-text">{treatment.notes}</p>
                </div>
              </div>
            )}

          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/ae-module/case-treatments/${treatment.ae_case_id}`)}
            >
              <i className="fas fa-list me-2"></i>
              View All Treatments
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/ae-module/view-ae-case/${treatment.ae_case_id}`)}
            >
              <i className="fas fa-file-medical me-2"></i>
              View Case
            </button>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/ae-module/add-treatment/${treatment.ae_case_id}`)}
            >
              <i className="fas fa-plus me-2"></i>
              Add Another Treatment
            </button>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ViewTreatment;
