// src/Pages/Ambulance/DriverAmbulanceDashboard.jsx
import React, { useEffect, useState } from "react";
import Header1 from "../../Elements/Header1";
import Footer1 from "../../Elements/Footer1";
import Sidebar from "../../Elements/Sidebar";
import { getAmbulanceRequests, updateAmbulanceRequestStatus } from "../../Service/amb_api";
import "./DriverAmbulanceDashboard.css";

const DriverAmbulanceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAmbulanceRequests();
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load ambulance requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleComplete = async (requestId) => {
    try {
      await updateAmbulanceRequestStatus(requestId, { status: "Completed" });
      alert("Marked ride as completed.");
      setRequests((prev) =>
        prev.map((req) =>
          req.request_id === requestId ? { ...req, status: "Completed" } : req
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
      <Header1
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Sidebar open={sidebarOpen} role={user?.role} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome Driver {user?.username || ""}</h1>
          <p>View and manage your assigned ambulance requests</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : (
          <table className="ambulance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pickup Location</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.request_id}>
                  <td>{req.request_id}</td>
                  <td>{req.pickup_location}</td>
                  <td>{req.destination}</td>
                  <td>{req.status}</td>
                  <td>
                    {req.status === "Assigned" ? (
                      <button
                        className="complete-btn"
                        onClick={() => handleComplete(req.request_id)}
                      >
                        Mark Completed
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer1 />
    </div>
  );
};

export default DriverAmbulanceDashboard;
