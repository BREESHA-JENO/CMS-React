import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAECase, updateAECase } from '../../../Service/ae_api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateAECase.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const UpdateAECase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [formData, setFormData] = useState({
    chief_complaint: '',
    triage_category: '',
    vital_signs: '',
    notes: '',
    case_status: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadCaseData();
  }, [id]);

  const loadCaseData = async () => {
    setDataLoading(true);
    try {
      const [caseRes, doctorsRes] = await Promise.all([
        getAECase(id),
        api.get('/admin/staff/?role=Doctor')
      ]);

      const caseData = caseRes.data;
      setFormData({
        chief_complaint: caseData.chief_complaint || '',
        triage_category: caseData.triage_category || '',
        vital_signs: caseData.vital_signs || '',
        notes: caseData.notes || '',
        case_status: caseData.case_status || '',
        referring_doctor_id: caseData.referring_doctor_id || ''
      });

      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrors({ general: 'Failed to load case data. Please refresh.' });
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.chief_complaint.trim()) {
      setErrors({ chief_complaint: 'Chief complaint is required' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await updateAECase(id, formData);

      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate(`/ae-module/view-ae-case/${id}`);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update case. Please try again.' });
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
      <div className={`update-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="update-ae-case-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading case data...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`update-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="update-ae-case-container">
        <div className="update-ae-case-content">
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
              onClick={() => navigate(`/ae-module/view-ae-case/${id}`)}
            >
              <span>View Case</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Update Case</span>
          </div>

          <div className="form-header">
            <h1>
              <i className="fas fa-edit me-3"></i>
              Update A&E Case
            </h1>
            <p>Update case details and status</p>
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

                {/* Case Status */}
                <div className="form-group">
                  <label className="form-label">
                    Case Status <span className="required">*</span>
                  </label>
                  <select
                    name="case_status"
                    className={`form-control ${errors.case_status ? 'error' : ''}`}
                    value={formData.case_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                  {errors.case_status && <span className="error-text">{errors.case_status}</span>}
                </div>

                {/* Triage Category */}
                <div className="form-group">
                  <label className="form-label">
                    Triage Category
                  </label>
                  <select
                    name="triage_category"
                    className="form-control"
                    value={formData.triage_category}
                    onChange={handleChange}
                  >
                    <option value="">Select Triage</option>
                    <option value="Red">Red - Immediate</option>
                    <option value="Orange">Orange - Very Urgent</option>
                    <option value="Yellow">Yellow - Urgent</option>
                    <option value="Green">Green - Standard</option>
                    <option value="Blue">Blue - Non-Urgent</option>
                  </select>
                </div>

                {/* Referring Doctor */}
                <div className="form-group">
                  <label className="form-label">
                    Referring Doctor
                  </label>
                  <select
                    name="referring_doctor_id"
                    className="form-control"
                    value={formData.referring_doctor_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.staff_id} value={doc.staff_id}>
                        Dr. {doc.first_name} {doc.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chief Complaint - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Chief Complaint <span className="required">*</span>
                  </label>
                  <textarea
                    name="chief_complaint"
                    className={`form-control ${errors.chief_complaint ? 'error' : ''}`}
                    value={formData.chief_complaint}
                    onChange={handleChange}
                    placeholder="Primary reason for visit"
                    rows="3"
                    required
                  />
                  {errors.chief_complaint && <span className="error-text">{errors.chief_complaint}</span>}
                </div>

                {/* Vital Signs - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Vital Signs
                  </label>
                  <textarea
                    name="vital_signs"
                    className="form-control"
                    value={formData.vital_signs}
                    onChange={handleChange}
                    placeholder="BP, HR, Temperature, SpO2, Respiratory Rate"
                    rows="2"
                  />
                  <small className="form-text">
                    Example: BP: 120/80, HR: 75 bpm, Temp: 98.6°F, SpO2: 98%, RR: 16/min
                  </small>
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
                    placeholder="Any additional observations, updates, or case notes"
                    rows="4"
                  />
                </div>

              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/ae-module/view-ae-case/${id}`)}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Case
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="info-card">
            <div className="info-header">
              <i className="fas fa-info-circle"></i>
              <h4>Update Guidelines</h4>
            </div>
            <ul>
              <li>Update case status as treatment progresses</li>
              <li>Record vital signs regularly for monitoring</li>
              <li>Update triage category if condition changes</li>
              <li>Add detailed notes about treatment and observations</li>
              <li>Assign or update referring doctor if needed</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default UpdateAECase;
