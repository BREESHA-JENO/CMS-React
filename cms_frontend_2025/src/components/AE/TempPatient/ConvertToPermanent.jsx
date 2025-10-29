import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ConvertToPermanent.css';
import { getTempPatient, convertToPermanent } from '../../../Service/ae_api';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ConvertToPermanent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [tempPatient, setTempPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    patient_email: '',
    patient_phone: '',
    patient_blood_group: '',
    patient_address: ''
  });

  // Fetch temp patient data
  useEffect(() => {
    fetchTempPatient();
  }, [id]);

  const fetchTempPatient = async () => {
    try {
      const response = await getTempPatient(id);
      const patient = response.data;
      setTempPatient(patient);

      // Pre-fill form with temp patient data
      setFormData({
        patient_name: patient.name !== 'Unknown' ? patient.name : '',
        patient_age: patient.approx_age || '',
        patient_gender: patient.gender || '',
        patient_email: '',
        patient_phone: patient.emergency_contact || '',
        patient_blood_group: '',
        patient_address: ''
      });

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
    if (!phone) return 'Phone number is required';
    if (!/^\d+$/.test(phone)) return 'Must contain only digits';
    if (phone.length !== 10) return 'Must be exactly 10 digits';
    return '';
  };

  // Validate email
  const validateEmail = (email) => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  // Handle phone blur
  const handlePhoneBlur = () => {
    const phoneError = validatePhone(formData.patient_phone);
    if (phoneError) {
      setErrors({ ...errors, patient_phone: phoneError });
    }
  };

  // Handle email blur
  const handleEmailBlur = () => {
    const emailError = validateEmail(formData.patient_email);
    if (emailError) {
      setErrors({ ...errors, patient_email: emailError });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }
    if (!formData.patient_age) {
      newErrors.patient_age = 'Age is required';
    }
    if (!formData.patient_gender) {
      newErrors.patient_gender = 'Gender is required';
    }

    const phoneError = validatePhone(formData.patient_phone);
    if (phoneError) {
      newErrors.patient_phone = phoneError;
    }

    const emailError = validateEmail(formData.patient_email);
    if (emailError) {
      newErrors.patient_email = emailError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setConverting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await convertToPermanent(id, formData);
      setSuccessMessage(response.data.message);

      // Show success for 3 seconds then redirect
      setTimeout(() => {
        navigate('/manage-patients');
      }, 3000);

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
        setErrors({ general: 'Conversion failed. Please try again.' });
      }
    } finally {
      setConverting(false);
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
      <div className={`convert-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="convert-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading patient data...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  if (tempPatient?.status !== 'Active') {
    return (
      <div className={`convert-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="convert-container">
          <div className="error-state">
            <i className="fas fa-ban"></i>
            <h3>Cannot Convert</h3>
            <p>This patient has already been {tempPatient?.status.toLowerCase()} and cannot be converted.</p>
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
    <div className={`convert-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="convert-container">
        <div className="convert-content">
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
              onClick={() => navigate(`/ae-module/view-temp-patient/${id}`)}
            >
              <span>View Patient</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Convert to Permanent</span>
          </div>

          {/* Header */}
          <div className="form-header">
            <div className="header-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div>
              <h1>Convert to Permanent Patient</h1>
              <p>Transform temporary patient <strong>{tempPatient.temp_patient_code}</strong> into permanent record</p>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            <div>
              <strong>What happens during conversion:</strong>
              <ul>
                <li>A new permanent patient record will be created</li>
                <li>All linked A&E cases will be transferred to the new patient</li>
                <li>The temporary patient will be marked as "Merged"</li>
                <li>This action cannot be undone</li>
              </ul>
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

          {/* Temp Patient Info Card */}
          <div className="temp-patient-card">
            <h3>Current Temporary Patient Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Patient Code</label>
                <span>{tempPatient.temp_patient_code}</span>
              </div>
              <div className="info-item">
                <label>Name</label>
                <span>{tempPatient.name}</span>
              </div>
              <div className="info-item">
                <label>Age</label>
                <span>{tempPatient.approx_age || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <span>{tempPatient.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Conversion Form */}
          <div className="form-card">
            <h3>Enter Complete Patient Information</h3>
            <p className="form-subtitle">Provide accurate details for the permanent patient record</p>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                {/* Patient Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    className={`form-control ${errors.patient_name ? 'error' : ''}`}
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                  {errors.patient_name && <span className="error-text">{errors.patient_name}</span>}
                </div>

                {/* Age */}
                <div className="form-group">
                  <label className="form-label">
                    Age <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="patient_age"
                    className={`form-control ${errors.patient_age ? 'error' : ''}`}
                    value={formData.patient_age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="0"
                    max="150"
                    required
                  />
                  {errors.patient_age && <span className="error-text">{errors.patient_age}</span>}
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">
                    Gender <span className="required">*</span>
                  </label>
                  <select
                    name="patient_gender"
                    className={`form-control ${errors.patient_gender ? 'error' : ''}`}
                    value={formData.patient_gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.patient_gender && <span className="error-text">{errors.patient_gender}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="patient_phone"
                    className={`form-control ${errors.patient_phone ? 'error' : ''}`}
                    value={formData.patient_phone}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    required
                  />
                  {errors.patient_phone && <span className="error-text">{errors.patient_phone}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="patient_email"
                    className={`form-control ${errors.patient_email ? 'error' : ''}`}
                    value={formData.patient_email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    placeholder="email@example.com"
                  />
                  {errors.patient_email && <span className="error-text">{errors.patient_email}</span>}
                </div>

                {/* Blood Group */}
                <div className="form-group">
                  <label className="form-label">
                    Blood Group
                  </label>
                  <select
                    name="patient_blood_group"
                    className="form-control"
                    value={formData.patient_blood_group}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Address - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Address
                  </label>
                  <textarea
                    name="patient_address"
                    className="form-control"
                    value={formData.patient_address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/ae-module/list-temp-patients/${id}`)}
                  disabled={converting}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={converting}
                >
                  {converting ? (
                    <>
                      <span className="spinner-small"></span>
                      Converting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-2"></i>
                      Convert to Permanent Patient
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

export default ConvertToPermanent;
