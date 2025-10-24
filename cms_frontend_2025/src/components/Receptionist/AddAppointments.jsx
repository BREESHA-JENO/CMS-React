// src/components/Receptionist/AddAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { appointmentAPI, patientAPI, staffAPI } from '../../Service/recep_api';
import './AddAppointments.css';

const AddAppointment = () => {
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
    appoinment_date: '',
    appoinment_time: '',
    appoinment_status: 'Scheduled',
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
      console.log('Raw doctor data:', doctorsList);  // ADD THIS
    console.log('First doctor:', doctorsList[0]);  // ADD THIS
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
  
  const validateDate = (date) => {
    if (!date) return 'Appointment date is required';
    const today = new Date().toISOString().split('T')[0];
    if (date < today) return 'Appointment date cannot be in the past';
    return '';
  };

  const validateTime = (time) => (!time ? 'Appointment time is required' : '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    switch (name) {
      case 'patient_code': error = validatePatient(value); break;
      case 'staff': error = validateDoctor(value); break;
      case 'appoinment_date': error = validateDate(value); break;
      case 'appoinment_time': error = validateTime(value); break;
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
      appoinment_date: validateDate(formData.appoinment_date),
      appoinment_time: validateTime(formData.appoinment_time),
    };
    setErrors(newErrors);
    setTouched({ patient_code: true, staff: true, appoinment_date: true, appoinment_time: true });
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        patient_code: formData.patient_code,
        staff: Number(formData.staff),
        appoinment_date: formData.appoinment_date,
        appoinment_time: formData.appoinment_time,
        appoinment_status: formData.appoinment_status,
      };

      console.log('Sending appointment data:', dataToSend);
      console.log('Staff value',formData.staff,'Parsed:',Number(formData.staff));
      const response = await appointmentAPI.create(dataToSend);
      
      toast.success(`Appointment scheduled! ID: ${response.data.appointment_id}`, {
        position: 'top-center',
        autoClose: 4000,
      });

      setTimeout(() => {
        setFormData({
          patient_code: '',
          staff: '',
          appoinment_date: '',
          appoinment_time: '',
          appoinment_status: 'Scheduled',
        });
        setErrors({});
        setTouched({});
      }, 1500);

    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to schedule appointment:\n\n';
        
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
           formData.patient_code && formData.staff && 
           formData.appoinment_date && formData.appoinment_time;
  };

  return (
    <div className={`add-appointment-container${darkMode ? ' dark' : ''}`}>
      <ToastContainer />
      
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />

      <div className="add-appointment-content">
        <div className="form-header">
          <h1>Schedule New Appointment</h1>
          <p>Book an appointment for a patient</p>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
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

          {/* Appointment Date */}
          <div className="form-group">
            <label htmlFor="appoinment_date">
              Appointment Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="appoinment_date"
              name="appoinment_date"
              value={formData.appoinment_date}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.appoinment_date && touched.appoinment_date ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.appoinment_date && touched.appoinment_date && (
              <span className="error-message">{errors.appoinment_date}</span>
            )}
          </div>

          {/* Appointment Time */}
          <div className="form-group">
            <label htmlFor="appoinment_time">
              Appointment Time <span className="required">*</span>
            </label>
            <input
              type="time"
              id="appoinment_time"
              name="appoinment_time"
              value={formData.appoinment_time}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.appoinment_time && touched.appoinment_time ? 'error' : ''}
            />
            {errors.appoinment_time && touched.appoinment_time && (
              <span className="error-message">{errors.appoinment_time}</span>
            )}
          </div>

          {/* Appointment Status */}
          <div className="form-group full-width">
            <label htmlFor="appoinment_status">Status</label>
            <select
              id="appoinment_status"
              name="appoinment_status"
              value={formData.appoinment_status}
              onChange={handleChange}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/manage-appointments')}
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
                  Scheduling...
                </>
              ) : (
                'Schedule Appointment'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer1 />
    </div>
  );
};

export default AddAppointment;
