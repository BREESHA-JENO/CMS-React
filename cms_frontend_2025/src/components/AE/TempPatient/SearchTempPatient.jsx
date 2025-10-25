import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchTempPatients.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const SearchTempPatient = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await api.get(`/ae/temp-patient/list/?search=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearched(false);
    setError('');
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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`search-temp-patient-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="search-temp-patient-container">
        <div className="search-temp-patient-content">
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
            <span className="breadcrumb-current">Search Temp Patient</span>
          </div>

          <div className="search-header">
            <h1>
              <i className="fas fa-search me-3"></i>
              Search Temporary Patient
            </h1>
            <p>Find patients by code, name, or contact number</p>
          </div>

          <div className="search-card">
            <form onSubmit={handleSearch}>
              <div className="search-input-group">
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter patient code (e.g., TP001), name, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={handleClear}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="search-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Search
                    </>
                  )}
                </button>

                {searched && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClear}
                  >
                    <i className="fas fa-redo me-2"></i>
                    New Search
                  </button>
                )}
              </div>
            </form>

            {!searched && (
              <div className="search-tips">
                <h4>
                  <i className="fas fa-lightbulb me-2"></i>
                  Search Tips:
                </h4>
                <ul>
                  <li>Search by patient code (e.g., TP001, TP002)</li>
                  <li>Search by name (partial names work too)</li>
                  <li>Search by emergency contact phone number</li>
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {searched && !loading && (
            <>
              {searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    <i className="fas fa-check-circle me-2"></i>
                    Found {searchResults.length} patient{searchResults.length !== 1 ? 's' : ''}
                  </div>

                  <div className="results-grid">
                    {searchResults.map((patient) => (
                      <div key={patient.temp_patient_id} className="patient-result-card">
                        <div className="card-header-section">
                          <div className="patient-code">{patient.temp_patient_code}</div>
                          <span className={`badge badge-${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </div>

                        <div className="patient-info">
                          <div className="info-row">
                            <i className="fas fa-user info-icon"></i>
                            <div>
                              <label>Name</label>
                              <span>{patient.name}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <i className="fas fa-birthday-cake info-icon"></i>
                            <div>
                              <label>Age</label>
                              <span>{patient.approx_age || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <i className="fas fa-venus-mars info-icon"></i>
                            <div>
                              <label>Gender</label>
                              <span>{patient.gender || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <i className="fas fa-phone info-icon"></i>
                            <div>
                              <label>Contact</label>
                              <span>{patient.emergency_contact || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="info-row">
                            <i className="fas fa-clock info-icon"></i>
                            <div>
                              <label>Registered</label>
                              <span className="date-text">{formatDate(patient.created_at)}</span>
                            </div>
                          </div>

                          {patient.description && (
                            <div className="description-row">
                              <i className="fas fa-file-medical info-icon"></i>
                              <div>
                                <label>Description</label>
                                <p>{patient.description}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          className="btn btn-view"
                          onClick={() => handleView(patient.temp_patient_id)}
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Full Details
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No Patients Found</h3>
                  <p>No temporary patients match your search: "{searchQuery}"</p>
                  <button className="btn btn-primary" onClick={handleClear}>
                    <i className="fas fa-redo me-2"></i>
                    Try Another Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default SearchTempPatient;
