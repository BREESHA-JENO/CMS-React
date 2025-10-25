import React, { useState, useEffect } from 'react';
import { getAllLabTests } from '../../Service/doctor_api';
import 'bootstrap/dist/css/bootstrap.min.css';

const LabTestForm = ({ consultation, staffId, onSubmit, onClose }) => {
  const [labTestsList, setLabTestsList] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    consultation_id: consultation?.consultation_auto_id || '',
    appointment_id: consultation?.appointment_id?.id || '',
    staff_id: staffId || '',
    lab_tests: [
      { lab_test: '', instructions: '' }
    ]
  });

  useEffect(() => {
    getAllLabTests()
      .then(res => setLabTestsList(res.data))
      .catch(() => setLabTestsList([]));
  }, []);

  useEffect(() => {
    if (consultation) {
      setFormData(prev => ({
        ...prev,
        consultation_id: consultation.consultation_auto_id,
        appointment_id: consultation.appointment_id?.appointment_auto_id || consultation.appointment_id
      }));
    }
  }, [consultation]);

  const handleChange = (e, index) => {
    if (e.target.name === 'consultation_id' || e.target.name === 'staff_id') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    } else {
      const newTests = [...formData.lab_tests];
      newTests[index] = {
        ...newTests[index],
        [e.target.name]: e.target.value
      };
      setFormData({
        ...formData,
        lab_tests: newTests
      });
    }
  };

  const addTest = () => {
    setFormData({
      ...formData,
      lab_tests: [...formData.lab_tests, { lab_test: '', instructions: '' }]
    });
  };

  const removeTest = (index) => {
    const newTests = formData.lab_tests.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      lab_tests: newTests
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation for duplicate lab tests
    const labTestIds = formData.lab_tests.map(test => test.lab_test).filter(id => id);
    const uniqueLabTestIds = new Set(labTestIds);
    if (labTestIds.length !== uniqueLabTestIds.size) {
      setError('Duplicate lab tests are not allowed. Please remove duplicate entries.');
      return;
    }
    
    // Check for empty lab test selections
    const hasEmptyLabTest = formData.lab_tests.some(test => !test.lab_test);
    if (hasEmptyLabTest) {
      setError('Please select a lab test for all entries.');
      return;
    }
    
    const submissionData = {
      consultation_id: formData.consultation_id,
      details: formData.lab_tests.map(test => ({
        lab_test: test.lab_test,
        instructions: test.instructions
      }))
    };
    // Don't send staff_id or appointment_id as they're auto-assigned by backend
    try {
      await onSubmit(submissionData);
    } catch (err) {
      // Use user-friendly error message if available
      const errorMessage = err.userFriendlyMessage || err.response?.data?.error || err.message || 'Failed to save lab test prescription. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Prescribe Lab Tests</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (<div className="alert alert-danger">{error}</div>)}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Consultation ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="consultation_id"
                  value={formData.consultation_id}
                  readOnly
                  disabled
                />
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
              {formData.lab_tests.map((test, index) => (
                <div key={index} className="border p-3 mb-3">
                  <h6>Lab Test {index + 1}</h6>
                  <div className="mb-3">
                    <label className="form-label">Lab Test</label>
                    <select
                      className="form-control"
                      name="lab_test"
                      value={test.lab_test}
                      onChange={(e) => handleChange(e, index)}
                      required
                    >
                      <option value="">Select lab test</option>
                      {labTestsList.map(lab => (
                        <option key={lab.Id} value={lab.Id}>
                          {lab.test_name} ({lab.test_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Instructions</label>
                    <textarea
                      className="form-control"
                      name="instructions"
                      value={test.instructions}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  {formData.lab_tests.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeTest(index)}
                    >
                      Remove Test
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={addTest}
              >
                Add Another Test
              </button>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Lab Tests
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestForm;