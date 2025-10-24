import React, { useState, useEffect } from "react";
import {
  createAmbulanceRequest,
  getAmbulanceRequests,
  getAmbulances,
} from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const ReceptionistAmbulanceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [requests, setRequests] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch requests and available ambulances on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const requestsRes = await getAmbulanceRequests();
        const ambulancesRes = await getAmbulances();
        setRequests(requestsRes.data);
        // Only allow selecting ambulances that are "Available"
        const availableAmbulances = ambulancesRes.data.filter(
          (a) => a.status === "Available"
        );
        setAmbulances(availableAmbulances);
      } catch (error) {
        console.error("Error fetching requests/ambulances:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!pickup || !destination || !selectedAmbulance) {
      alert("Please fill pickup, destination and select an ambulance.");
      return;
    }
    try {
      await createAmbulanceRequest({
        pickup_location: pickup,
        destination,
        assigned_ambulance: selectedAmbulance,
      });
      alert("Request created successfully!");
      setPickup("");
      setDestination("");
      setSelectedAmbulance("");
      // Refresh requests list
      const res = await getAmbulanceRequests();
      setRequests(res.data);
    } catch (err) {
      alert("Failed to create request. Make sure ambulance is still available.");
      console.error("Failed to create request:", err);
    }
  };

  return (
    <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome Receptionist, {user?.username}</h1>
          <p>
            Request ambulances and assign an available vehicle for each patient.
          </p>
        </div>
        {/* Request Form */}
        <form
          onSubmit={handleCreateRequest}
          className="dashboard-card"
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          <h3>Create New Ambulance Request</h3>
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="form-control"
            placeholder="Enter pickup location"
            required
          />
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-control"
            placeholder="Enter destination"
            required
          />
          <label>Allocate Ambulance</label>
          <select
            value={selectedAmbulance}
            onChange={(e) => setSelectedAmbulance(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select available ambulance</option>
            {ambulances.map((a) => (
              <option key={a.ambulance_id} value={a.ambulance_id}>
                {a.vehicle_no} — {a.driver_name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn btn-create"
            style={{ marginTop: "1rem" }}
          >
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
                <th>Ambulance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.pickup_location}</td>
                  <td>{r.destination}</td>
                  <td>{r.assigned_ambulance ? r.assigned_ambulance.vehicle_no : "Unassigned"}</td>
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
