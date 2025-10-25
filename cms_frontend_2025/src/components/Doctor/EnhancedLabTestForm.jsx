import React, { useState, useEffect } from 'react';
import { FaVial, FaSearch, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { getAllLabTests } from '../../Service/doctor_api';

const EnhancedLabTestForm = ({ consultation, staffId, onSubmit, onClose }) => {
  console.log('EnhancedLabTestForm rendered with:', { consultation, staffId });
  
  const [labTests, setLabTests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    consultation_id: consultation?.consultation_id || '',
    staff_id: staffId || '',
    lab_tests: [{ 
      lab_test: '', 
      customLabTest: '',
      isCustom: false,
      instructions: '',
      searchTerm: ''
    }]
  });

  // Load lab tests from API
  useEffect(() => {
    const loadLabTests = async () => {
      try {
        console.log('Loading lab tests for enhanced form...');
        const response = await getAllLabTests();
        console.log('Lab tests loaded:', response.data);
        setLabTests(response.data || []);
      } catch (err) {
        console.error('Error loading lab tests:', err);
        setError('Failed to load lab tests data. Please try again.');
      }
    };

    loadLabTests();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTests = [...formData.lab_tests];
    
    if (name === 'lab_test') {
      if (value === 'other') {
        updatedTests[index] = {
          ...updatedTests[index],
          lab_test: '',
          isCustom: true,
          customLabTest: '',
          searchTerm: ''
        };
      } else {
        updatedTests[index] = {
          ...updatedTests[index],
          lab_test: value,
          isCustom: false,
          customLabTest: '',
          searchTerm: ''
        };
      }
    } else if (name === 'searchTerm') {
      updatedTests[index] = {
        ...updatedTests[index],
        searchTerm: value
      };
    } else {
      updatedTests[index] = {
        ...updatedTests[index],
        [name]: value
      };
    }
    
    setFormData({ ...formData, lab_tests: updatedTests });
  };

  const addLabTest = () => {
    setFormData({
      ...formData,
      lab_tests: [...formData.lab_tests, { 
        lab_test: '', 
        customLabTest: '',
        isCustom: false,
        instructions: '',
        searchTerm: ''
      }]
    });
  };

  const removeLabTest = (index) => {
    if (formData.lab_tests.length > 1) {
      const updatedTests = formData.lab_tests.filter((_, i) => i !== index);
      setFormData({ ...formData, lab_tests: updatedTests });
    }
  };

  // Filter lab tests based on search term
  const getFilteredLabTests = (searchTerm) => {
    if (!searchTerm) return labTests;
    return labTests.filter(test => 
      test.LabTestName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation for duplicate lab tests
    const labTestIds = formData.lab_tests
      .map(test => test.isCustom ? test.customLabTest : test.lab_test)
      .filter(id => id);
    const uniqueLabTestIds = new Set(labTestIds);
    if (labTestIds.length !== uniqueLabTestIds.size) {
      setError('Duplicate lab tests are not allowed. Please remove duplicate entries.');
      return;
    }

    // Check for empty lab test selections
    const hasEmptyLabTest = formData.lab_tests.some(test => 
      (!test.isCustom && !test.lab_test) || (test.isCustom && !test.customLabTest)
    );
    if (hasEmptyLabTest) {
      setError('Please select or enter a lab test for all entries.');
      return;
    }
    
    try {
      // Transform the data for submission
      const submissionData = {
        consultation_id: formData.consultation_id,
        details: formData.lab_tests.map(test => ({
          lab_test: test.isCustom ? null : test.lab_test,
          custom_lab_test_name: test.isCustom ? test.customLabTest : null,
          instructions: test.instructions
        }))
      };

      await onSubmit(submissionData);
    } catch (err) {
      // Use user-friendly error message if available
      const errorMessage = err.userFriendlyMessage || err.response?.data?.error || err.message || 'Failed to save lab test prescription. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">
              <FaVial className="me-2" />
              Enhanced Lab Test Prescription
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Patient Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Patient Information</h6>
                      <p><strong>Patient:</strong> {consultation?.appointment_id?.patient_id?.patient_name || 'Unknown'}</p>
                      <p><strong>Consultation ID:</strong> {consultation?.consultation_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Test Details */}
              {formData.lab_tests.map((test, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaVial className="me-2" />
                      Lab Test {index + 1}
                    </h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeLabTest(index)}
                      disabled={formData.lab_tests.length === 1}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {/* Lab Test Selection */}
                      <div className="col-md-8 mb-3">
                        <label className="form-label fw-bold">Lab Test Selection</label>
                        
                        {!test.isCustom ? (
                          <>
                            {/* Search Box */}
                            <div className="input-group mb-2">
                              <span className="input-group-text">
                                <FaSearch />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search lab tests..."
                                name="searchTerm"
                                value={test.searchTerm}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div>

                            {/* Lab Test Dropdown */}
                            <select
                              className="form-select"
                              name="lab_test"
                              value={test.lab_test}
                              onChange={(e) => handleChange(e, index)}
                              required={!test.isCustom}
                            >
                              <option value="">Select Lab Test</option>
                              {getFilteredLabTests(test.searchTerm).map((lab) => (
                                <option key={lab.LabTestId} value={lab.LabTestId}>
                                  {lab.LabTestName} - ₹{lab.Rate}
                                </option>
                              ))}
                              <option value="other" style={{backgroundColor: '#e3f2fd', fontWeight: 'bold'}}>
                                ➕ Other (Enter Custom Lab Test)
                              </option>
                            </select>
                          </>
                        ) : (
                          <>
                            {/* Custom Lab Test Input */}
                            <div className="alert alert-info">
                              <small>
                                <strong>Custom Lab Test:</strong> Enter test not in database
                              </small>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter custom lab test name..."
                              name="customLabTest"
                              value={test.customLabTest}
                              onChange={(e) => handleChange(e, index)}
                              required={test.isCustom}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary mt-2"
                              onClick={() => handleChange({target: {name: 'lab_test', value: ''}}, index)}
                            >
                              <FaTimes className="me-1" />
                              Back to Lab Test List
                            </button>
                          </>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Instructions</label>
                        <textarea
                          className="form-control"
                          placeholder="e.g., Fasting required, Morning sample, No water 2hrs before"
                          name="instructions"
                          value={test.instructions}
                          onChange={(e) => handleChange(e, index)}
                          rows="4"
                        />
                        <small className="text-muted">
                          Special instructions for the patient
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Lab Test Button */}
              <div className="text-center mb-3">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={addLabTest}
                >
                  <FaPlus className="me-2" />
                  Add Another Lab Test
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-info" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Prescription...
                  </>
                ) : (
                  <>
                    <FaVial className="me-2" />
                    Create Lab Test Prescription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLabTestForm;
