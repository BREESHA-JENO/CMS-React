// src/components/Receptionist/DeletePatient.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI } from '../../Service/recep_api';
import './DeletePatients.css';

const DeletePatient = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_phone.includes(searchTerm)
  );

  // Handle patient selection
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowConfirmModal(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedPatient) return;

    setDeleting(true);

    try {
      // Option 1: Soft delete (disable patient)
      await patientAPI.disable(selectedPatient.patient_auto_id);
      
      // Option 2: Hard delete (uncomment if you want permanent deletion)
      // await axios.delete(`http://localhost:8000/api/receptionist/patients/${selectedPatient.patient_auto_id}/`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      // });

      toast.success(`Patient ${selectedPatient.patient_id} has been disabled successfully!`, {
        position: 'top-center',
        autoClose: 3000,
      });

      // Refresh patient list
      await fetchPatients();
      
      // Close modal and reset
      setShowConfirmModal(false);
      setSelectedPatient(null);

    } catch (error) {
      console.error('Error deleting patient:', error);
      
      let errorMessage = 'Failed to delete patient. ';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          errorMessage += Object.values(errorData).flat().join(', ');
        } else {
          errorMessage += errorData;
        }
      } else {
        errorMessage += 'Please try again.';
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setDeleting(false);
    }
  };

  // Handle cancel
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedPatient(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className={`delete-patient-container${darkMode ? ' dark' : ''}`}>
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

      <div className="delete-patient-content">
        <div className="delete-header">
          <FaTrash className="delete-icon" />
          <h1>Delete Patient</h1>
          <p>Select a patient to disable from the system</p>
          <div className="warning-note">
            <FaExclamationTriangle />
            <span>Warning: This action will mark the patient as inactive</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Patients Found</h3>
            <p>
              {searchTerm
                ? 'No patients match your search criteria'
                : 'No patients available in the system'}
            </p>
          </div>
        ) : (
          <div className="patient-cards-grid">
            {filteredPatients.map((patient) => (
              <div key={patient.patient_auto_id} className="patient-card">
                <div className="patient-card-header">
                  <h3>{patient.patient_name}</h3>
                  <span className="patient-id-badge">{patient.patient_id}</span>
                </div>

                <div className="patient-card-body">
                  <div className="patient-info-row">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{patient.patient_age} years</span>
                  </div>

                  <div className="patient-info-row">
                    <span className="info-label">Gender:</span>
                    <span className="info-value">{patient.patient_gender}</span>
                  </div>

                  <div className="patient-info-row">
                    <span className="info-label">Blood Group:</span>
                    <span className="blood-badge">{patient.patient_blood_group}</span>
                  </div>

                  <div className="patient-info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{patient.patient_phone}</span>
                  </div>

                  <div className="patient-info-row">
                    <span className="info-label">Registered:</span>
                    <span className="info-value">{formatDate(patient.patient_reg_date)}</span>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <FaTrash />
                  Delete Patient
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPatient && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h2>Confirm Delete</h2>
            </div>

            <div className="modal-body">
              <p className="confirm-message">
                Are you sure you want to delete this patient?
              </p>

              <div className="patient-details">
                <div className="detail-row">
                  <strong>Patient ID:</strong>
                  <span>{selectedPatient.patient_id}</span>
                </div>
                <div className="detail-row">
                  <strong>Name:</strong>
                  <span>{selectedPatient.patient_name}</span>
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{selectedPatient.patient_phone}</span>
                </div>
                <div className="detail-row">
                  <strong>Age:</strong>
                  <span>{selectedPatient.patient_age} years</span>
                </div>
              </div>

              <div className="warning-box">
                <p>⚠️ This action will mark the patient as inactive.</p>
                <p>The patient record will no longer appear in active lists.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer1 />
    </div>
  );
};

export default DeletePatient;
