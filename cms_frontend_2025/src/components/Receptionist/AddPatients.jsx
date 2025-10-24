// src/components/Receptionist/AddPatient.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI } from '../../Service/recep_api';
import './AddPatients.css';

const AddPatient = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_age: '',
    patient_gender: '',
    patient_blood_group: '',
    patient_phone: '',
    patient_address: '',
    patient_reg_date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name should contain only letters';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validateAge = (age) => {
    if (!age) {
      return 'Age is required';
    }
    const numAge = parseInt(age);
    if (isNaN(numAge) || numAge < 0 || numAge > 120) {
      return 'Age must be between 0 and 120';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) {
      return 'Phone number is required';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    if (!/^[6-9]/.test(digits)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (!address.trim()) {
      return 'Address is required';
    }
    if (address.trim().length < 10) {
      return 'Address must be at least 10 characters';
    }
    return '';
  };

  const validateDate = (date) => {
    if (!date) {
      return 'Registration date is required';
    }
    
    // Get current date in YYYY-MM-DD format (local timezone)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    // Compare date strings
    if (date > today) {
      return 'Registration date cannot be in the future';
    }
    
    return '';
  };

  // Handle input change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    let error = '';
    switch (name) {
      case 'patient_name':
        error = validateName(value);
        break;
      case 'patient_email':
        error = validateEmail(value);
        break;
      case 'patient_age':
        error = validateAge(value);
        break;
      case 'patient_phone':
        error = validatePhone(value);
        break;
      case 'patient_address':
        error = validateAddress(value);
        break;
      case 'patient_reg_date':
        error = validateDate(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle blur (when user leaves field)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      patient_name: validateName(formData.patient_name),
      patient_email: validateEmail(formData.patient_email),
      patient_age: validateAge(formData.patient_age),
      patient_gender: formData.patient_gender ? '' : 'Gender is required',
      patient_blood_group: formData.patient_blood_group ? '' : 'Blood group is required',
      patient_phone: validatePhone(formData.patient_phone),
      patient_address: validateAddress(formData.patient_address),
      patient_reg_date: validateDate(formData.patient_reg_date),
    };

    setErrors(newErrors);
    setTouched({
      patient_name: true,
      patient_email: true,
      patient_age: true,
      patient_gender: true,
      patient_blood_group: true,
      patient_phone: true,
      patient_address: true,
      patient_reg_date: true,
    });

    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handle form submission - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Create data object WITHOUT patient_id (auto-generated by backend)
      const dataToSend = {
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_age: formData.patient_age,
        patient_gender: formData.patient_gender,
        patient_blood_group: formData.patient_blood_group,
        patient_phone: formData.patient_phone,
        patient_address: formData.patient_address,
        patient_reg_date: formData.patient_reg_date,
      };

      console.log('Sending data to backend:', dataToSend);

      const response = await patientAPI.create(dataToSend);
      
      toast.success(
        `Patient added successfully! Patient ID: ${response.data.patient_id}`,
        {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      // Reset form
      setTimeout(() => {
        setFormData({
          patient_name: '',
          patient_email: '',
          patient_age: '',
          patient_gender: '',
          patient_blood_group: '',
          patient_phone: '',
          patient_address: '',
          patient_reg_date: new Date().toISOString().split('T')[0],
        });
        setErrors({});
        setTouched({});
      }, 1500);

    } catch (error) {
      console.error('Error adding patient:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to add patient:\n\n';
        
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            const fieldName = key.replace('patient_', '').replace('_', ' ');
            const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            
            if (Array.isArray(errorData[key])) {
              errorMessage += `• ${capitalizedField}: ${errorData[key].join(', ')}\n`;
            } else {
              errorMessage += `• ${capitalizedField}: ${errorData[key]}\n`;
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
      } else if (error.request) {
        toast.error('No response from server. Please check if Django is running on http://localhost:8000', {
          position: 'top-right',
          autoClose: 5000,
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
    return (
      !Object.values(errors).some(error => error !== '') &&
      formData.patient_name &&
      formData.patient_age &&
      formData.patient_gender &&
      formData.patient_blood_group &&
      formData.patient_phone &&
      formData.patient_address &&
      formData.patient_reg_date
    );
  };

  return (
    <div className={`add-patient-container${darkMode ? ' dark' : ''}`}>
      <ToastContainer />
      
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar
        open={sidebarOpen}
        role={user?.role}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="add-patient-content">
        <div className="form-header">
          <h1>Add New Patient</h1>
          <p>Fill in patient details with accurate information</p>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          {/* Patient Name */}
          <div className="form-group">
            <label htmlFor="patient_name">
              Patient Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="patient_name"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_name && touched.patient_name ? 'error' : ''}
              placeholder="Enter full name"
              maxLength="255"
            />
            {errors.patient_name && touched.patient_name && (
              <span className="error-message">{errors.patient_name}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="patient_email">
              Email Address <span className="optional">(Optional)</span>
            </label>
            <input
              type="email"
              id="patient_email"
              name="patient_email"
              value={formData.patient_email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_email && touched.patient_email ? 'error' : ''}
              placeholder="patient@example.com"
            />
            {errors.patient_email && touched.patient_email && (
              <span className="error-message">{errors.patient_email}</span>
            )}
          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="patient_age">
              Age <span className="required">*</span>
            </label>
            <input
              type="number"
              id="patient_age"
              name="patient_age"
              value={formData.patient_age}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_age && touched.patient_age ? 'error' : ''}
              placeholder="Enter age"
              min="0"
              max="120"
            />
            {errors.patient_age && touched.patient_age && (
              <span className="error-message">{errors.patient_age}</span>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="patient_gender">
              Gender <span className="required">*</span>
            </label>
            <select
              id="patient_gender"
              name="patient_gender"
              value={formData.patient_gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_gender && touched.patient_gender ? 'error' : ''}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.patient_gender && touched.patient_gender && (
              <span className="error-message">{errors.patient_gender}</span>
            )}
          </div>

          {/* Blood Group */}
          <div className="form-group">
            <label htmlFor="patient_blood_group">
              Blood Group <span className="required">*</span>
            </label>
            <select
              id="patient_blood_group"
              name="patient_blood_group"
              value={formData.patient_blood_group}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_blood_group && touched.patient_blood_group ? 'error' : ''}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.patient_blood_group && touched.patient_blood_group && (
              <span className="error-message">{errors.patient_blood_group}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="patient_phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="patient_phone"
              name="patient_phone"
              value={formData.patient_phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_phone && touched.patient_phone ? 'error' : ''}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.patient_phone && touched.patient_phone && (
              <span className="error-message">{errors.patient_phone}</span>
            )}
          </div>

          {/* Address */}
          <div className="form-group full-width">
            <label htmlFor="patient_address">
              Address <span className="required">*</span>
            </label>
            <textarea
              id="patient_address"
              name="patient_address"
              value={formData.patient_address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_address && touched.patient_address ? 'error' : ''}
              placeholder="Enter complete address"
              rows="3"
            />
            {errors.patient_address && touched.patient_address && (
              <span className="error-message">{errors.patient_address}</span>
            )}
          </div>

          {/* Registration Date */}
          <div className="form-group">
            <label htmlFor="patient_reg_date">
              Registration Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="patient_reg_date"
              name="patient_reg_date"
              value={formData.patient_reg_date}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.patient_reg_date && touched.patient_reg_date ? 'error' : ''}
            />
            {errors.patient_reg_date && touched.patient_reg_date && (
              <span className="error-message">{errors.patient_reg_date}</span>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/manage-patients')}
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
                  Adding Patient...
                </>
              ) : (
                'Add Patient'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer1 />
    </div>
  );
};

export default AddPatient;
