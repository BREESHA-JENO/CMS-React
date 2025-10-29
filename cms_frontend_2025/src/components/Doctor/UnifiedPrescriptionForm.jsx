import React, { useState, useEffect } from 'react';
import { FaPills, FaVial, FaPlus, FaTrash } from 'react-icons/fa';
import { getAllMedicines, getAllLabTests, createMedicinePrescription, createLabPrescription } from '../../Service/doctor_api';

const UnifiedPrescriptionForm = ({ consultation, appointment, staffId, onSubmit, onClose }) => {
  const [medicines, setMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('medicine');

  // Medicine form data
  const [medicineData, setMedicineData] = useState({
    enabled: false,
    details: [{ 
      medicine: '', 
      customMedicine: '',
      isCustom: false,
      dosage: '', 
      quantity: '', 
      instructions: '',
      searchTerm: ''
    }]
  });

  // Lab test form data
  const [labTestData, setLabTestData] = useState({
    enabled: false,
    lab_tests: [{ 
      lab_test: '', 
      customLabTest: '',
      isCustom: false,
      instructions: '',
      searchTerm: ''
    }]
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Try to load medicines and lab tests from API
        let medicineData = [];
        try {
          console.log('Loading medicines from API...');
          // getAllMedicines returns the data array (not the full response)
          const medicineResponse = await getAllMedicines();
          medicineData = Array.isArray(medicineResponse) ? medicineResponse : [];
          console.log('Medicines loaded:', medicineData.length, 'items');
        } catch (medicineError) {
          console.warn('Failed to load medicines from API:', medicineError);
          // Do not use hardcoded medicines — use empty list and inform the user
          medicineData = [];
          setError(prev => prev ? prev : 'Some prescription lookup data could not be loaded. You can still enter custom medicines/tests.');
        }

        let labTestData = [];
        try {
          console.log('Loading lab tests from API...');
          const labResponse = await getAllLabTests();
          labTestData = Array.isArray(labResponse) ? labResponse : [];
          console.log('Lab tests loaded:', labTestData.length, 'items');
        } catch (labError) {
          console.warn('Failed to load lab tests from API:', labError);
          // Do not use hardcoded lab tests — use empty list and inform the user
          labTestData = [];
          setError(prev => prev ? prev : 'Some prescription lookup data could not be loaded. You can still enter custom medicines/tests.');
        }

        setMedicines(medicineData);
        setLabTests(labTestData);
        
      } catch (err) {
        console.error('Critical error loading prescription data:', err);
        setError('Unable to load prescription data. Please refresh the page and try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Medicine handlers
  const handleMedicineChange = (index, field, value) => {
    const updatedDetails = [...medicineData.details];
    
    if (field === 'medicine') {
      if (value === 'other') {
        updatedDetails[index] = { ...updatedDetails[index], medicine: '', isCustom: true, customMedicine: '', searchTerm: '' };
      } else {
        const selectedMed = medicines.find(m => m.med_auto_id === value);
        updatedDetails[index] = { 
          ...updatedDetails[index], 
          medicine: value, 
          isCustom: false, 
          customMedicine: '',
          searchTerm: selectedMed ? `${selectedMed.name} (${selectedMed.generic_name})` : ''
        };
      }
    } else {
      updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    }
    
    setMedicineData({ ...medicineData, details: updatedDetails });
  };

  const addMedicine = () => {
    setMedicineData({
      ...medicineData,
      details: [...medicineData.details, { 
        medicine: '', customMedicine: '', isCustom: false, dosage: '', quantity: '', instructions: '', searchTerm: ''
      }]
    });
  };

  const removeMedicine = (index) => {
    if (medicineData.details.length > 1) {
      const updatedDetails = medicineData.details.filter((_, i) => i !== index);
      setMedicineData({ ...medicineData, details: updatedDetails });
    }
  };

  // Lab test handlers
  const handleLabTestChange = (index, field, value) => {
    const updatedTests = [...labTestData.lab_tests];
    
    if (field === 'lab_test') {
      if (value === 'other') {
        updatedTests[index] = { ...updatedTests[index], lab_test: '', isCustom: true, customLabTest: '', searchTerm: '' };
      } else {
        const selectedTest = labTests.find(t => t.test_auto_id === value);
        updatedTests[index] = { 
          ...updatedTests[index], 
          lab_test: value, 
          isCustom: false, 
          customLabTest: '',
          searchTerm: selectedTest ? selectedTest.test_name : ''
        };
      }
    } else {
      updatedTests[index] = { ...updatedTests[index], [field]: value };
    }
    
    setLabTestData({ ...labTestData, lab_tests: updatedTests });
  };

  const addLabTest = () => {
    setLabTestData({
      ...labTestData,
      lab_tests: [...labTestData.lab_tests, { 
        lab_test: '', customLabTest: '', isCustom: false, instructions: '', searchTerm: ''
      }]
    });
  };

  const removeLabTest = (index) => {
    if (labTestData.lab_tests.length > 1) {
      const updatedTests = labTestData.lab_tests.filter((_, i) => i !== index);
      setLabTestData({ ...labTestData, lab_tests: updatedTests });
    }
  };

  // Enhanced filter functions with intelligent search
  const getFilteredMedicines = (searchTerm) => {
    if (!medicines || medicines.length === 0) return [];
    if (!searchTerm || searchTerm.trim() === '') return medicines.slice(0, 10); // Show first 10 by default
    
    const search = searchTerm.toLowerCase().trim();
    
    return medicines.filter(med => {
      const name = (med?.name || '').toLowerCase();
      const genericName = (med?.generic_name || '').toLowerCase();
      
      // Exact match gets priority
      if (name === search || genericName === search) return true;
      
      // Starts with search term
      if (name.startsWith(search) || genericName.startsWith(search)) return true;
      
      // Contains search term
      if (name.includes(search) || genericName.includes(search)) return true;
      
      // Word boundary matches
      const nameWords = name.split(' ');
      const genericWords = genericName.split(' ');
      
      return nameWords.some(word => word.startsWith(search)) || 
             genericWords.some(word => word.startsWith(search));
    }).slice(0, 15); // Limit results to 15 for performance
  };

  const getFilteredLabTests = (searchTerm) => {
    if (!labTests || labTests.length === 0) return [];
    if (!searchTerm || searchTerm.trim() === '') return labTests.slice(0, 10); // Show first 10 by default
    
    const search = searchTerm.toLowerCase().trim();
    
    return labTests.filter(test => {
      const testName = (test?.test_name || '').toLowerCase();
      
      // Exact match gets priority
      if (testName === search) return true;
      
      // Starts with search term
      if (testName.startsWith(search)) return true;
      
      // Contains search term
      if (testName.includes(search)) return true;
      
      // Word boundary matches
      const testWords = testName.split(' ');
      return testWords.some(word => word.startsWith(search));
    }).slice(0, 15); // Limit results to 15 for performance
  };

  // Validation
  const validateForm = () => {
    if (!medicineData.enabled && !labTestData.enabled) {
      setError('Please enable at least one prescription type (Medicine or Lab Test)');
      return false;
    }

    if (medicineData.enabled) {
      const hasEmptyMedicine = medicineData.details.some(detail => 
        (!detail.isCustom && !detail.medicine) || (detail.isCustom && !detail.customMedicine)
      );
      if (hasEmptyMedicine) {
        setError('Please select or enter a medicine for all medicine entries');
        return false;
      }

      const hasEmptyMedicineFields = medicineData.details.some(detail => !detail.dosage || !detail.quantity);
      if (hasEmptyMedicineFields) {
        setError('Please fill in dosage and quantity for all medicines');
        return false;
      }
    }

    if (labTestData.enabled) {
      const hasEmptyLabTest = labTestData.lab_tests.some(test => 
        (!test.isCustom && !test.lab_test) || (test.isCustom && !test.customLabTest)
      );
      if (hasEmptyLabTest) {
        setError('Please select or enter a lab test for all lab test entries');
        return false;
      }
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const results = { medicine: null, labTest: null };

      // Submit medicine prescription if enabled
      if (medicineData.enabled && medicineData.details.length > 0) {
        try {
          // Backend expects the consultation PRIMARY KEY (consultation_auto_id),
          // not the human-readable consultation_id code (e.g., CONS089).
          const consultationPk = consultation?.consultation_auto_id || consultation?.id || consultation?.pk;
          results.medicine = await createMedicinePrescription(
            consultationPk,
            medicineData.details
          );
        } catch (medError) {
          console.error('Medicine prescription error:', medError);
          throw new Error(medError.message || 'Failed to create medicine prescription');
        }
      }

      // Submit lab test prescription if enabled
      if (labTestData.enabled && labTestData.lab_tests.length > 0) {
        try {
          const consultationPk = consultation?.consultation_auto_id || consultation?.id || consultation?.pk;
          results.labTest = await createLabPrescription(
            consultationPk,
            labTestData.lab_tests
          );
        } catch (labError) {
          console.error('Lab test prescription error:', labError);
          throw new Error(labError.message || 'Failed to create lab test prescription');
        }
      }

      await onSubmit(results);
    } catch (err) {
      setError(err.message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Custom CSS for enhanced search */}
      <style>{`
        .medicine-option:hover, .lab-option:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        
        .search-dropdown {
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        .search-input:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
      
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <FaPills className="me-2" />
              <FaVial className="me-2" />
              Prescription Form
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {loading && (
                <div className="alert alert-info">
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Loading prescription data...
                </div>
              )}

              {/* Patient Info */}
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h6 className="card-title">Patient Information</h6>
                  <p><strong>Patient:</strong> {appointment?._patientName || consultation?.appointment_id?.patient_id?.patient_name || 'Unknown'}</p>
                  <p><strong>Consultation ID:</strong> {consultation?.consultation_id}</p>
                </div>
              </div>

              {/* Prescription Type Selection */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Select Prescription Types</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="enableMedicine"
                          checked={medicineData.enabled}
                          onChange={(e) => setMedicineData({ ...medicineData, enabled: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="enableMedicine">
                          <FaPills className="me-2" />
                          Medicine Prescription
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="enableLabTest"
                          checked={labTestData.enabled}
                          onChange={(e) => setLabTestData({ ...labTestData, enabled: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="enableLabTest">
                          <FaVial className="me-2" />
                          Lab Test Prescription
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicine Section */}
              {medicineData.enabled && (
                <div className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">
                      <FaPills className="me-2" />
                      Medicine Prescription
                    </h6>
                  </div>
                  <div className="card-body">
                    {medicineData.details.map((detail, index) => (
                      <div key={index} className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Medicine {index + 1}</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeMedicine(index)}
                            disabled={medicineData.details.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Medicine</label>
                            {!detail.isCustom ? (
                              <div className="position-relative">
                                <div className="position-relative">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type to search medicines... (e.g., Para, Ibu, Amox)"
                                    value={detail.searchTerm}
                                    onChange={(e) => handleMedicineChange(index, 'searchTerm', e.target.value)}
                                    onFocus={() => {
                                      const dropdown = document.getElementById(`med-dropdown-${index}`);
                                      if (dropdown) dropdown.style.display = 'block';
                                    }}
                                    onBlur={() => {
                                      setTimeout(() => {
                                        const dropdown = document.getElementById(`med-dropdown-${index}`);
                                        if (dropdown) dropdown.style.display = 'none';
                                      }, 200);
                                    }}
                                  />
                                  
                                  {/* Search Results Dropdown */}
                                  <div 
                                    id={`med-dropdown-${index}`}
                                    className="position-absolute w-100 bg-white border rounded shadow-lg"
                                    style={{ 
                                      display: 'none', 
                                      zIndex: 1000, 
                                      maxHeight: '250px', 
                                      overflowY: 'auto',
                                      top: '100%',
                                      border: '1px solid #dee2e6'
                                    }}
                                  >
                                    {/* Search Results Header */}
                                    {detail.searchTerm && (
                                      <div className="p-2 bg-light border-bottom">
                                        <small className="text-muted">
                                          <i className="fas fa-search me-1"></i>
                                          Search results for "{detail.searchTerm}" ({getFilteredMedicines(detail.searchTerm).length} found)
                                        </small>
                                      </div>
                                    )}
                                    
                                    {/* Medicine Results */}
                                    {getFilteredMedicines(detail.searchTerm).length > 0 ? (
                                      getFilteredMedicines(detail.searchTerm).map((med) => (
                                        <div
                                          key={med.med_auto_id}
                                          className="p-3 border-bottom medicine-option"
                                          style={{ cursor: 'pointer' }}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleMedicineChange(index, 'medicine', med.med_auto_id);
                                          }}
                                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                        >
                                          <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                              <strong className="text-primary">{med.name}</strong>
                                              <br />
                                              <small className="text-muted">Generic: {med.generic_name}</small>
                        {/* med_auto_id removed from display to avoid clutter */}
                                            </div>
                                            <i className="fas fa-pills text-success"></i>
                                          </div>
                                        </div>
                                      ))
                                    ) : detail.searchTerm ? (
                                      <div className="p-3 text-center text-muted">
                                        <i className="fas fa-search me-2"></i>
                                        No medicines found for "{detail.searchTerm}"
                                      </div>
                                    ) : null}
                                    
                                    {/* Custom Medicine Option */}
                                    <div
                                      className="p-3 text-primary fw-bold border-top"
                                      style={{ cursor: 'pointer', backgroundColor: '#e3f2fd' }}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleMedicineChange(index, 'medicine', 'other');
                                      }}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = '#bbdefb'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                                    >
                                      <i className="fas fa-plus-circle me-2"></i>
                                      Add Custom Medicine
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter custom medicine name..."
                                  value={detail.customMedicine}
                                  onChange={(e) => handleMedicineChange(index, 'customMedicine', e.target.value)}
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary mt-2"
                                  onClick={() => handleMedicineChange(index, 'medicine', '')}
                                >
                                  Back to List
                                </button>
                              </>
                            )}
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Dosage</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., 1 tablet"
                              value={detail.dosage}
                              onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Total qty"
                              value={detail.quantity}
                              onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                              min="1"
                              required
                            />
                          </div>
                          
                          <div className="col-12 mb-3">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., After meals, twice daily"
                              value={detail.instructions}
                              onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={addMedicine}
                    >
                      <FaPlus className="me-2" />
                      Add Medicine
                    </button>
                  </div>
                </div>
              )}

              {/* Lab Test Section */}
              {labTestData.enabled && (
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0">
                      <FaVial className="me-2" />
                      Lab Test Prescription
                    </h6>
                  </div>
                  <div className="card-body">
                    {labTestData.lab_tests.map((test, index) => (
                      <div key={index} className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>Lab Test {index + 1}</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeLabTest(index)}
                            disabled={labTestData.lab_tests.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-8 mb-3">
                            <label className="form-label">Lab Test</label>
                            {!test.isCustom ? (
                              <div className="position-relative">
                                <div className="position-relative">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type to search lab tests... (e.g., Blood, Urine, X-Ray)"
                                    value={test.searchTerm}
                                    onChange={(e) => handleLabTestChange(index, 'searchTerm', e.target.value)}
                                    onFocus={() => {
                                      const dropdown = document.getElementById(`lab-dropdown-${index}`);
                                      if (dropdown) dropdown.style.display = 'block';
                                    }}
                                    onBlur={() => {
                                      setTimeout(() => {
                                        const dropdown = document.getElementById(`lab-dropdown-${index}`);
                                        if (dropdown) dropdown.style.display = 'none';
                                      }, 200);
                                    }}
                                  />
                                  
                                  {/* Search Results Dropdown */}
                                  <div 
                                    id={`lab-dropdown-${index}`}
                                    className="position-absolute w-100 bg-white border rounded shadow-lg"
                                    style={{ 
                                      display: 'none', 
                                      zIndex: 1000, 
                                      maxHeight: '250px', 
                                      overflowY: 'auto',
                                      top: '100%',
                                      border: '1px solid #dee2e6'
                                    }}
                                  >
                                    {/* Search Results Header */}
                                    {test.searchTerm && (
                                      <div className="p-2 bg-light border-bottom">
                                        <small className="text-muted">
                                          <i className="fas fa-search me-1"></i>
                                          Search results for "{test.searchTerm}" ({getFilteredLabTests(test.searchTerm).length} found)
                                        </small>
                                      </div>
                                    )}
                                    
                                    {/* Lab Test Results */}
                                    {getFilteredLabTests(test.searchTerm).length > 0 ? (
                                      getFilteredLabTests(test.searchTerm).map((lab) => (
                                        <div
                                          key={lab.test_auto_id}
                                          className="p-3 border-bottom lab-option"
                                          style={{ cursor: 'pointer' }}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleLabTestChange(index, 'lab_test', lab.test_auto_id);
                                          }}
                                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                        >
                                          <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                              <strong className="text-info">{lab.test_name}</strong>
                                              <br />
                                              <small className="text-dark fw-bold">₹{lab.rate}</small>
                               {/* test_auto_id removed from display to avoid clutter */}
                                            </div>
                                            <i className="fas fa-vial text-info"></i>
                                          </div>
                                        </div>
                                      ))
                                    ) : test.searchTerm ? (
                                      <div className="p-3 text-center text-muted">
                                        <i className="fas fa-search me-2"></i>
                                        No lab tests found for "{test.searchTerm}"
                                      </div>
                                    ) : null}
                                    
                                    {/* Custom Lab Test Option */}
                                    <div
                                      className="p-3 text-info fw-bold border-top"
                                      style={{ cursor: 'pointer', backgroundColor: '#e1f5fe' }}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleLabTestChange(index, 'lab_test', 'other');
                                      }}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = '#b3e5fc'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e1f5fe'}
                                    >
                                      <i className="fas fa-plus-circle me-2"></i>
                                      Add Custom Lab Test
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter custom lab test name..."
                                  value={test.customLabTest}
                                  onChange={(e) => handleLabTestChange(index, 'customLabTest', e.target.value)}
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary mt-2"
                                  onClick={() => handleLabTestChange(index, 'lab_test', '')}
                                >
                                  Back to List
                                </button>
                              </>
                            )}
                          </div>
                          
                          <div className="col-12 mb-3">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Fasting required, Morning sample"
                              value={test.instructions}
                              onChange={(e) => handleLabTestChange(index, 'instructions', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={addLabTest}
                    >
                      <FaPlus className="me-2" />
                      Add Lab Test
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Prescription...
                  </>
                ) : (
                  <>
                    <FaPills className="me-2" />
                    <FaVial className="me-2" />
                    Create Prescription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default UnifiedPrescriptionForm;
