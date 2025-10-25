import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateTempPatient.css';
import api from '../../../Utils/axiosConfig';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const UpdateTempPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [formData, setFormData] = useState({
    name: '',
    approx_age: '',
    gender: '',
    description: '',
    identification_marks: '',
    emergency_contact: ''
  });

  const [patientCode, setPatientCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch patient data on mount
  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/ae/temp-patient/${id}/`);
      const patient = response.data;
      
      setFormData({
        name: patient.name,
        approx_age: patient.approx_age || '',
        gender: patient.gender || '',
        description: patient.description || '',
        identification_marks: patient.identification_marks || '',
        emergency_contact: patient.emergency_contact || ''
      });
      
      setPatientCode(patient.temp_patient_code);
      setStatus(patient.status);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Failed to load patient data' });
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate phone
  const validatePhone = (phone) => {
    if (!phone) return '';
    if (!/^\d+$/.test(phone)) {
      return 'Must contain only digits';
    }
    if (phone.length < 10 || phone.length > 15) {
      return 'Must be 10-15 digits';
    }
    return '';
  };

  const handlePhoneBlur = () => {
    const phoneError = validatePhone(formData.emergency_contact);
    if (phoneError) {
      setErrors({ ...errors, emergency_contact: phoneError });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone
    if (formData.emergency_contact) {
      const phoneError = validatePhone(formData.emergency_contact);
      if (phoneError) {
        setErrors({ emergency_contact: phoneError });
        return;
      }
    }

    setUpdating(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await api.put(`/ae/temp-patient/${id}/update/`, formData);
      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate('/ae-module/list-temp-patients');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.status === 401) {
        setErrors({ general: 'Session expired. Please login again.' });
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update patient. Please try again.' });
      }
    } finally {
      setUpdating(false);
    }
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (status) {
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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className={`update-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="update-temp-patient-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading patient data...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`update-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="update-temp-patient-container">
        <div className="update-temp-patient-content">
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
            <span className="breadcrumb-current">Update Patient</span>
          </div>

          {/* Header */}
          <div className="form-header">
            <div className="header-content">
              <h1>
                <i className="fas fa-edit me-3"></i>
                Update Temporary Patient
              </h1>
              <div className="patient-badge-row">
                <span className="patient-code-badge">{patientCode}</span>
                <span className={`status-badge badge-${getStatusColor()}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
            </div>
          )}

          {/* Error Alert */}
          {errors.general && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.general}
            </div>
          )}

          {/* Cannot Update Alert */}
          {status === 'Merged' && (
            <div className="alert alert-warning">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Note:</strong> This patient has been converted to permanent. Updates are not allowed.
            </div>
          )}

          {/* Form Card */}
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">
                    Patient Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    disabled={status === 'Merged'}
                    required
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Approximate Age */}
                <div className="form-group">
                  <label className="form-label">
                    Approximate Age
                  </label>
                  <input
                    type="number"
                    name="approx_age"
                    className={`form-control ${errors.approx_age ? 'error' : ''}`}
                    value={formData.approx_age}
                    onChange={handleChange}
                    placeholder="Estimated age"
                    min="0"
                    max="150"
                    disabled={status === 'Merged'}
                  />
                  {errors.approx_age && <span className="error-text">{errors.approx_age}</span>}
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className={`form-control ${errors.gender ? 'error' : ''}`}
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={status === 'Merged'}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                {/* Emergency Contact */}
                <div className="form-group">
                  <label className="form-label">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    className={`form-control ${errors.emergency_contact ? 'error' : ''}`}
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    placeholder="Phone number (10-15 digits)"
                    maxLength="15"
                    disabled={status === 'Merged'}
                  />
                  {errors.emergency_contact && (
                    <span className="error-text">{errors.emergency_contact}</span>
                  )}
                </div>

                {/* Description - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Patient Description
                  </label>
                  <textarea
                    name="description"
                    className={`form-control ${errors.description ? 'error' : ''}`}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of patient condition"
                    rows="3"
                    disabled={status === 'Merged'}
                  />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                {/* Identification Marks - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Identification Marks
                  </label>
                  <textarea
                    name="identification_marks"
                    className={`form-control ${errors.identification_marks ? 'error' : ''}`}
                    value={formData.identification_marks}
                    onChange={handleChange}
                    placeholder="Any visible marks, scars, tattoos, birthmarks"
                    rows="2"
                    disabled={status === 'Merged'}
                  />
                  {errors.identification_marks && (
                    <span className="error-text">{errors.identification_marks}</span>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/ae-module/list-temp-patients')}
                  disabled={updating}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating || status === 'Merged'}
                >
                  {updating ? (
                    <>
                      <span className="spinner-small"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Convert to Permanent Button */}
          {status === 'Active' && (
            <div className="convert-section">
              <div className="convert-card">
                <div className="convert-info">
                  <i className="fas fa-exchange-alt"></i>
                  <div>
                    <h3>Identity Confirmed?</h3>
                    <p>Convert this temporary patient to a permanent patient record</p>
                  </div>
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/ae-module/convert-to-permanent/${id}`)}
                >
                  <i className="fas fa-user-check me-2"></i>
                  Convert to Permanent
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default UpdateTempPatient;
