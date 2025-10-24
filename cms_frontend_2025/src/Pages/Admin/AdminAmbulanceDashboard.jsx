// src/Pages/Ambulance/AdminAmbulanceDashboard.jsx
import React, { useState, useEffect } from "react";
import { getAmbulanceRequests, updateAmbulanceRequestStatus, getAmbulances } from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const AdminAmbulanceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [requests, setRequests] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, ambRes] = await Promise.all([
          getAmbulanceRequests(),
          getAmbulances()
        ]);
        setRequests(reqRes.data);
        setAmbulances(ambRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAmbulanceRequestStatus(id, { status });
      alert(`Request status updated to ${status}`);
      setRequests((prev) =>
        prev.map((r) => (r.request_id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome Admin, {user?.username}</h1>
          <p>Manage ambulances, view requests, and update their status</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading ambulance data...</p>
          </div>
        ) : (
          <>
            <div className="cards-grid">
              <div className="dashboard-card nav-card">
                <h3>Total Ambulances</h3>
                <p>{ambulances.length}</p>
              </div>
              <div className="dashboard-card nav-card">
                <h3>Total Requests</h3>
                <p>{requests.length}</p>
              </div>
            </div>

            <table className="ambulance-request-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pickup</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Assigned Driver</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.request_id}>
                    <td>{r.request_id}</td>
                    <td>{r.pickup_location}</td>
                    <td>{r.destination}</td>
                    <td>{r.status}</td>
                    <td>{r.assigned_driver_name || "Unassigned"}</td>
                    <td>
                      <select
                        onChange={(e) =>
                          handleUpdateStatus(r.request_id, e.target.value)
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Change...
                        </option>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAmbulanceDashboard;
