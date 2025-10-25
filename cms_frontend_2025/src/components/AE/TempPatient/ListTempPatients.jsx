import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListTempPatients.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ListTempPatients = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchQuery, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/ae/temp-patient/list/');
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...patients];

    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.temp_patient_code.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        (p.emergency_contact && p.emergency_contact.includes(query))
      );
    }

    setFilteredPatients(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Merged':
        return 'primary';
      case 'Deceased':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (id) => {
    navigate(`/ae-module/view-temp-patient/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/ae-module/update-temp-patient/${id}`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`list-temp-patients-wrapper ${darkMode ? 'dark' : ''}`}>
      <Header1
        onSidebarToggle={handleSidebarToggle}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={[]}
      />

      <Sidebar
        open={sidebarOpen}
        role={role}
        onClose={handleCloseSidebar}
      />

      <div className="list-temp-patients-container">
        <div className="list-temp-patients-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module')}
            >
              <i className="fas fa-chevron-left"></i>
              <span>A&E Module</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              className="breadcrumb-back"
              onClick={() => navigate('/ae-module/temp-patient-menu')}
            >
              <span>Temp Patient Menu</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">List Temp Patients</span>
          </div>

          <div className="list-header">
            <div className="header-text">
              <h1>
                <i className="fas fa-list me-3"></i>
                Temporary Patients
              </h1>
              <p>View and manage all temporary patients</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/ae-module/add-temp-patient')}
            >
              <i className="fas fa-plus me-2"></i>
              Add New
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <div className="filters-card">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-search me-2"></i>
                  Search
                </label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search by code, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-filter me-2"></i>
                  Status
                </label>
                <select
                  className="filter-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Merged">Merged</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">&nbsp;</label>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear
                </button>
              </div>
            </div>

            <div className="results-info">
              <i className="fas fa-info-circle me-2"></i>
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading patients...</p>
            </div>
          )}

          {!loading && filteredPatients.length > 0 && (
            <div className="table-card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient Code</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.temp_patient_id}>
                        <td className="code-cell">{patient.temp_patient_code}</td>
                        <td className="name-cell">{patient.name}</td>
                        <td>{patient.approx_age || 'N/A'}</td>
                        <td>{patient.gender || 'N/A'}</td>
                        <td>{patient.emergency_contact || 'N/A'}</td>
                        <td>
                          <span className={`badge badge-${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="date-cell">{formatDate(patient.created_at)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-view"
                              onClick={() => handleView(patient.temp_patient_id)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {patient.status === 'Active' && (
                              <button
                                className="btn-action btn-edit"
                                onClick={() => handleUpdate(patient.temp_patient_id)}
                                title="Update Patient"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && filteredPatients.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No Patients Found</h3>
              <p>
                {searchQuery || statusFilter
                  ? 'Try adjusting your filters'
                  : 'No temporary patients registered yet'}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/ae-module/add-temp-patient')}
              >
                <i className="fas fa-plus me-2"></i>
                Add First Patient
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ListTempPatients;
