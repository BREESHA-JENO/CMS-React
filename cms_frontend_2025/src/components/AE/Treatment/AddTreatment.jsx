import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddTreatment.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const AddTreatment = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [formData, setFormData] = useState({
    treatment_type: '',
    treatment_details: '',
    medication_name: '',
    dosage: '',
    administered_by: '',
    notes: ''
  });

  const [caseInfo, setCaseInfo] = useState(null);
  const [staff, setStaff] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [caseId]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [caseRes, staffRes] = await Promise.all([
        api.get(`/ae/case/${caseId}/`),
        api.get('/admin/staff/')
      ]);

      setCaseInfo(caseRes.data);
      setStaff(staffRes.data);
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

    const newErrors = {};
    
    if (!formData.treatment_type) {
      newErrors.treatment_type = 'Treatment type is required';
    }
    
    if (!formData.treatment_details.trim()) {
      newErrors.treatment_details = 'Treatment details are required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const payload = {
        ...formData,
        ae_case: caseId
      };

      const response = await api.post('/ae/treatment/create/', payload);

      setSuccessMessage(response.data.message);
      
      // Reset form
      setFormData({
        treatment_type: '',
        treatment_details: '',
        medication_name: '',
        dosage: '',
        administered_by: '',
        notes: ''
      });

      setTimeout(() => {
        navigate(`/ae-module/case-treatments/${caseId}`);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to record treatment. Please try again.' });
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
      <div className={`add-treatment-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="add-treatment-container">
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
    <div className={`add-treatment-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="add-treatment-container">
        <div className="add-treatment-content">
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
            <span className="breadcrumb-current">Add Treatment</span>
          </div>

          {/* Case Info Card */}
          {caseInfo && (
            <div className="case-info-card">
              <div className="case-info-header">
                <i className="fas fa-info-circle"></i>
                <h3>Case Information</h3>
              </div>
              <div className="case-info-body">
                <div className="info-row">
                  <span className="label">Case Code:</span>
                  <span className="value">{caseInfo.case_code}</span>
                </div>
                <div className="info-row">
                  <span className="label">Patient:</span>
                  <span className="value">{caseInfo.patient_name || 'Unknown'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value badge badge-danger">{caseInfo.case_status}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-header">
            <h1>
              <i className="fas fa-pills me-3"></i>
              Record Treatment
            </h1>
            <p>Add treatment details for this A&E case</p>
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
                
                {/* Treatment Type */}
                <div className="form-group">
                  <label className="form-label">
                    Treatment Type <span className="required">*</span>
                  </label>
                  <select
                    name="treatment_type"
                    className={`form-control ${errors.treatment_type ? 'error' : ''}`}
                    value={formData.treatment_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Medication">Medication</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Observation">Observation</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Diagnostic">Diagnostic Test</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.treatment_type && <span className="error-text">{errors.treatment_type}</span>}
                </div>

                {/* Administered By */}
                <div className="form-group">
                  <label className="form-label">
                    Administered By
                  </label>
                  <select
                    name="administered_by"
                    className="form-control"
                    value={formData.administered_by}
                    onChange={handleChange}
                  >
                    <option value="">Select Staff</option>
                    {staff.map((person) => (
                      <option key={person.staff_id} value={person.staff_id}>
                        {person.first_name} {person.last_name} - {person.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medication Name (if applicable) */}
                {formData.treatment_type === 'Medication' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        Medication Name
                      </label>
                      <input
                        type="text"
                        name="medication_name"
                        className="form-control"
                        value={formData.medication_name}
                        onChange={handleChange}
                        placeholder="e.g., Paracetamol, Morphine"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Dosage
                      </label>
                      <input
                        type="text"
                        name="dosage"
                        className="form-control"
                        value={formData.dosage}
                        onChange={handleChange}
                        placeholder="e.g., 500mg, 10ml"
                      />
                    </div>
                  </>
                )}

                {/* Treatment Details - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Treatment Details <span className="required">*</span>
                  </label>
                  <textarea
                    name="treatment_details"
                    className={`form-control ${errors.treatment_details ? 'error' : ''}`}
                    value={formData.treatment_details}
                    onChange={handleChange}
                    placeholder="Detailed description of treatment given, procedures performed, or observations made"
                    rows="4"
                    required
                  />
                  {errors.treatment_details && <span className="error-text">{errors.treatment_details}</span>}
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
                    placeholder="Any additional notes about the treatment, patient response, or follow-up required"
                    rows="3"
                  />
                </div>

              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/ae-module/view-ae-case/${caseId}`)}
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
                      Recording...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Record Treatment
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

export default AddTreatment;
