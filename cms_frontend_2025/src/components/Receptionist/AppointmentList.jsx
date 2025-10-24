// src/components/Receptionist/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaClock } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { appointmentAPI } from '../../Service/recep_api';
import './AppointmentList.css';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(apt => apt.appoinment_status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.appointment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/edit-appointment/${id}`);
  };

  const handleCancel = async (appointment) => {
    if (window.confirm(`Cancel appointment ${appointment.appointment_id}?`)) {
      try {
        await appointmentAPI.updateStatus(appointment.appointment_auto_id, 'Cancelled');
        toast.success('Appointment cancelled successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment', {
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

  const formatTime = (timeString) => {
    return timeString; // Already in HH:MM format
  };

  return (
    <div className={`appointment-list-container${darkMode ? ' dark' : ''}`}>
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

      <div className="appointment-list-content">
        <div className="list-header">
          <div className="header-text">
            <h1>All Appointments</h1>
            <p>View and manage all scheduled appointments</p>
          </div>
          <button
            className="btn-add-new"
            onClick={() => navigate('/add-appointment')}
          >
            + Schedule New Appointment
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Appointment ID, Patient, or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="results-count">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
        </div>

        {/* Appointments Table */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="no-data">
            <FaCalendarAlt className="no-data-icon" />
            <h3>No Appointments Found</h3>
            <p>No appointments match your search criteria</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.appointment_auto_id}>
                    <td className="appointment-id">{appointment.appointment_id}</td>
                    <td className="patient-name">{appointment.patient_name || 'N/A'}</td>
                    <td className="doctor-name">{appointment.doctor_name || 'N/A'}</td>
                    <td>
                      <span className="date-display">
                        <FaCalendarAlt className="icon" />
                        {formatDate(appointment.appoinment_date)}
                      </span>
                    </td>
                    <td>
                      <span className="time-display">
                        <FaClock className="icon" />
                        {formatTime(appointment.appoinment_time)}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.appoinment_status)}</td>
                    <td className="actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(appointment.appointment_auto_id)}
                        title="Edit Appointment"
                      >
                        <FaEdit />
                      </button>
                      {appointment.appoinment_status !== 'Cancelled' && (
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleCancel(appointment)}
                          title="Cancel Appointment"
                        >
                          <FaTrash />
                        </button>
                      )}
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

export default AppointmentList;
