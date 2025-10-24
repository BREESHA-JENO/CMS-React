// src/components/Receptionist/AppointmentSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaCalendarAlt, FaClock, FaEdit, FaUndo, FaUser, FaUserMd } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { appointmentAPI, patientAPI, staffAPI } from '../../Service/recep_api';
import './AppointmentsSearch.css';

const AppointmentSearch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState(''); // 'patient' or 'doctor'

  // Store selected patient/doctor info
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const [searchFilters, setSearchFilters] = useState({
    patientId: '',
    doctorId: '',
  });

  // Fetch patients and doctors for dropdowns
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

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
    console.log('Fetching doctors...'); // DEBUG
    const doctorsList = await staffAPI.getDoctors();
    console.log('Doctors received:', doctorsList); // DEBUG
    setDoctors(doctorsList);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    toast.error('Failed to load doctors', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the other field when one is selected
    if (name === 'patientId' && value) {
      setSearchFilters({ patientId: value, doctorId: '' });
    } else if (name === 'doctorId' && value) {
      setSearchFilters({ patientId: '', doctorId: value });
    } else {
      setSearchFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async () => {
  // Validate exactly one filter is selected
  if (!searchFilters.patientId && !searchFilters.doctorId) {
    toast.warning('Please enter a Patient ID or select a Doctor', {
      position: 'top-right',
      autoClose: 3000,
    });
    return;
  }

  setSearching(true);
  setHasSearched(true);

  try {
    const response = await appointmentAPI.getAll();
    console.log('All appointments:', response.data); // DEBUG LOG
    
    let results = response.data;

    // Search by Patient ID
    if (searchFilters.patientId) {
      setSearchType('patient');
      
      // Find patient details
      const patient = patients.find(p => 
        p.patient_id.toUpperCase() === searchFilters.patientId.toUpperCase()
      );

      console.log('Found patient:', patient); // DEBUG LOG

      if (!patient) {
        toast.error('Patient not found', {
          position: 'top-right',
          autoClose: 3000,
        });
        setSearchResults([]);
        setSelectedPatient(null);
        setSearching(false);
        return;
      }

      setSelectedPatient(patient);

      // Filter appointments by patient - check multiple possible structures
      results = results.filter(apt => {
        console.log('Checking appointment:', apt); // DEBUG LOG
        
        // Check different possible structures
        if (apt.patient_id?.patient_id) {
          return apt.patient_id.patient_id === searchFilters.patientId.toUpperCase();
        } else if (apt.patient_code) {
          return apt.patient_code === searchFilters.patientId.toUpperCase();
        } else if (typeof apt.patient_id === 'string') {
          return apt.patient_id === searchFilters.patientId.toUpperCase();
        }
        return false;
      });

      console.log('Filtered results:', results); // DEBUG LOG
    }
    // Search by Doctor
    else if (searchFilters.doctorId) {
      setSearchType('doctor');
      
      // Find doctor details
      const doctor = doctors.find(d => d.id === parseInt(searchFilters.doctorId));
      console.log('Found doctor:', doctor); // DEBUG LOG
      setSelectedDoctor(doctor);

      // Filter appointments by doctor - check if staff is ID or object
      results = results.filter(apt => {
        if (typeof apt.staff === 'number') {
          return apt.staff === parseInt(searchFilters.doctorId);
        } else if (apt.staff?.id) {
          return apt.staff.id === parseInt(searchFilters.doctorId);
        }
        return false;
      });

      console.log('Filtered results:', results); // DEBUG LOG
    }

    setSearchResults(results);

    if (results.length === 0) {
      toast.info('No appointments found', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.success(`Found ${results.length} appointment(s)`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }

  } catch (error) {
    console.error('Error searching appointments:', error);
    toast.error('Failed to search appointments', {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setSearching(false);
  }
};

  const handleReset = () => {
    setSearchFilters({
      patientId: '',
      doctorId: '',
    });
    setSearchResults([]);
    setHasSearched(false);
    setSearchType('');
    setSelectedPatient(null);
    setSelectedDoctor(null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-appointment/${id}`);
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
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '0.85rem',
        }}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`appointment-search-container${darkMode ? ' dark' : ''}`}>
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

      <div className="appointment-search-content">
        <div className="search-header">
          <h1>Search Appointments</h1>
          <p>Search by Patient ID or Doctor Name</p>
        </div>

        {/* Search Filters */}
        <div className="search-filters-card">
          <h3>Search By</h3>
          
          <div className="search-options">
            {/* Patient ID Search */}
            <div className="search-option">
              <label htmlFor="patientId">
                <FaUser /> Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                placeholder="Enter Patient ID (e.g., PAT001)"
                value={searchFilters.patientId}
                onChange={handleFilterChange}
                disabled={searchFilters.doctorId !== ''}
              />
              <small>Search appointments for a specific patient</small>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Doctor Search */}
            <div className="search-option">
              <label htmlFor="doctorId">
                <FaUserMd /> Doctor Name
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={searchFilters.doctorId}
                onChange={handleFilterChange}
                disabled={searchFilters.patientId !== ''}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.department || 'General'}
                  </option>
                ))}
              </select>
              <small>View all appointments for a doctor</small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button
              className="btn-reset"
              onClick={handleReset}
              disabled={searching}
            >
              <FaUndo /> Reset
            </button>
            <button
              className="btn-search"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <>
                  <span className="spinner-small"></span>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch /> Search Appointments
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="search-results-section">
            {/* Patient Details Header (for patient search) */}
            {searchType === 'patient' && selectedPatient && (
              <div className="info-header patient-header">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-details">
                  <h3>{selectedPatient.patient_name} ({selectedPatient.patient_id})</h3>
                  <div className="info-meta">
                    <span><strong>Phone:</strong> {selectedPatient.patient_phone}</span>
                    <span><strong>Age:</strong> {selectedPatient.patient_age} years</span>
                    <span><strong>Gender:</strong> {selectedPatient.patient_gender}</span>
                    <span><strong>Blood Group:</strong> {selectedPatient.patient_blood_group}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Details Header (for doctor search) */}
            {searchType === 'doctor' && selectedDoctor && (
              <div className="info-header doctor-header">
                <div className="info-icon">
                  <FaUserMd />
                </div>
                <div className="info-details">
                  <h3>Dr. {selectedDoctor.name} ({selectedDoctor.staff_id})</h3>
                  <div className="info-meta">
                    <span><strong>Department:</strong> {selectedDoctor.department || 'General'}</span>
                    <span><strong>Phone:</strong> {selectedDoctor.phone_number}</span>
                    <span><strong>Email:</strong> {selectedDoctor.email}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="results-header">
              <h3>Appointments</h3>
              <span className="results-count">
                {searchResults.length} appointment(s) found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h4>No Appointments Found</h4>
                <p>No appointments scheduled for this {searchType}</p>
              </div>
            ) : (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      {searchType === 'patient' ? (
                        <>
                          <th>Doctor Name</th>
                          <th>Department</th>
                        </>
                      ) : (
                        <>
                          <th>Patient Name</th>
                          <th>Patient ID</th>
                          <th>Phone</th>
                        </>
                      )}
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((appointment) => (
                      <tr key={appointment.appointment_auto_id}>
                        <td className="appointment-id">{appointment.appointment_id}</td>
                        
                        {searchType === 'patient' ? (
                          <>
                            <td>{appointment.doctor_name || 'N/A'}</td>
                            <td>Cardiology</td>
                          </>
                        ) : (
                          <>
                            <td>{appointment.patient_name || 'N/A'}</td>
                            <td>{appointment.patient_id?.patient_id || 'N/A'}</td>
                            <td>{appointment.patient_id?.patient_phone || 'N/A'}</td>
                          </>
                        )}
                        
                        <td>
                          <span className="date-display">
                            <FaCalendarAlt className="icon" />
                            {formatDate(appointment.appoinment_date)}
                          </span>
                        </td>
                        <td>
                          <span className="time-display">
                            <FaClock className="icon" />
                            {appointment.appoinment_time}
                          </span>
                        </td>
                        <td>{getStatusBadge(appointment.appoinment_status)}</td>
                        <td>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(appointment.appointment_auto_id)}
                            title="Edit Appointment"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default AppointmentSearch;
