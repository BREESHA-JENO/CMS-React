import React, { useEffect, useState } from "react";
import { getForgotPasswordRequests, processForgotPasswordRequest } from "../../Service/admin_api";

const ForgotPasswordRequests = () => {
  const [requests, setRequests] = useState([]);
  const [recentPassword, setRecentPassword] = useState(""); // State to show new password
  const [message, setMessage] = useState("");                // Optional: status/error message

  const fetchRequests = async () => {
    setRecentPassword(""); // Clear any old password on refresh
    try {
      const res = await getForgotPasswordRequests();
      setRequests(res.data);
    } catch {
      setMessage("Failed to fetch requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setRecentPassword("");
    setMessage("");
    try {
      const response = await processForgotPasswordRequest(id, { action });
      fetchRequests(); // Refresh the list after action
      if (action === "approve" && response.data.new_password) {
        setRecentPassword(response.data.new_password);
        setMessage("Password reset approved. Share this password securely with staff.");
      } else if (action === "reject") {
        setMessage("Request rejected.");
      }
    } catch (error) {
      setMessage("Action failed.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ margin: "2rem 0 1rem 0", textAlign: "center" }}>
        Forgot Password Requests
      </h2>

      {recentPassword && (
        <div
          style={{
            background: "#e1fce1",
            border: "1px solid #7dd87d",
            color: "#237e23",
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "8px",
            fontSize: "1.2rem",
            fontWeight: 600
          }}
        >
          New password: <span style={{ fontFamily: "monospace" }}>{recentPassword}</span>
        </div>
      )}

      {message && (
        <div style={{ color: "#b22", marginBottom: "1rem" }}>{message}</div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Staff</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Processed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: "1rem" }}>
                No requests found.
              </td>
            </tr>
          )}
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.staff_username}</td>
              <td>{req.staff_name}</td>
              <td>{req.reason || "-"}</td>
              <td>{req.status}</td>
              <td>{new Date(req.requested_at).toLocaleString()}</td>
              <td>{req.processed_at ? new Date(req.processed_at).toLocaleString() : "-"}</td>
              <td>
                {req.status === "PENDING" && (
                  <>
                    <button
                      style={{ marginRight: "0.5rem", background: "#40bf49", color: "#fff", border: "none", borderRadius: "4px", padding: "0.3rem 1rem", cursor: "pointer" }}
                      onClick={() => handleAction(req.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      style={{ background: "#c43535", color: "#fff", border: "none", borderRadius: "4px", padding: "0.3rem 1rem", cursor: "pointer" }}
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {req.status !== "PENDING" && <span style={{ color: "#888" }}>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForgotPasswordRequests;
