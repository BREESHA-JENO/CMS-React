import React, { useEffect, useState } from "react";
import { getAmbulanceRequests, getAmbulances, updateAmbulanceRequestStatus } from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const AdminAmbulanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const [requestsRes, ambulancesRes] = await Promise.all([
          getAmbulanceRequests(),
          getAmbulances()
        ]);
        setRequests(requestsRes.data);
        setAmbulances(ambulancesRes.data);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAmbulanceRequestStatus(id, { status });
      const res = await getAmbulanceRequests();
      setRequests(res.data);
      alert(`Status updated to ${status}`);
    } catch (err) {
      alert("Failed to update status");
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
    <div className="dashboard-content">
      <h1>Ambulance Requests</h1>
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div><p>Loading requests...</p></div>
      ) : (
        <table className="ambulance-request-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Pickup Location</th>
              <th>Destination</th>
              <th>Ambulance</th>
              <th>Status</th>
              <th>Change Status</th>
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
                <td>
                  <select
                    value={r.status}
                    onChange={e => handleStatusChange(r.request_id, e.target.value)}
                  >
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
      )}
    </div>
  );
};
export default AdminAmbulanceRequests;
