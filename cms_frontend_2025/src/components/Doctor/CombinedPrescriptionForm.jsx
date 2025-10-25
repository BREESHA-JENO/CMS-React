import React, { useState, useEffect } from 'react';
import { FaPills, FaVial, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { getAllMedicines, getAllLabTests } from '../../Service/doctor_api';

const CombinedPrescriptionForm = ({ consultation, staffId, onSubmit, onClose }) => {
  const [medicines, setMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form data for medicines
  const [medicineFormData, setMedicineFormData] = useState({
    consultation_id: consultation?.consultation_id || '',
    details: [{ medicine: '', dosage: '', quantity: '', instructions: '' }]
  });

  // Form data for lab tests
  const [labFormData, setLabFormData] = useState({
    consultation_id: consultation?.consultation_id || '',
    lab_tests: [{ lab_test: '', instructions: '' }]
  });

  // Load medicines and lab tests
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading medicines and lab tests for combined form...');
        
        // Load medicines
        const medicineResponse = await getAllMedicines();
        console.log('Medicines loaded:', medicineResponse.data);
        setMedicines(medicineResponse.data || []);

        // Load lab tests
        const labResponse = await getAllLabTests();
        console.log('Lab tests loaded:', labResponse.data);
        setLabTests(labResponse.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load medicines and lab tests data. Please try again.');
      }
    };

    loadData();
  }, []);

  // Medicine form handlers
  const handleMedicineChange = (index, field, value) => {
    const updatedDetails = [...medicineFormData.details];
    updatedDetails[index][field] = value;
    setMedicineFormData({ ...medicineFormData, details: updatedDetails });
  };

  const addMedicineRow = () => {
    setMedicineFormData({
      ...medicineFormData,
      details: [...medicineFormData.details, { medicine: '', dosage: '', quantity: '', instructions: '' }]
    });
  };

  const removeMedicineRow = (index) => {
    if (medicineFormData.details.length > 1) {
      const updatedDetails = medicineFormData.details.filter((_, i) => i !== index);
      setMedicineFormData({ ...medicineFormData, details: updatedDetails });
    }
  };

  // Lab test form handlers
  const handleLabTestChange = (index, field, value) => {
    const updatedTests = [...labFormData.lab_tests];
    updatedTests[index][field] = value;
    setLabFormData({ ...labFormData, lab_tests: updatedTests });
  };

  const addLabTestRow = () => {
    setLabFormData({
      ...labFormData,
      lab_tests: [...labFormData.lab_tests, { lab_test: '', instructions: '' }]
    });
  };

  const removeLabTestRow = (index) => {
    if (labFormData.lab_tests.length > 1) {
      const updatedTests = labFormData.lab_tests.filter((_, i) => i !== index);
      setLabFormData({ ...labFormData, lab_tests: updatedTests });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate medicines if any are selected
      const hasMedicines = medicineFormData.details.some(detail => detail.medicine);
      const hasLabTests = labFormData.lab_tests.some(test => test.lab_test);

      if (!hasMedicines && !hasLabTests) {
        setError('Please select at least one medicine or lab test to prescribe.');
        setLoading(false);
        return;
      }

      // Validate medicine duplicates
      if (hasMedicines) {
        const medicineIds = medicineFormData.details
          .map(detail => detail.medicine)
          .filter(id => id);
        const uniqueMedicineIds = new Set(medicineIds);
        if (medicineIds.length !== uniqueMedicineIds.size) {
          setError('Duplicate medicines are not allowed. Please remove duplicate entries.');
          setLoading(false);
          return;
        }

        // Check for empty medicine selections
        const hasEmptyMedicine = medicineFormData.details.some(detail => 
          detail.medicine && (!detail.dosage || !detail.quantity)
        );
        if (hasEmptyMedicine) {
          setError('Please fill in dosage and quantity for all selected medicines.');
          setLoading(false);
          return;
        }
      }

      // Validate lab test duplicates
      if (hasLabTests) {
        const labTestIds = labFormData.lab_tests
          .map(test => test.lab_test)
          .filter(id => id);
        const uniqueLabTestIds = new Set(labTestIds);
        if (labTestIds.length !== uniqueLabTestIds.size) {
          setError('Duplicate lab tests are not allowed. Please remove duplicate entries.');
          setLoading(false);
          return;
        }
      }

      const results = {};

      // Submit medicine prescription if any medicines selected
      if (hasMedicines) {
        const medicineSubmissionData = {
          consultation_id: medicineFormData.consultation_id,
          details: medicineFormData.details
            .filter(detail => detail.medicine)
            .map(detail => ({
              medicine: detail.medicine,
              dosage: detail.dosage,
              quantity: parseInt(detail.quantity),
              instructions: detail.instructions
            }))
        };

        const medicineResponse = await fetch('/api/doctor/prescriptions/med/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(medicineSubmissionData)
        });

        if (!medicineResponse.ok) {
          const errorData = await medicineResponse.json();
          throw new Error(errorData.error || 'Failed to create medicine prescription');
        }

        results.medicine = await medicineResponse.json();
      }

      // Submit lab test prescription if any lab tests selected
      if (hasLabTests) {
        const labSubmissionData = {
          consultation_id: labFormData.consultation_id,
          details: labFormData.lab_tests
            .filter(test => test.lab_test)
            .map(test => ({
              lab_test: test.lab_test,
              instructions: test.instructions
            }))
        };

        const labResponse = await fetch('/api/doctor/prescriptions/lab/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(labSubmissionData)
        });

        if (!labResponse.ok) {
          const errorData = await labResponse.json();
          throw new Error(errorData.error || 'Failed to create lab test prescription');
        }

        results.labTest = await labResponse.json();
      }

      // Call parent onSubmit with results
      await onSubmit(results);

    } catch (err) {
      console.error('Combined prescription error:', err);
      const errorMessage = err.userFriendlyMessage || err.message || 'Failed to create prescriptions. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <FaPills className="me-2" />
              <FaVial className="me-2" />
              Complete Prescription (Medicine + Lab Tests)
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

              <div className="row">
                {/* Patient Info */}
                <div className="col-12 mb-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Patient Information</h6>
                      <p><strong>Patient:</strong> {consultation?.appointment_id?.patient_id?.patient_name || 'Unknown'}</p>
                      <p><strong>Consultation ID:</strong> {consultation?.consultation_id}</p>
                    </div>
                  </div>
                </div>

                {/* Medicine Prescription Section */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        <FaPills className="me-2" />
                        Medicine Prescription
                      </h6>
                    </div>
                    <div className="card-body">
                      {medicineFormData.details.map((detail, index) => (
                        <div key={index} className="row mb-3 border-bottom pb-3">
                          <div className="col-12 mb-2">
                            <label className="form-label">Medicine</label>
                            <select
                              className="form-select"
                              value={detail.medicine}
                              onChange={(e) => handleMedicineChange(index, 'medicine', e.target.value)}
                            >
                              <option value="">Select Medicine</option>
                              {medicines.map((med) => (
                                <option key={med.med_auto_id} value={med.med_auto_id}>
                                  {med.name} ({med.generic_name})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label">Dosage</label>
                            <input
                              type="text"
                              className="form-control"
                              value={detail.dosage}
                              onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                              placeholder="e.g., 1 tablet"
                            />
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-control"
                              value={detail.quantity}
                              onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                              min="1"
                            />
                          </div>
                          <div className="col-10 mb-2">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              value={detail.instructions}
                              onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                              placeholder="e.g., After meals"
                            />
                          </div>
                          <div className="col-2 d-flex align-items-end mb-2">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeMedicineRow(index)}
                              disabled={medicineFormData.details.length === 1}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={addMedicineRow}
                      >
                        <FaPlus className="me-1" />
                        Add Medicine
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lab Test Prescription Section */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">
                        <FaVial className="me-2" />
                        Lab Test Prescription
                      </h6>
                    </div>
                    <div className="card-body">
                      {labFormData.lab_tests.map((test, index) => (
                        <div key={index} className="row mb-3 border-bottom pb-3">
                          <div className="col-12 mb-2">
                            <label className="form-label">Lab Test</label>
                            <select
                              className="form-select"
                              value={test.lab_test}
                              onChange={(e) => handleLabTestChange(index, 'lab_test', e.target.value)}
                            >
                              <option value="">Select Lab Test</option>
                              {labTests.map((lab) => (
                                <option key={lab.LabTestId} value={lab.LabTestId}>
                                  {lab.LabTestName} - ₹{lab.Rate}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-10 mb-2">
                            <label className="form-label">Instructions</label>
                            <input
                              type="text"
                              className="form-control"
                              value={test.instructions}
                              onChange={(e) => handleLabTestChange(index, 'instructions', e.target.value)}
                              placeholder="e.g., Fasting required"
                            />
                          </div>
                          <div className="col-2 d-flex align-items-end mb-2">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeLabTestRow(index)}
                              disabled={labFormData.lab_tests.length === 1}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={addLabTestRow}
                      >
                        <FaPlus className="me-1" />
                        Add Lab Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Prescriptions...
                  </>
                ) : (
                  <>
                    <FaPills className="me-1" />
                    <FaVial className="me-1" />
                    Create Complete Prescription
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

export default CombinedPrescriptionForm;
