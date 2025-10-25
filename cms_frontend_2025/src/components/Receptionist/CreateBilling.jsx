// src/components/Receptionist/CreateBilling.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { billingAPI, patientAPI, staffAPI } from '../../Service/recep_api';
import './CreateBilling.css';

const CreateBilling = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient_code: '',
    staff: '',
    consultation_fee: '',
    billing_status: 'Unpaid',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Fetch patients and doctors
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients', { position: 'top-right', autoClose: 3000 });
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const doctorsList = await staffAPI.getDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors', { position: 'top-right', autoClose: 3000 });
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Validations
  const validatePatient = (value) => (!value ? 'Please select a patient' : '');
  const validateDoctor = (value) => (!value ? 'Please select a doctor' : '');
  
  const validateFee = (fee) => {
    if (!fee) return 'Consultation fee is required';
    if (isNaN(fee) || Number(fee) <= 0) return 'Fee must be a positive number';
    if (Number(fee) < 100) return 'Minimum fee is ₹100';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    switch (name) {
      case 'patient_code': error = validatePatient(value); break;
      case 'staff': error = validateDoctor(value); break;
      case 'consultation_fee': error = validateFee(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const validateForm = () => {
    const newErrors = {
      patient_code: validatePatient(formData.patient_code),
      staff: validateDoctor(formData.staff),
      consultation_fee: validateFee(formData.consultation_fee),
    };
    setErrors(newErrors);
    setTouched({ patient_code: true, staff: true, consultation_fee: true });
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting', { 
        position: 'top-right', 
        autoClose: 3000 
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        patient_code: formData.patient_code,
        staff: Number(formData.staff),
        consultation_fee: Number(formData.consultation_fee),
        billing_status: formData.billing_status,
      };

      console.log('Creating bill:', dataToSend);
      const response = await billingAPI.create(dataToSend);
      
      toast.success(`Bill created successfully! Bill ID: ${response.data.rec_bill_id || 'Generated'}`, {
        position: 'top-center',
        autoClose: 4000,
      });

      setTimeout(() => {
        setFormData({
          patient_code: '',
          staff: '',
          consultation_fee: '',
          billing_status: 'Unpaid',
        });
        setErrors({});
        setTouched({});
        navigate('/billing-list');
      }, 1500);

    } catch (error) {
      console.error('Error creating bill:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to create bill:\n\n';
        
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errorMessage += `• ${errorData[key].join(', ')}\n`;
            } else {
              errorMessage += `• ${errorData[key]}\n`;
            }
          });
        } else {
          errorMessage += errorData;
        }
        
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 8000,
          style: { whiteSpace: 'pre-line' }
        });
      } else {
        toast.error('Network error. Please check your connection.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return !Object.values(errors).some(error => error !== '') &&
           formData.patient_code && formData.staff && formData.consultation_fee;
  };

  return (
    <div className={`create-billing-container${darkMode ? ' dark' : ''}`}>
      <ToastContainer />
      
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />

      <div className="create-billing-content">
        <div className="form-header">
          <h1>Create New Bill</h1>
          <p>Generate invoice for patient consultation</p>
        </div>

        <form onSubmit={handleSubmit} className="billing-form">
          {/* Patient Selection */}
          <div className="form-group">
            <label htmlFor="patient_code">
              Select Patient <span className="required">*</span>
            </label>
            {patientsLoading ? (
              <div className="loading-indicator">Loading patients...</div>
            ) : (
              <select
                id="patient_code"
                name="patient_code"
                value={formData.patient_code}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.patient_code && touched.patient_code ? 'error' : ''}
              >
                <option value="">-- Select Patient --</option>
                {patients.map(patient => (
                  <option key={patient.patient_auto_id} value={patient.patient_id}>
                    {patient.patient_id} - {patient.patient_name} ({patient.patient_phone})
                  </option>
                ))}
              </select>
            )}
            {errors.patient_code && touched.patient_code && (
              <span className="error-message">{errors.patient_code}</span>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="form-group">
            <label htmlFor="staff">
              Select Doctor <span className="required">*</span>
            </label>
            {doctorsLoading ? (
              <div className="loading-indicator">Loading doctors...</div>
            ) : (
              <select
                id="staff"
                name="staff"
                value={formData.staff}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.staff && touched.staff ? 'error' : ''}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} ({doctor.staff_id}) - {doctor.department || 'General'}
                  </option>
                ))}
              </select>
            )}
            {errors.staff && touched.staff && (
              <span className="error-message">{errors.staff}</span>
            )}
          </div>

          {/* Consultation Fee */}
          <div className="form-group">
            <label htmlFor="consultation_fee">
              Consultation Fee (₹) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="consultation_fee"
              name="consultation_fee"
              placeholder="Enter consultation fee"
              value={formData.consultation_fee}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.consultation_fee && touched.consultation_fee ? 'error' : ''}
              min="100"
              step="50"
            />
            {errors.consultation_fee && touched.consultation_fee && (
              <span className="error-message">{errors.consultation_fee}</span>
            )}
          </div>

          {/* Payment Status */}
          <div className="form-group">
            <label htmlFor="billing_status">Payment Status</label>
            <select
              id="billing_status"
              name="billing_status"
              value={formData.billing_status}
              onChange={handleChange}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/manage-billing')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Bill...
                </>
              ) : (
                'Create Bill'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer1 />
    </div>
  );
};

export default CreateBilling;
