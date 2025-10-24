// src/components/Receptionist/PatientList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI } from '../../Service/recep_api';
import './PatientList.css';

const PatientList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Failed to load patients. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_phone.includes(searchTerm)
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Handle edit
  const handleEdit = (patientId) => {
    navigate(`/edit-patient/${patientId}`);
  };

  // Handle view details
  const handleView = (patient) => {
    // You can create a modal or details page
    toast.info(`Viewing details for ${patient.patient_name}`, {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  return (
    <div className={`patient-list-container${darkMode ? ' dark' : ''}`}>
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

      <div className="patient-list-content">
        <div className="list-header">
          <div className="header-left">
            <h1>Patient List</h1>
            <p>Total Patients: <strong>{filteredPatients.length}</strong></p>
          </div>
          <div className="header-right">
            <button 
              className="btn-add"
              onClick={() => navigate('/add-patient')}
            >
              + Add New Patient
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Patients Found</h3>
            <p>
              {searchTerm
                ? 'No patients match your search criteria'
                : 'Start by adding your first patient'}
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate('/add-patient')}
            >
              Add First Patient
            </button>
          </div>
        ) : (
          /* Patient Table */
          <div className="table-container">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.patient_auto_id}>
                    <td className="patient-id">{patient.patient_id}</td>
                    <td className="patient-name">{patient.patient_name}</td>
                    <td>{patient.patient_age}</td>
                    <td>{patient.patient_gender}</td>
                    <td>
                      <span className="blood-group-badge">
                        {patient.patient_blood_group}
                      </span>
                    </td>
                    <td>{patient.patient_phone}</td>
                    <td className="email-cell">
                      {patient.patient_email || 'N/A'}
                    </td>
                    <td>{formatDate(patient.patient_reg_date)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleView(patient)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(patient.patient_auto_id)}
                        title="Edit Patient"
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

      <Footer1 />
    </div>
  );
};

export default PatientList;
