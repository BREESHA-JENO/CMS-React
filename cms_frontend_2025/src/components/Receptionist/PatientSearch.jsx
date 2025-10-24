// src/components/Receptionist/PatientSearch.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaUser, FaPhone } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { patientAPI } from '../../Service/recep_api';
import './PatientSearch.css';

const PatientSearch = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchType, setSearchType] = useState('patient_id'); // 'patient_id' or 'patient_phone'
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      toast.error('Please enter a search value', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const searchParams = {
        [searchType]: searchValue.trim(),
      };

      const response = await patientAPI.search(searchParams);

      if (response.data && response.data.length > 0) {
        setSearchResult(response.data[0]); // Take first result
        toast.success('Patient found!', {
          position: 'top-center',
          autoClose: 2000,
        });
      } else {
        setSearchResult(null);
        toast.warning('No patient found with this information', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      setSearchResult(null);
      toast.error('Search failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSearchValue('');
    setSearchResult(null);
    setSearched(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className={`patient-search-container${darkMode ? ' dark' : ''}`}>
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

      <div className="search-content">
        <div className="search-header">
          <h1>Search Patient</h1>
          <p>Find patient by ID or phone number</p>
        </div>

        {/* Search Form */}
        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            {/* Search Type Selection */}
            <div className="search-type-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="searchType"
                  value="patient_id"
                  checked={searchType === 'patient_id'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <FaUser />
                <span>Search by Patient ID</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="searchType"
                  value="patient_phone"
                  checked={searchType === 'patient_phone'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <FaPhone />
                <span>Search by Phone Number</span>
              </label>
            </div>

            {/* Search Input */}
            <div className="search-input-group">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === 'patient_id'
                    ? 'Enter Patient ID (e.g., PAT001)'
                    : 'Enter 10-digit phone number'
                }
                className="search-input-field"
                maxLength={searchType === 'patient_phone' ? 10 : 100}
              />
              <button
                type="submit"
                className="search-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Search
                  </>
                )}
              </button>
              {searchValue && (
                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="results-section">
            {searchResult ? (
              <div className="patient-result-card">
                <div className="result-header">
                  <h2>Patient Found</h2>
                  <span className="status-badge active">Active</span>
                </div>

                <div className="result-body">
                  {/* Patient Info Grid */}
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Patient ID</label>
                      <p className="patient-id-value">{searchResult.patient_id}</p>
                    </div>

                    <div className="info-item">
                      <label>Full Name</label>
                      <p>{searchResult.patient_name}</p>
                    </div>

                    <div className="info-item">
                      <label>Age</label>
                      <p>{searchResult.patient_age} years</p>
                    </div>

                    <div className="info-item">
                      <label>Gender</label>
                      <p>{searchResult.patient_gender}</p>
                    </div>

                    <div className="info-item">
                      <label>Blood Group</label>
                      <p>
                        <span className="blood-badge">
                          {searchResult.patient_blood_group}
                        </span>
                      </p>
                    </div>

                    <div className="info-item">
                      <label>Phone Number</label>
                      <p>{searchResult.patient_phone}</p>
                    </div>

                    <div className="info-item">
                      <label>Email</label>
                      <p>{searchResult.patient_email || 'Not provided'}</p>
                    </div>

                    <div className="info-item">
                      <label>Registration Date</label>
                      <p>{formatDate(searchResult.patient_reg_date)}</p>
                    </div>

                    <div className="info-item full-width">
                      <label>Address</label>
                      <p>{searchResult.patient_address}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="result-actions">
                    <button
                      className="btn-view"
                      onClick={() => window.print()}
                    >
                      Print Details
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => window.location.href = `/edit-patient/${searchResult.patient_auto_id}`}
                    >
                      Edit Patient
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-result">
                <div className="no-result-icon">🔍</div>
                <h3>No Patient Found</h3>
                <p>
                  No patient matches the {searchType === 'patient_id' ? 'ID' : 'phone number'} you entered.
                </p>
                <button className="btn-retry" onClick={handleReset}>
                  Try Another Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default PatientSearch;
