import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddAECase.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const AddAECase = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [formData, setFormData] = useState({
    patient_type: '',
    patient: '',
    temp_patient: '',
    triage_level: '',
    brought_by: '',
    ambulance: '',
    notes: ''
  });

  const [patients, setPatients] = useState([]);
  const [tempPatients, setTempPatients] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Load dropdown data
  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    setDataLoading(true);
    
    try {
      const patientPromises = [];
      
      // ✅ CORRECTED: Load permanent patients from receptionist API
      patientPromises.push(
        api.get('/receptionist/patients/')
          .then(res => {
            console.log('✅ Loaded patients:', res.data.length);
            setPatients(res.data || []);
          })
          .catch(err => {
            console.warn('⚠️ Cannot load patients:', err.response?.status);
            setPatients([]);
          })
      );

      // ✅ CORRECTED: Load temporary patients from A&E API
      patientPromises.push(
        api.get('/ae/temp-patient/')
          .then(res => {
            console.log('✅ Loaded temp patients:', res.data.length);
            setTempPatients(res.data || []);
          })
          .catch(err => {
            console.warn('⚠️ Cannot load temp patients:', err.response?.status);
            setTempPatients([]);
          })
      );

      // ✅ CORRECTED: Load doctors from receptionist public endpoint
      patientPromises.push(
        api.get('/receptionist/doctors-list/')
          .then(res => {
            console.log('✅ Loaded doctors:', res.data.length);
            setDoctors(res.data || []);
          })
          .catch(err => {
            console.warn('⚠️ Cannot load doctors:', err.response?.status);
            setDoctors([]);
          })
      );

      // ✅ Ambulances - skip for now (endpoint doesn't exist yet)
      console.warn('⚠️ Ambulance module not implemented yet');
      setAmbulances([]);

      // Wait for all requests to complete
      await Promise.all(patientPromises);

    } catch (error) {
      console.error('❌ Error loading dropdown data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear patient IDs when switching type
    if (name === 'patient_type') {
      setFormData({
        ...formData,
        patient_type: value,
        patient: '',
        temp_patient: ''
      });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    
    if (!formData.patient_type) {
      newErrors.patient_type = 'Patient type is required';
    }
    
    if (formData.patient_type === 'Permanent' && !formData.patient) {
      newErrors.patient = 'Please select a patient';
    }
    
    if (formData.patient_type === 'Temporary' && !formData.temp_patient) {
      newErrors.temp_patient = 'Please select a temporary patient';
    }
    
    if (!formData.triage_level) {
      newErrors.triage_level = 'Triage level is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await api.post('/ae/case/create/', formData);

      setSuccessMessage(response.data.message || 'A&E Case registered successfully!');
      
      // Reset form
      setFormData({
        patient_type: '',
        patient: '',
        temp_patient: '',
        triage_level: '',
        brought_by: '',
        ambulance: '',
        notes: ''
      });

      setTimeout(() => {
        navigate('/ae-module/list-ae-cases');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to register case. Please try again.' });
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

  if (dataLoading) {
    return (
      <div className={`add-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="add-ae-case-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading form data...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`add-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="add-ae-case-container">
        <div className="add-ae-case-content">
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
            <span className="breadcrumb-current">Register Case</span>
          </div>

          <div className="form-header">
            <h1>
              <i className="fas fa-ambulance me-3"></i>
              Register A&E Case
            </h1>
            <p>Register new accident & emergency case</p>
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
                
                {/* Patient Type */}
                <div className="form-group">
                  <label className="form-label">
                    Patient Type <span className="required">*</span>
                  </label>
                  <select
                    name="patient_type"
                    className={`form-control ${errors.patient_type ? 'error' : ''}`}
                    value={formData.patient_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Patient Type</option>
                    <option value="Permanent">Permanent Patient</option>
                    <option value="Temporary">Temporary Patient (Unknown)</option>
                  </select>
                  {errors.patient_type && <span className="error-text">{errors.patient_type}</span>}
                </div>

                {/* Permanent Patient Select */}
                {formData.patient_type === 'Permanent' && (
                  <div className="form-group">
                    <label className="form-label">
                      Select Patient <span className="required">*</span>
                    </label>
                    <select
                      name="patient"
                      className={`form-control ${errors.patient ? 'error' : ''}`}
                      value={formData.patient}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.length > 0 ? (
                        patients.map((patient) => (
                          <option key={patient.patient_auto_id} value={patient.patient_auto_id}>
                            {patient.patient_id} - {patient.patient_name} - {patient.patient_phone}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No patients available</option>
                      )}
                    </select>
                    {errors.patient && <span className="error-text">{errors.patient}</span>}
                  </div>
                )}

                {/* Temporary Patient Select */}
                {formData.patient_type === 'Temporary' && (
                  <div className="form-group">
                    <label className="form-label">
                      Select Temp Patient <span className="required">*</span>
                    </label>
                    <select
                      name="temp_patient"
                      className={`form-control ${errors.temp_patient ? 'error' : ''}`}
                      value={formData.temp_patient}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Temporary Patient</option>
                      {tempPatients.length > 0 ? (
                        tempPatients.map((tp) => (
                          <option key={tp.temp_patient_id} value={tp.temp_patient_id}>
                            {tp.temp_patient_code} - {tp.name} - {tp.gender || 'N/A'}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No temp patients available</option>
                      )}
                    </select>
                    {errors.temp_patient && <span className="error-text">{errors.temp_patient}</span>}
                  </div>
                )}

                {/* Triage Level */}
                <div className="form-group">
                  <label className="form-label">
                    Triage Level <span className="required">*</span>
                  </label>
                  <select
                    name="triage_level"
                    className={`form-control ${errors.triage_level ? 'error' : ''}`}
                    value={formData.triage_level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Triage Level</option>
                    <option value="Critical">Critical</option>
                    <option value="Serious">Serious</option>
                    <option value="Stable">Stable</option>
                  </select>
                  {errors.triage_level && <span className="error-text">{errors.triage_level}</span>}
                </div>

                {/* Brought By */}
                <div className="form-group">
                  <label className="form-label">
                    Brought By
                  </label>
                  <input
                    type="text"
                    name="brought_by"
                    className="form-control"
                    value={formData.brought_by}
                    onChange={handleChange}
                    placeholder="e.g., Family, Police, Ambulance"
                  />
                </div>

                {/* Ambulance */}
                <div className="form-group">
                  <label className="form-label">
                    Ambulance
                  </label>
                  <select
                    name="ambulance"
                    className="form-control"
                    value={formData.ambulance}
                    onChange={handleChange}
                    disabled={ambulances.length === 0}
                  >
                    <option value="">
                      {ambulances.length === 0 
                        ? 'No ambulances available' 
                        : 'Select Ambulance (if applicable)'}
                    </option>
                    {ambulances.map((amb) => (
                      <option key={amb.ambulance_id} value={amb.ambulance_id}>
                        {amb.vehicle_no} - {amb.driver_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    className="form-control"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional observations or notes"
                    rows="4"
                  />
                </div>

              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/ae-module/ae-case-menu')}
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
                      Register Case
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

export default AddAECase;
