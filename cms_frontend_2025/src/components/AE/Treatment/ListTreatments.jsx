import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListTreatments.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ListTreatments = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [caseInfo, setCaseInfo] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [caseId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [caseRes, treatmentsRes] = await Promise.all([
        api.get(`/ae/case/${caseId}/`),
        api.get(`/ae/treatment/case/${caseId}/`)
      ]);

      setCaseInfo(caseRes.data);
      setTreatments(treatmentsRes.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load treatments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
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
      <div className={`list-treatments-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="list-treatments-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading treatments...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`list-treatments-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="list-treatments-container">
        <div className="list-treatments-content">
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
              onClick={() => navigate(`/ae-module/view-ae-case/${caseId}`)}
            >
              <span>View Case</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Treatment History</span>
          </div>

          {/* Case Info Header */}
          {caseInfo && (
            <div className="case-header-card">
              <div className="header-left">
                <div className="case-icon">
                  <i className="fas fa-procedures"></i>
                </div>
                <div className="header-info">
                  <h1>Treatment History</h1>
                  <div className="case-details">
                    <span className="case-code">{caseInfo.case_code}</span>
                    <span className="separator">•</span>
                    <span className="patient-name">{caseInfo.patient_name || 'Unknown'}</span>
                    <span className="separator">•</span>
                    <span className={`status-badge badge-${caseInfo.case_status === 'Active' ? 'danger' : 'success'}`}>
                      {caseInfo.case_status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/ae-module/add-treatment/${caseId}`)}
              >
                <i className="fas fa-plus me-2"></i>
                Add Treatment
              </button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {treatments.length > 0 ? (
            <div className="treatments-timeline">
              {treatments.map((treatment, index) => (
                <div key={treatment.treatment_id} className="treatment-card">
                  <div className="timeline-marker" style={{ backgroundColor: getTreatmentColor(treatment.treatment_type) }}>
                    <i className={`fas ${getTreatmentIcon(treatment.treatment_type)}`}></i>
                  </div>
                  
                  <div className="treatment-content">
                    <div className="treatment-header">
                      <div className="header-left-info">
                        <h3>{treatment.treatment_type}</h3>
                        <span className="treatment-time">
                          <i className="fas fa-clock me-2"></i>
                          {formatDateTime(treatment.created_at)}
                        </span>
                      </div>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/ae-module/view-treatment/${treatment.treatment_id}`)}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Details
                      </button>
                    </div>

                    <div className="treatment-body">
                      {treatment.medication_name && (
                        <div className="detail-row">
                          <i className="fas fa-prescription-bottle me-2"></i>
                          <span className="label">Medication:</span>
                          <span className="value">{treatment.medication_name}</span>
                          {treatment.dosage && <span className="dosage">({treatment.dosage})</span>}
                        </div>
                      )}

                      {treatment.administered_by_name && (
                        <div className="detail-row">
                          <i className="fas fa-user-md me-2"></i>
                          <span className="label">Administered by:</span>
                          <span className="value">{treatment.administered_by_name}</span>
                        </div>
                      )}

                      <div className="treatment-details">
                        <p>{treatment.treatment_details}</p>
                      </div>

                      {treatment.notes && (
                        <div className="treatment-notes">
                          <i className="fas fa-sticky-note me-2"></i>
                          <span>{treatment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No Treatments Recorded</h3>
              <p>No treatments have been recorded for this case yet</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/ae-module/add-treatment/${caseId}`)}
              >
                <i className="fas fa-plus me-2"></i>
                Add First Treatment
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ListTreatments;
