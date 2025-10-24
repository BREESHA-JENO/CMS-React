import React, { useState, useEffect } from 'react';
import { getAllMedicines } from '../../Service/doctor_api';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrescriptionForm = ({ consultation, staffId, onSubmit, onClose }) => {
  const [medicinesList, setMedicinesList] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    consultation_id: consultation?.consultation_auto_id || '',
    appointment_id: consultation?.appointment_id?.id || '',
    staff_id: staffId || '',
    medicines: [
      {
        medicine: '',
        dosage: '',
        quantity: 1,
        instructions: ''
      }
    ]
  });

  useEffect(() => {
    getAllMedicines()
      .then(res => setMedicinesList(res.data))
      .catch(() => setMedicinesList([]));
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
      const newMedicines = [...formData.medicines];
      newMedicines[index] = {
        ...newMedicines[index],
        [e.target.name]: e.target.value
      };
      setFormData({
        ...formData,
        medicines: newMedicines
      });
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medicine: '', dosage: '', quantity: '', instructions: '' }
      ]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medicines: newMedicines
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
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Prescribe Medicine</h5>
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
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="border p-3 mb-3">
                  <h6>Medicine {index + 1}</h6>
                  <div className="mb-3">
                    <label className="form-label">Medicine</label>
                    <select
                      className="form-control"
                      name="medicine"
                      value={medicine.medicine}
                      onChange={(e) => handleChange(e, index)}
                      required
                    >
                      <option value="">Select medicine</option>
                      {medicinesList.map(med => (
                        <option key={med.med_auto_id} value={med.med_auto_id}>
                          {med.name} ({med.med_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dosage"
                      value={medicine.dosage}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={medicine.quantity}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Instructions</label>
                    <textarea
                      className="form-control"
                      name="instructions"
                      value={medicine.instructions}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  {formData.medicines.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeMedicine(index)}
                    >
                      Remove Medicine
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={addMedicine}
              >
                Add Another Medicine
              </button>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;