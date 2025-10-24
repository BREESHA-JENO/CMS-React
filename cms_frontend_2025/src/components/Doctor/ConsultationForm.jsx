import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConsultationForm = ({ appointment, staffId, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    appointment_id: appointment?.appointment_auto_id || '',
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
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed.');
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
                <label className="form-label">Symptoms</label>
                <textarea
                  className="form-control"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Diagnosis</label>
                <textarea
                  className="form-control"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
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