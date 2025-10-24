// src/components/Receptionist/SelectPatientEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaSearch } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI } from '../../Service/recep_api';
import './SelectPatientEdit.css';

const SelectPatientEdit = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

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

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_phone.includes(searchTerm)
  );

  const handleSelectPatient = (patientId) => {
    navigate(`/edit-patient/${patientId}`);
  };

  return (
    <div className={`select-patient-container${darkMode ? ' dark' : ''}`}>
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

      <div className="select-patient-content">
        <div className="select-header">
          <FaEdit className="select-icon" />
          <h1>Select Patient to Edit</h1>
          <p>Choose a patient from the list below</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Patients Found</h3>
            <p>{searchTerm ? 'No patients match your search' : 'No patients in system'}</p>
          </div>
        ) : (
          <div className="patient-cards-grid">
            {filteredPatients.map((patient) => (
              <div
                key={patient.patient_auto_id}
                className="patient-card"
                onClick={() => handleSelectPatient(patient.patient_auto_id)}
              >
                <div className="card-header">
                  <h3>{patient.patient_name}</h3>
                  <span className="patient-badge">{patient.patient_id}</span>
                </div>
                <div className="card-body">
                  <p><strong>Phone:</strong> {patient.patient_phone}</p>
                  <p><strong>Age:</strong> {patient.patient_age} years</p>
                  <p><strong>Blood Group:</strong> <span className="blood-badge">{patient.patient_blood_group}</span></p>
                </div>
                <button className="edit-btn">
                  <FaEdit /> Edit Patient
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default SelectPatientEdit;
