import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddTempPatient.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const AddTempPatient = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [formData, setFormData] = useState({
    name: 'Unknown',
    approx_age: '',
    gender: '',
    description: '',
    identification_marks: '',
    emergency_contact: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.emergency_contact) {
      const phoneError = validatePhone(formData.emergency_contact);
      if (phoneError) {
        setErrors({ emergency_contact: phoneError });
        return;
      }
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await api.post('/ae/temp-patient/create/', formData);

      setSuccessMessage(response.data.message);
      
      setFormData({
        name: 'Unknown',
        approx_age: '',
        gender: '',
        description: '',
        identification_marks: '',
        emergency_contact: ''
      });

      setTimeout(() => {
        navigate('/ae-module/list-temp-patients');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to register patient. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`add-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="add-temp-patient-container">
        <div className="add-temp-patient-content">
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
            <span className="breadcrumb-current">Add Temp Patient</span>
          </div>

          <div className="form-header">
            <h1>
              <i className="fas fa-user-plus me-3"></i>
              Register Temporary Patient
            </h1>
            <p>Quick registration for unknown/unconscious emergency patients</p>
          </div>

          {successMessage && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.general}
            </div>
          )}

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                <div className="form-group">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Unknown (default)"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                  <small className="form-text">Leave as "Unknown" if identity is not confirmed</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Approximate Age</label>
                  <input
                    type="number"
                    name="approx_age"
                    className={`form-control ${errors.approx_age ? 'error' : ''}`}
                    value={formData.approx_age}
                    onChange={handleChange}
                    placeholder="Estimated age"
                    min="0"
                    max="150"
                  />
                  {errors.approx_age && <span className="error-text">{errors.approx_age}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className={`form-control ${errors.gender ? 'error' : ''}`}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    className={`form-control ${errors.emergency_contact ? 'error' : ''}`}
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    placeholder="Phone number (10-15 digits)"
                    maxLength="15"
                  />
                  {errors.emergency_contact && (
                    <span className="error-text">{errors.emergency_contact}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Patient Description</label>
                  <textarea
                    name="description"
                    className={`form-control ${errors.description ? 'error' : ''}`}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of patient condition, how found, etc."
                    rows="3"
                  />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Identification Marks</label>
                  <textarea
                    name="identification_marks"
                    className={`form-control ${errors.identification_marks ? 'error' : ''}`}
                    value={formData.identification_marks}
                    onChange={handleChange}
                    placeholder="Any visible marks, scars, tattoos, birthmarks, etc."
                    rows="2"
                  />
                  {errors.identification_marks && (
                    <span className="error-text">{errors.identification_marks}</span>
                  )}
                </div>

              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/ae-module/temp-patient-menu')}
                  disabled={loading}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Registering...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Register Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default AddTempPatient;
