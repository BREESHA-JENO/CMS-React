// src/components/Receptionist/BillingSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaRupeeSign, FaUser, FaUndo } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { billingAPI, patientAPI } from '../../Service/recep_api';
import './BillingSearch.css';

const BillingSearch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState(''); // 'patient' or 'status'

  const [selectedPatient, setSelectedPatient] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const [searchFilters, setSearchFilters] = useState({
    patientId: '',
    paymentStatus: '',
  });

  // Fetch patients for dropdown
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the other field when one is selected
    if (name === 'patientId' && value) {
      setSearchFilters({ patientId: value, paymentStatus: '' });
    } else if (name === 'paymentStatus' && value) {
      setSearchFilters({ patientId: '', paymentStatus: value });
    } else {
      setSearchFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async () => {
    // Validate exactly one filter is selected
    if (!searchFilters.patientId && !searchFilters.paymentStatus) {
      toast.warning('Please select a Patient or Payment Status', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      const response = await billingAPI.getAll();
      console.log('All bills:', response.data);
      
      let results = response.data;

      // Search by Patient ID
      if (searchFilters.patientId) {
        setSearchType('patient');
        
        // Find patient details
        const patient = patients.find(p => 
          p.patient_id.toUpperCase() === searchFilters.patientId.toUpperCase()
        );

        console.log('Found patient:', patient);

        if (!patient) {
          toast.error('Patient not found', {
            position: 'top-right',
            autoClose: 3000,
          });
          setSearchResults([]);
          setSelectedPatient(null);
          setSearching(false);
          return;
        }

        setSelectedPatient(patient);

        // Filter bills by patient
        results = results.filter(bill => {
          console.log('Checking bill:', bill);
          
          if (bill.patient_id?.patient_id) {
            return bill.patient_id.patient_id === searchFilters.patientId.toUpperCase();
          } else if (typeof bill.patient_id === 'string') {
            return bill.patient_id === searchFilters.patientId.toUpperCase();
          }
          return false;
        });

        console.log('Filtered results:', results);
      }
      // Search by Payment Status
      else if (searchFilters.paymentStatus) {
        setSearchType('status');
        
        results = results.filter(bill => 
          bill.billing_status === searchFilters.paymentStatus
        );

        console.log('Filtered by status:', results);
      }

      setSearchResults(results);

      if (results.length === 0) {
        toast.info('No billing records found', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.success(`Found ${results.length} billing record(s)`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }

    } catch (error) {
      console.error('Error searching bills:', error);
      toast.error('Failed to search billing records', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSearchFilters({
      patientId: '',
      paymentStatus: '',
    });
    setSearchResults([]);
    setHasSearched(false);
    setSearchType('');
    setSelectedPatient(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: { color: '#28a745', bg: '#e6f9ed', label: 'Paid' },
      Unpaid: { color: '#dc3545', bg: '#ffe6e6', label: 'Unpaid' },
      'Partially Paid': { color: '#ffc107', bg: '#fff8e6', label: 'Partially Paid' },
    };

    const config = statusConfig[status] || statusConfig.Unpaid;

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

  const calculateTotal = () => {
    return searchResults.reduce((sum, bill) => sum + parseFloat(bill.consultation_fee || 0), 0);
  };

  return (
    <div className={`billing-search-container${darkMode ? ' dark' : ''}`}>
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

      <div className="billing-search-content">
        <div className="search-header">
          <h1>Search Billing Records</h1>
          <p>Search by Patient ID or Payment Status</p>
        </div>

        {/* Search Filters */}
        <div className="search-filters-card">
          <h3>Search By</h3>
          
          <div className="search-options">
            {/* Patient ID Search */}
            <div className="search-option">
              <label htmlFor="patientId">
                <FaUser /> Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                placeholder="Enter Patient ID (e.g., PAT001)"
                value={searchFilters.patientId}
                onChange={handleFilterChange}
                disabled={searchFilters.paymentStatus !== ''}
              />
              <small>Search billing records for a specific patient</small>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Payment Status Search */}
            <div className="search-option">
              <label htmlFor="paymentStatus">
                <FaRupeeSign /> Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={searchFilters.paymentStatus}
                onChange={handleFilterChange}
                disabled={searchFilters.patientId !== ''}
              >
                <option value="">-- Select Status --</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
              </select>
              <small>View all bills by payment status</small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button
              className="btn-reset"
              onClick={handleReset}
              disabled={searching}
            >
              <FaUndo /> Reset
            </button>
            <button
              className="btn-search"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <>
                  <span className="spinner-small"></span>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch /> Search Bills
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="search-results-section">
            {/* Patient Details Header (for patient search) */}
            {searchType === 'patient' && selectedPatient && (
              <div className="info-header patient-header">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-details">
                  <h3>{selectedPatient.patient_name} ({selectedPatient.patient_id})</h3>
                  <div className="info-meta">
                    <span><strong>Phone:</strong> {selectedPatient.patient_phone}</span>
                    <span><strong>Age:</strong> {selectedPatient.patient_age} years</span>
                    <span><strong>Gender:</strong> {selectedPatient.patient_gender}</span>
                    <span><strong>Blood Group:</strong> {selectedPatient.patient_blood_group}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="results-header">
              <h3>Billing Records</h3>
              <span className="results-count">
                {searchResults.length} record(s) found
                {searchResults.length > 0 && (
                  <span className="total-amount"> | Total: ₹{calculateTotal()}</span>
                )}
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h4>No Billing Records Found</h4>
                <p>No bills found for this {searchType}</p>
              </div>
            ) : (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      {searchType !== 'patient' && <th>Patient Name</th>}
                      <th>Doctor Name</th>
                      <th>Consultation Fee</th>
                      <th>Status</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((bill) => (
                      <tr key={bill.rec_bill_id}>
                        <td className="bill-id">#{bill.rec_bill_id}</td>
                        {searchType !== 'patient' && (
                          <td>{bill.patient_name || 'N/A'}</td>
                        )}
                        <td>{bill.doctor_name || 'N/A'}</td>
                        <td className="fee-amount">
                          <FaRupeeSign className="rupee-icon" />
                          {bill.consultation_fee}
                        </td>
                        <td>{getStatusBadge(bill.billing_status)}</td>
                        <td>{formatDate(bill.billing_created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default BillingSearch;
