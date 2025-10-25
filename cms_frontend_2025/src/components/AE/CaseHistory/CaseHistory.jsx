import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../Utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CaseHistory.css';
import Header1 from '../../../Elements/Header1';
import Footer1 from '../../../Elements/Footer1';
import Sidebar from '../../../Elements/Sidebar';

const CaseHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'REC';

  // State management
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'closed'
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const casesPerPage = 10;

  // Read filter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter') || 'all';
    setFilter(filterParam);
  }, [location]);

  // Fetch cases when filter or page changes
  useEffect(() => {
    fetchCases();
  }, [filter, currentPage]);

  const fetchCases = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      
      if (filter !== 'all') {
        params.append('status', filter === 'active' ? 'Active' : 'Closed');
      }
      const response = await api.get(`/ae/case/?page=${currentPage}&status=${filter}`);

       // const response = await api.get(`/ae/case/?page=${currentPage}`);      
      // Handle both paginated and non-paginated responses
      if (response.data.results) {
        setCases(response.data.results);
        setTotalCases(response.data.count);
        setTotalPages(Math.ceil(response.data.count / casesPerPage));
      } else {
        setCases(response.data);
        setTotalCases(response.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('Failed to load case history. Please try again.');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    // Update URL without page reload
    navigate(`/ae-module/case-history?filter=${newFilter}`, { replace: true });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Filter cases based on search term
  const filteredCases = cases.filter((caseItem) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      caseItem.case_code?.toLowerCase().includes(searchLower) ||
      caseItem.patient_name?.toLowerCase().includes(searchLower) ||
      caseItem.patient_phone?.includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'badge-danger' : 'badge-success';
  };

  const getCaseCounts = () => {
    const allCount = totalCases;
    const activeCount = cases.filter(c => c.case_status === 'Active').length;
    const closedCount = cases.filter(c => c.case_status === 'Closed').length;
    return { allCount, activeCount, closedCount };
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading && cases.length === 0) {
    return (
      <div className={`case-history-wrapper ${darkMode ? 'dark' : ''}`}>
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

        <div className="case-history-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading case history...</p>
          </div>
        </div>

        <Footer1 />
      </div>
    );
  }

  const counts = getCaseCounts();

  return (
    <div className={`case-history-wrapper ${darkMode ? 'dark' : ''}`}>
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

      <div className="case-history-container">
        <div className="case-history-content">
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
            <span className="breadcrumb-current">Case History</span>
          </div>

          {/* Page Header */}
          <div className="history-header">
            <div className="header-icon">
              <i className="fas fa-history"></i>
            </div>
            <div className="header-text">
              <h1>A&E Case History</h1>
              <p>Complete record of all accident & emergency cases</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <i className="fas fa-clipboard-list me-2"></i>
              All Cases
              <span className="tab-count">{totalCases}</span>
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              <i className="fas fa-heartbeat me-2"></i>
              Active
              <span className="tab-count">{counts.activeCount}</span>
            </button>
            <button
              className={`filter-tab ${filter === 'closed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('closed')}
            >
              <i className="fas fa-check-circle me-2"></i>
              Closed
              <span className="tab-count">{counts.closedCount}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by case code, patient name, or phone..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Cases Table */}
          {filteredCases.length > 0 ? (
            <>
              <div className="table-container">
                <table className="cases-table">
                  <thead>
                    <tr>
                      <th>Case Code</th>
                      <th>Patient Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem.case_id}>
                        <td className="case-code-cell">
                          <i className="fas fa-file-medical me-2"></i>
                          {caseItem.case_code}
                        </td>
                        <td className="patient-name-cell">
                          {caseItem.patient_name || 'Unknown'}
                        </td>
                        <td>{caseItem.patient_phone || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(caseItem.case_status)}`}>
                            {caseItem.case_status}
                          </span>
                        </td>
                        <td>{formatDate(caseItem.created_at)}</td>
                        <td>{formatTime(caseItem.created_at)}</td>
                        <td className="actions-cell">
                          <button
                            className="action-btn view-btn"
                            onClick={() => navigate(`/ae-module/view-ae-case/${caseItem.case_id}`)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {caseItem.case_status === 'Active' && (
                            <button
                              className="action-btn edit-btn"
                              onClick={() => navigate(`/ae-module/update-ae-case/${caseItem.case_id}`)}
                              title="Update Case"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                  </button>
                  
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                    <span className="total-records">
                      ({filteredCases.length} of {totalCases} cases)
                    </span>
                  </span>

                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-chevron-right ms-2"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <h3>No Cases Found</h3>
              <p>
                {searchTerm 
                  ? `No cases match your search "${searchTerm}"`
                  : filter === 'active'
                  ? 'No active cases at the moment'
                  : filter === 'closed'
                  ? 'No closed cases found'
                  : 'No cases have been registered yet'
                }
              </p>
              {searchTerm && (
                <button className="btn btn-primary" onClick={() => setSearchTerm('')}>
                  <i className="fas fa-times me-2"></i>
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default CaseHistory;
