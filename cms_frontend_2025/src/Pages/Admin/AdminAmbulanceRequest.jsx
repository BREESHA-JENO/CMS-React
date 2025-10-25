import React, { useEffect, useState } from "react";
import { getAmbulanceRequests, updateAmbulanceRequestStatus } from "../../Service/amb_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const AdminAmbulanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await getAmbulanceRequests();
        setRequests(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAmbulanceRequestStatus(id, { status });
      // Refresh
      const res = await getAmbulanceRequests();
      setRequests(res.data);
      alert(`Status updated to ${status}`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

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
                <td>{r.assigned_ambulance ? r.assigned_ambulance.vehicle_no : "Unassigned"}</td>
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
