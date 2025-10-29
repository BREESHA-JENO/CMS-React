import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAECases } from '../../../Service/ae_api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchAECase.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const SearchAECase = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const params = new URLSearchParams();
      params.append('query', searchTerm.trim());
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

// Change search endpoint to:
      const response = await searchAECases({ query: searchTerm.trim(), status: statusFilter === 'all' ? undefined : statusFilter });
      setResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search cases. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSearched(false);
    setError('');
    setStatusFilter('all');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'badge-danger' : 'badge-success';
  };

  return (
    <div className={`search-ae-case-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="search-ae-case-container">
        <div className="search-ae-case-content">
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
            <span className="breadcrumb-current">Search Case</span>
          </div>

          {/* Page Header */}
          <div className="search-header">
            <div className="header-icon">
              <i className="fas fa-search"></i>
            </div>
            <div className="header-text">
              <h1>Search A&E Cases</h1>
              <p>Find cases by case code, patient name, or phone number</p>
            </div>
          </div>

          {/* Search Form */}
          <div className="search-form-card">
            <form onSubmit={handleSearch}>
              <div className="search-input-group">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Enter case code, patient name, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-btn"
                      onClick={handleClearSearch}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                <div className="filter-group">
                  <label>Status:</label>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Cases</option>
                    <option value="active">Active Only</option>
                    <option value="closed">Closed Only</option>
                  </select>
                </div>

                <button type="submit" className="search-btn" disabled={loading}>
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
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Search Results */}
          {searched && !loading && (
            <div className="search-results">
              <div className="results-header">
                <h3>
                  {results.length > 0 
                    ? `Found ${results.length} case${results.length !== 1 ? 's' : ''}`
                    : 'No cases found'
                  }
                </h3>
                {results.length > 0 && (
                  <span className="results-count">
                    Showing results for "{searchTerm}"
                  </span>
                )}
              </div>

              {results.length > 0 ? (
                <div className="results-grid">
                  {results.map((caseItem) => (
                    <div key={caseItem.case_id} className="result-card">
                      <div className="card-header-section">
                        <div className="case-code-badge">
                          <i className="fas fa-file-medical me-2"></i>
                          {caseItem.case_code}
                        </div>
                        <span className={`status-badge ${getStatusBadge(caseItem.case_status)}`}>
                          {caseItem.case_status}
                        </span>
                      </div>

                      <div className="card-body-section">
                        <div className="info-row">
                          <i className="fas fa-user"></i>
                          <span className="label">Patient:</span>
                          <span className="value">{caseItem.patient_name || 'Unknown'}</span>
                        </div>

                        {caseItem.patient_phone && (
                          <div className="info-row">
                            <i className="fas fa-phone"></i>
                            <span className="label">Phone:</span>
                            <span className="value">{caseItem.patient_phone}</span>
                          </div>
                        )}

                        <div className="info-row">
                          <i className="fas fa-calendar"></i>
                          <span className="label">Created:</span>
                          <span className="value">{formatDate(caseItem.created_at)}</span>
                        </div>

                        {caseItem.chief_complaint && (
                          <div className="info-row full-width">
                            <i className="fas fa-notes-medical"></i>
                            <span className="label">Complaint:</span>
                            <span className="value complaint-text">{caseItem.chief_complaint}</span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer-section">
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/ae-module/view-ae-case/${caseItem.case_id}`)}
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <h3>No Results Found</h3>
                  <p>No cases match your search criteria</p>
                  <p className="empty-hint">
                    Try searching with a different case code, patient name, or phone number
                  </p>
                  <button className="btn btn-primary" onClick={handleClearSearch}>
                    <i className="fas fa-redo me-2"></i>
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Initial State (Before Search) */}
          {!searched && !loading && (
            <div className="initial-state">
              <i className="fas fa-search"></i>
              <h3>Start Searching</h3>
              <p>Enter a case code, patient name, or phone number to find A&E cases</p>
              <div className="search-tips">
                <h4>Search Tips:</h4>
                <ul>
                  <li>Search by full or partial case code (e.g., "CASE-2025-001")</li>
                  <li>Search by patient's first name or last name</li>
                  <li>Search by patient's phone number</li>
                  <li>Use the status filter to narrow results</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default SearchAECase;
