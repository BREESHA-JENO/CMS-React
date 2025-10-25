import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListAECase.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const ListAECases = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    status: '',
    patientType: '',
    triageCategory: '',
    searchQuery: ''
  });

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cases]);

  const fetchCases = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/ae/case/');
      setCases(response.data);
      setFilteredCases(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cases];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(c => c.case_status === filters.status);
    }

    // Patient type filter
    if (filters.patientType) {
      filtered = filtered.filter(c => c.patient_type === filters.patientType);
    }

    // Triage category filter
    if (filters.triageCategory) {
      filtered = filtered.filter(c => c.triage_category === filters.triageCategory);
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.case_code.toLowerCase().includes(query) ||
        c.patient_name?.toLowerCase().includes(query) ||
        c.chief_complaint.toLowerCase().includes(query)
      );
    }

    setFilteredCases(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      patientType: '',
      triageCategory: '',
      searchQuery: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'danger';
      case 'Under Treatment':
        return 'warning';
      case 'Discharged':
        return 'success';
      case 'Admitted':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getTriageColor = (triage) => {
    switch (triage) {
      case 'Red':
        return '#dc3545';
      case 'Orange':
        return '#fd7e14';
      case 'Yellow':
        return '#ffc107';
      case 'Green':
        return '#28a745';
      case 'Blue':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const formatDateTime = (dateString) => {
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
    navigate(`/ae-module/view-ae-case/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/ae-module/update-ae-case/${id}`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`list-ae-cases-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="list-ae-cases-container">
        <div className="list-ae-cases-content">
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
              onClick={() => navigate('/ae-module/ae-case-menu')}
            >
              <span>A&E Case Menu</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Active Cases</span>
          </div>

          <div className="list-header">
            <div className="header-text">
              <h1>
                <i className="fas fa-heartbeat me-3"></i>
                A&E Cases
              </h1>
              <p>View and manage all accident & emergency cases</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/ae-module/add-ae-case')}
            >
              <i className="fas fa-plus me-2"></i>
              Register New Case
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Filters Card */}
          <div className="filters-card">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-search me-2"></i>
                  Search
                </label>
                <input
                  type="text"
                  name="searchQuery"
                  className="filter-input"
                  placeholder="Search by case code, patient, complaint..."
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-info-circle me-2"></i>
                  Status
                </label>
                <select
                  name="status"
                  className="filter-input"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-user me-2"></i>
                  Patient Type
                </label>
                <select
                  name="patientType"
                  className="filter-input"
                  value={filters.patientType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Triage
                </label>
                <select
                  name="triageCategory"
                  className="filter-input"
                  value={filters.triageCategory}
                  onChange={handleFilterChange}
                >
                  <option value="">All Triage</option>
                  <option value="Red">Red - Immediate</option>
                  <option value="Orange">Orange - Very Urgent</option>
                  <option value="Yellow">Yellow - Urgent</option>
                  <option value="Green">Green - Standard</option>
                  <option value="Blue">Blue - Non-Urgent</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <div className="results-info">
                <i className="fas fa-info-circle me-2"></i>
                Showing {filteredCases.length} of {cases.length} cases
              </div>
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                <i className="fas fa-times me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading cases...</p>
            </div>
          )}

          {!loading && filteredCases.length > 0 && (
            <div className="table-card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Case Code</th>
                      <th>Patient</th>
                      <th>Type</th>
                      <th>Triage</th>
                      <th>Chief Complaint</th>
                      <th>Arrival Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem.case_id}>
                        <td className="code-cell">{caseItem.case_code}</td>
                        <td className="name-cell">
                          {caseItem.patient_name || 'Unknown Patient'}
                        </td>
                        <td>
                          <span className={`badge badge-${caseItem.patient_type === 'Permanent' ? 'primary' : 'warning'}`}>
                            {caseItem.patient_type}
                          </span>
                        </td>
                        <td>
                          {caseItem.triage_category ? (
                            <span 
                              className="triage-badge"
                              style={{ backgroundColor: getTriageColor(caseItem.triage_category) }}
                            >
                              {caseItem.triage_category}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="complaint-cell">
                          {caseItem.chief_complaint.substring(0, 40)}
                          {caseItem.chief_complaint.length > 40 ? '...' : ''}
                        </td>
                        <td className="date-cell">
                          {formatDateTime(caseItem.arrival_time)}
                        </td>
                        <td>
                          <span className={`badge badge-${getStatusColor(caseItem.case_status)}`}>
                            {caseItem.case_status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-view"
                              onClick={() => handleView(caseItem.case_id)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {caseItem.case_status === 'Active' && (
                              <button
                                className="btn-action btn-edit"
                                onClick={() => handleUpdate(caseItem.case_id)}
                                title="Update Case"
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

          {!loading && filteredCases.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No Cases Found</h3>
              <p>
                {filters.searchQuery || filters.status || filters.patientType || filters.triageCategory
                  ? 'Try adjusting your filters'
                  : 'No A&E cases registered yet'}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/ae-module/add-ae-case')}
              >
                <i className="fas fa-plus me-2"></i>
                Register First Case
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ListAECases;
