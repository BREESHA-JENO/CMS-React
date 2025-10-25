import React, { useState, useEffect } from 'react';
import { FaPills, FaSearch, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { getAllMedicines } from '../../Service/doctor_api';

const EnhancedPrescriptionForm = ({ consultation, staffId, onSubmit, onClose }) => {
  console.log('EnhancedPrescriptionForm rendered with:', { consultation, staffId });
  
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    consultation_id: consultation?.consultation_id || '',
    staff_id: staffId || '',
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

  // Load medicines from API
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        console.log('Loading medicines for enhanced form...');
        const response = await getAllMedicines();
        console.log('Medicines loaded:', response.data);
        setMedicines(response.data || []);
      } catch (err) {
        console.error('Error loading medicines:', err);
        setError('Failed to load medicines data. Please try again.');
      }
    };

    loadMedicines();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.details];
    
    if (name === 'medicine') {
      if (value === 'other') {
        updatedDetails[index] = {
          ...updatedDetails[index],
          medicine: '',
          isCustom: true,
          customMedicine: '',
          searchTerm: ''
        };
      } else {
        updatedDetails[index] = {
          ...updatedDetails[index],
          medicine: value,
          isCustom: false,
          customMedicine: '',
          searchTerm: ''
        };
      }
    } else if (name === 'searchTerm') {
      updatedDetails[index] = {
        ...updatedDetails[index],
        searchTerm: value
      };
    } else {
      updatedDetails[index] = {
        ...updatedDetails[index],
        [name]: value
      };
    }
    
    setFormData({ ...formData, details: updatedDetails });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { 
        medicine: '', 
        customMedicine: '',
        isCustom: false,
        dosage: '', 
        quantity: '', 
        instructions: '',
        searchTerm: ''
      }]
    });
  };

  const removeMedicine = (index) => {
    if (formData.details.length > 1) {
      const updatedDetails = formData.details.filter((_, i) => i !== index);
      setFormData({ ...formData, details: updatedDetails });
    }
  };

  // Filter medicines based on search term
  const getFilteredMedicines = (searchTerm) => {
    if (!searchTerm) return medicines;
    return medicines.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation for duplicate medicines
    const medicineIds = formData.details
      .map(detail => detail.isCustom ? detail.customMedicine : detail.medicine)
      .filter(id => id);
    const uniqueMedicineIds = new Set(medicineIds);
    if (medicineIds.length !== uniqueMedicineIds.size) {
      setError('Duplicate medicines are not allowed. Please remove duplicate entries.');
      return;
    }

    // Check for empty medicine selections
    const hasEmptyMedicine = formData.details.some(detail => 
      (!detail.isCustom && !detail.medicine) || (detail.isCustom && !detail.customMedicine)
    );
    if (hasEmptyMedicine) {
      setError('Please select or enter a medicine for all entries.');
      return;
    }

    // Check for missing dosage or quantity
    const hasEmptyFields = formData.details.some(detail => 
      !detail.dosage || !detail.quantity
    );
    if (hasEmptyFields) {
      setError('Please fill in dosage and quantity for all medicines.');
      return;
    }
    
    try {
      // Remove staff_id and appointment_id from submission as staff_id is auto-assigned by backend
      const { staff_id, appointment_id, ...submissionData } = formData;
      
      // Transform the data for submission
      submissionData.details = submissionData.details.map(detail => ({
        medicine: detail.isCustom ? null : detail.medicine,
        custom_medicine_name: detail.isCustom ? detail.customMedicine : null,
        dosage: detail.dosage,
        quantity: parseInt(detail.quantity),
        instructions: detail.instructions
      }));

      await onSubmit(submissionData);
    } catch (err) {
      // Use user-friendly error message if available
      const errorMessage = err.userFriendlyMessage || err.response?.data?.error || err.message || 'Failed to save prescription. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <FaPills className="me-2" />
              Enhanced Medicine Prescription
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

              {/* Medicine Details */}
              {formData.details.map((detail, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaPills className="me-2" />
                      Medicine {index + 1}
                    </h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeMedicine(index)}
                      disabled={formData.details.length === 1}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {/* Medicine Selection */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Medicine Selection</label>
                        
                        {!detail.isCustom ? (
                          <>
                            {/* Search Box */}
                            <div className="input-group mb-2">
                              <span className="input-group-text">
                                <FaSearch />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search medicines..."
                                name="searchTerm"
                                value={detail.searchTerm}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div>

                            {/* Medicine Dropdown */}
                            <select
                              className="form-select"
                              name="medicine"
                              value={detail.medicine}
                              onChange={(e) => handleChange(e, index)}
                              required={!detail.isCustom}
                            >
                              <option value="">Select Medicine</option>
                              {getFilteredMedicines(detail.searchTerm).map((med) => (
                                <option key={med.med_auto_id} value={med.med_auto_id}>
                                  {med.name} ({med.generic_name})
                                </option>
                              ))}
                              <option value="other" style={{backgroundColor: '#e3f2fd', fontWeight: 'bold'}}>
                                ➕ Other (Enter Custom Medicine)
                              </option>
                            </select>
                          </>
                        ) : (
                          <>
                            {/* Custom Medicine Input */}
                            <div className="alert alert-info">
                              <small>
                                <strong>Custom Medicine:</strong> Enter medicine not in database
                              </small>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter custom medicine name..."
                              name="customMedicine"
                              value={detail.customMedicine}
                              onChange={(e) => handleChange(e, index)}
                              required={detail.isCustom}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary mt-2"
                              onClick={() => handleChange({target: {name: 'medicine', value: ''}}, index)}
                            >
                              <FaTimes className="me-1" />
                              Back to Medicine List
                            </button>
                          </>
                        )}
                      </div>

                      {/* Dosage */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Dosage</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 1 tablet, 5ml, 2 capsules"
                          name="dosage"
                          value={detail.dosage}
                          onChange={(e) => handleChange(e, index)}
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Total quantity"
                          name="quantity"
                          value={detail.quantity}
                          onChange={(e) => handleChange(e, index)}
                          min="1"
                          required
                        />
                      </div>

                      {/* Instructions */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Instructions</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., After meals, Before sleep"
                          name="instructions"
                          value={detail.instructions}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Medicine Button */}
              <div className="text-center mb-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={addMedicine}
                >
                  <FaPlus className="me-2" />
                  Add Another Medicine
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Prescription...
                  </>
                ) : (
                  <>
                    <FaPills className="me-2" />
                    Create Medicine Prescription
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

export default EnhancedPrescriptionForm;
