import React, { useState, useEffect } from "react";
import {
  createAmbulanceRequest,
  getAmbulanceRequests,
  getAmbulances,
} from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const PAGE = { FORM: "form", LIST: "list" };

const ReceptionistAmbulanceDashboard = () => {
  const [page, setPage] = useState(PAGE.FORM);
  const [requests, setRequests] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [requestsRes, ambulancesRes] = await Promise.all([
          getAmbulanceRequests(),
          getAmbulances()
        ]);
        setRequests(requestsRes.data);
        setAmbulances(ambulancesRes.data);
      } catch (error) {
        console.error("Error fetching requests/ambulances:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const availableAmbulances = ambulances.filter(a => a.status === "Available");

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!pickup || !destination || !selectedAmbulance) {
      alert("Please fill pickup, destination and select an ambulance.");
      return;
    }
    try {
      setLoading(true);
      await createAmbulanceRequest({
        pickup_location: pickup,
        destination,
        assigned_ambulance_id: selectedAmbulance,
      });
      alert("Request created successfully!");
      setPickup("");
      setDestination("");
      setSelectedAmbulance("");
      const res = await getAmbulanceRequests();
      setRequests(res.data);
      setPage(PAGE.LIST);
    } catch (err) {
      alert("Failed to create request. Make sure ambulance is still available.");
      console.error("Failed to create request:", err);
    } finally {
      setLoading(false);
    }
  };

  function renderAmbulanceInfo(r) {
    const amb = r.assigned_ambulance;
    if (amb && typeof amb === "object") {
      const v = amb.vehicle_no;
      const d = amb.driver_name;
      if (v && d) return `${v} — ${d}`;
      if (v) return v;
      if (d) return d;
      return "Unassigned";
    }
    return "Unassigned";
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {page === PAGE.FORM ? (
          <>
            <div className="welcome-section">
              <h1>Request an Ambulance</h1>
              <p>Assign an available ambulance for a patient.</p>
            </div>
            <form onSubmit={handleCreateRequest} className="dashboard-card" style={{ maxWidth: 800, margin: "0 auto" }}>
              <h3>Create New Ambulance Request</h3>
              <label>Pickup Location</label>
              <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} className="form-control" placeholder="Enter pickup location" required />
              <label>Destination</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="form-control" placeholder="Enter destination" required />
              <label>Allocate Ambulance</label>
              <select value={selectedAmbulance} onChange={(e) => setSelectedAmbulance(e.target.value)} className="form-control" required>
                <option value="">Select available ambulance</option>
                {availableAmbulances.map((a) => (
                  <option key={a.ambulance_id} value={a.ambulance_id}>
                    {a.vehicle_no} — {a.driver_name}
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem" }}>
                <button type="submit" className="btn btn-create">Create Request</button>
                <button type="button" className="btn" onClick={() => setPage(PAGE.LIST)} style={{ marginLeft: "0.8rem" }}>View Requests</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="welcome-section">
              <h1>Ambulance Requests</h1>
              <button className="btn btn-create" style={{ float: "right", marginBottom: 16 }} onClick={() => setPage(PAGE.FORM)}>Create Request</button>
            </div>
            {loading ? (
              <div className="loading-spinner"><div className="spinner"></div><p>Loading your ambulance requests...</p></div>
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
                      <td>{renderAmbulanceInfo(r)}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ReceptionistAmbulanceDashboard;
