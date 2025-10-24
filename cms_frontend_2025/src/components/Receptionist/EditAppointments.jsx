// src/components/Receptionist/EditAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { appointmentAPI, patientAPI, staffAPI } from '../../Service/recep_api';
import './EditAppointments.css';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const [appointment, setAppointment] = useState(null);
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

  // Fetch appointment details, patients, and doctors
  useEffect(() => {
    fetchAppointment();
    fetchPatients();
    fetchDoctors();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getById(id);
      const apt = response.data;
      
      console.log('Appointment data:', apt);
      
      setAppointment(apt);
      setFormData({
        patient_code: apt.patient_id?.patient_id || apt.patient_code || '',
        staff: apt.staff?.id || apt.staff || '',
        appoinment_date: apt.appoinment_date || '',
        appoinment_time: apt.appoinment_time || '',
        appoinment_status: apt.appoinment_status || 'Scheduled',
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const doctorsList = await staffAPI.getDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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
      toast.error('Please fix all errors before submitting', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setUpdating(true);

    try {
      const dataToSend = {
        patient_code: formData.patient_code,
        staff: Number(formData.staff),
        appoinment_date: formData.appoinment_date,
        appoinment_time: formData.appoinment_time,
        appoinment_status: formData.appoinment_status,
      };

      console.log('Updating appointment with:', dataToSend);
      await appointmentAPI.update(id, dataToSend);
      
      toast.success('Appointment updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/appointment-list');
      }, 1500);

    } catch (error) {
      console.error('Error updating appointment:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to update appointment:\n\n';
        
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
      setUpdating(false);
    }
  };

  const handleQuickStatusUpdate = async (status) => {
    if (window.confirm(`Change appointment status to "${status}"?`)) {
      try {
        await appointmentAPI.updateStatus(id, status);
        toast.success(`Appointment ${status.toLowerCase()} successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchAppointment(); // Reload data
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Scheduled: { color: '#007bff', bg: '#e7f3ff', label: 'Scheduled' },
      Completed: { color: '#28a745', bg: '#e6f9ed', label: 'Completed' },
      Cancelled: { color: '#dc3545', bg: '#ffe6e6', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.Scheduled;

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '1rem',
        }}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="edit-appointment-container">
        <Header1
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={[]}
        />
        <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading appointment details...</p>
        </div>
        <Footer1 />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="edit-appointment-container">
        <Header1
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={[]}
        />
        <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />
        <div className="error-container">
          <h2>Appointment Not Found</h2>
          <button onClick={() => navigate('/appointment-list')}>Back to Appointments</button>
        </div>
        <Footer1 />
      </div>
    );
  }

  return (
    <div className={`edit-appointment-container${darkMode ? ' dark' : ''}`}>
      <ToastContainer />
      
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />

      <div className="edit-appointment-content">
        <div className="form-header">
          <button className="btn-back" onClick={() => navigate('/appointment-list')}>
            <FaArrowLeft /> Back to List
          </button>
          <h1>Edit Appointment</h1>
          <div className="appointment-info">
            <span className="appointment-id">{appointment.appointment_id}</span>
            {getStatusBadge(appointment.appoinment_status)}
          </div>
        </div>

        {/* Quick Actions */}
        {appointment.appoinment_status === 'Scheduled' && (
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button
                className="btn-action btn-complete"
                onClick={() => handleQuickStatusUpdate('Completed')}
              >
                <FaCheckCircle /> Mark as Completed
              </button>
              <button
                className="btn-action btn-cancel"
                onClick={() => handleQuickStatusUpdate('Cancelled')}
              >
                <FaTimesCircle /> Cancel Appointment
              </button>
            </div>
          </div>
        )}

        {/* Patient & Doctor Info Cards */}
        <div className="info-cards">
          <div className="info-card patient-card">
            <div className="card-icon">
              <FaUser />
            </div>
            <div className="card-content">
              <h4>Patient Details</h4>
              <p><strong>Name:</strong> {appointment.patient_name || 'N/A'}</p>
              <p><strong>ID:</strong> {appointment.patient_id?.patient_id || formData.patient_code}</p>
            </div>
          </div>

          <div className="info-card doctor-card">
            <div className="card-icon">
              <FaUserMd />
            </div>
            <div className="card-content">
              <h4>Doctor Details</h4>
              <p><strong>Name:</strong> {appointment.doctor_name || 'N/A'}</p>
              <p><strong>Department:</strong> Cardiology</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Patient Selection */}
          <div className="form-group">
            <label htmlFor="patient_code">
              Select Patient <span className="required">*</span>
            </label>
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
            {errors.patient_code && touched.patient_code && (
              <span className="error-message">{errors.patient_code}</span>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="form-group">
            <label htmlFor="staff">
              Select Doctor <span className="required">*</span>
            </label>
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
              onClick={() => navigate('/appointment-list')}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="spinner-small"></span>
                  Updating...
                </>
              ) : (
                'Update Appointment'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer1 />
    </div>
  );
};

export default EditAppointment;
