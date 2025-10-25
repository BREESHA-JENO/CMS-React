// src/pages/Receptionist/ManageBilling.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaList, FaSearch, FaMoneyCheckAlt } from 'react-icons/fa';
import Header1 from '../../Elements/Header1';
import Footer1 from '../../Elements/Footer1';
import Sidebar from '../../Elements/Sidebar';
import './ManageBilling.css';

const ManageBilling = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={`manage-billing-container${darkMode ? ' dark' : ''}`}>
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

      <div className="manage-billing-content">
        <div className="page-header">
          <h1>Manage Billing</h1>
          <p>Create invoices, track payments, and manage billing records</p>
        </div>

        <div className="action-cards">
          {/* Card 1: Create Bill */}
          <div 
            className="action-card create-card"
            onClick={() => navigate('/create-billing')}
          >
            <div className="card-icon">
              <FaFileInvoiceDollar />
            </div>
            <h3>Create Bill</h3>
            <p>Generate new invoice</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 2: List Bills */}
          <div 
            className="action-card list-card"
            onClick={() => navigate('/billing-list')}
          >
            <div className="card-icon">
              <FaList />
            </div>
            <h3>List Bills</h3>
            <p>View all billing records</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 3: Search Bills */}
          <div 
            className="action-card search-card"
            onClick={() => navigate('/billing-search')}
          >
            <div className="card-icon">
              <FaSearch />
            </div>
            <h3>Search Bills</h3>
            <p>Find billing records</p>
            <div className="card-arrow">→</div>
          </div>

          {/* Card 4: Payment Status */}
          <div 
            className="action-card payment-card"
            onClick={() => navigate('/billing-list')}
          >
            <div className="card-icon">
              <FaMoneyCheckAlt />
            </div>
            <h3>Update Payment</h3>
            <p>Manage payment status</p>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default ManageBilling;
