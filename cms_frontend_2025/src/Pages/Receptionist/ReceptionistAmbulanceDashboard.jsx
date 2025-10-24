// src/Pages/Ambulance/ReceptionistAmbulanceDashboard.jsx
import React, { useState, useEffect } from "react";
import { createAmbulanceRequest, getAmbulanceRequests } from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const ReceptionistAmbulanceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [requests, setRequests] = useState([]);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await getAmbulanceRequests();
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!pickup || !destination) {
      alert("Please fill both pickup and destination!");
      return;
    }
    try {
      await createAmbulanceRequest({
        pickup_location: pickup,
        destination,
      });
      alert("Request created successfully!");
      setPickup("");
      setDestination("");
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  };

  return (
    <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome Receptionist, {user?.username}</h1>
          <p>Request ambulances quickly and monitor their progress</p>
        </div>

        {/* Request Form */}
        <form onSubmit={handleCreateRequest} className="dashboard-card" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3>Create New Ambulance Request</h3>
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="form-control"
            placeholder="Enter pickup location"
          />
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-control"
            placeholder="Enter destination"
          />
          <button type="submit" className="btn btn-create" style={{ marginTop: "1rem" }}>
            Create Request
          </button>
        </form>

        {/* Requests Table */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your ambulance requests...</p>
          </div>
        ) : (
          <table className="ambulance-request-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Pickup Location</th>
                <th>Destination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.pickup_location}</td>
                  <td>{r.destination}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReceptionistAmbulanceDashboard;
