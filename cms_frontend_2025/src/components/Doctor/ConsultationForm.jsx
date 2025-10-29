import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConsultationForm = ({ appointment, staffId, onSubmit, onClose }) => {
  // Debug: Log appointment data to see what fields are available
  console.log('ConsultationForm - Appointment data:', appointment);
  console.log('ConsultationForm - Staff ID:', staffId);
  
  // Debug appointment ID extraction
  const appointmentId = appointment?._appointmentAutoId || appointment?.appointment_auto_id || appointment?.id || '';
  console.log('ConsultationForm - Extracted appointment ID:', appointmentId);
  console.log('ConsultationForm - Available ID fields:', {
    _appointmentAutoId: appointment?._appointmentAutoId,
    appointment_auto_id: appointment?.appointment_auto_id,
    id: appointment?.id
  });

  const [formData, setFormData] = useState({
    appointment_id: appointmentId,
    staff_id: staffId || '',
    symptoms: '',
    diagnosis: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate appointment ID
    if (!formData.appointment_id) {
      setError('Invalid appointment data. Please try again.');
      console.error('ConsultationForm - Missing appointment ID:', formData);
      return;
    }
    
    // Validate symptoms (must be at least 3 characters)
    if (!formData.symptoms || formData.symptoms.trim().length < 3) {
      setError('Please provide a brief description of symptoms (at least 3 characters).');
      return;
    }
    
    // Validate that either diagnosis or notes is provided
    if ((!formData.diagnosis || formData.diagnosis.trim() === '') && 
        (!formData.notes || formData.notes.trim() === '')) {
      setError('Please provide either a diagnosis or notes for the consultation.');
      return;
    }
    
    try {
      // Remove staff_id from submission as it's auto-assigned by backend
      const { staff_id, ...submissionData } = formData;
      console.log('ConsultationForm - Submitting data:', submissionData);
      await onSubmit(submissionData);
    } catch (err) {
      console.error('ConsultationForm - Submission error:', err);
      // Use user-friendly error message if available
      const errorMessage = err.userFriendlyMessage || err.response?.data?.error || err.message || 'Failed to save consultation. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Consult Patient</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (<div className="alert alert-danger">{error}</div>)}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Appointment</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${appointment?.appointment_id} - ${appointment?.patient_id?.patient_name || 'Unknown Patient'} (${appointment?.appoinment_date})`}
                  readOnly
                  disabled
                />
                <input type="hidden" name="appointment_id" value={formData.appointment_id} />
              </div>
              <div className="mb-3">
                <label className="form-label">Staff ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="staff_id"
                  value={formData.staff_id}
                  readOnly
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Symptoms <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Describe patient's symptoms (minimum 3 characters)"
                  required
                  minLength="3"
                />
                <small className="form-text text-muted">Required: Minimum 3 characters</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Diagnosis</label>
                <textarea
                  className="form-control"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Medical diagnosis (either diagnosis or notes required)"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional consultation notes (either diagnosis or notes required)"
                />
                <small className="form-text text-muted">Either diagnosis or notes must be provided</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;