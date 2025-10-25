// src/components/Receptionist/BillingList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaRupeeSign, FaEdit } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import { billingAPI } from '../../Service/recep_api';
import './BillingList.css';

const BillingList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Edit Modal State
  const [editingBill, setEditingBill] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, searchTerm, statusFilter]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billingAPI.getAll();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load billing records', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    let filtered = bills;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(bill => bill.billing_status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.rec_bill_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBills(filtered);
  };

  const handleEditClick = (bill) => {
    setEditingBill(bill);
    setNewStatus(bill.billing_status);
    setShowEditModal(true);
  };

const handleUpdateStatus = async () => {
  if (!newStatus) {
    toast.warning('Please select a payment status', {
      position: 'top-right',
      autoClose: 3000,
    });
    return;
  }

  setUpdating(true);

  try {
    // ✅ CHANGED THIS LINE - Use partialUpdate instead
    await billingAPI.partialUpdate(editingBill.rec_bill_id, { billing_status: newStatus });
    
    toast.success('Payment status updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });

    setShowEditModal(false);
    fetchBills(); // Refresh the list
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error('Failed to update payment status', {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setUpdating(false);
  }
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

  return (
    <div className={`billing-list-container${darkMode ? ' dark' : ''}`}>
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

      <div className="billing-list-content">
        <div className="list-header">
          <div className="header-text">
            <h1>All Billing Records</h1>
            <p>View and manage patient billing and invoices</p>
          </div>
          <button
            className="btn-add-new"
            onClick={() => navigate('/create-billing')}
          >
            + Create New Bill
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Bill ID or Patient Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          <div className="results-count">
            Showing {filteredBills.length} of {bills.length} bills
          </div>
        </div>

        {/* Bills Table */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading billing records...</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="no-data">
            <FaRupeeSign className="no-data-icon" />
            <h3>No Billing Records Found</h3>
            <p>No bills match your search criteria</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.rec_bill_id}>
                    <td className="bill-id">#{bill.rec_bill_id}</td>
                    <td>{bill.patient_name || 'N/A'}</td>
                    <td>{bill.doctor_name || 'N/A'}</td>
                    <td className="fee-amount">
                      <FaRupeeSign className="rupee-icon" />
                      {bill.consultation_fee}
                    </td>
                    <td>{getStatusBadge(bill.billing_status)}</td>
                    <td>{formatDate(bill.billing_created_at)}</td>
                    <td>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEditClick(bill)}
                        title="Update Payment Status"
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

      {/* Edit Status Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Payment Status</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="bill-info">
                <p><strong>Bill ID:</strong> #{editingBill?.rec_bill_id}</p>
                <p><strong>Patient:</strong> {editingBill?.patient_name}</p>
                <p><strong>Amount:</strong> ₹{editingBill?.consultation_fee}</p>
                <p><strong>Current Status:</strong> {getStatusBadge(editingBill?.billing_status)}</p>
              </div>

              <div className="form-group">
                <label htmlFor="newStatus">New Payment Status:</label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="btn-update"
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer1 />
    </div>
  );
};

export default BillingList;
