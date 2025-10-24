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
    const submissionData = {
      ...formData,
      details: formData.lab_tests.map(test => ({
        lab_test: test.lab_test,
        instructions: test.instructions
      }))
    };
    delete submissionData.lab_tests;
    try {
      await onSubmit(submissionData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed.');
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
                          {lab.LabTestName} ({lab.LabTestId})
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