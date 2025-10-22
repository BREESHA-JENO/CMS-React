import React from "react";
import { useNavigate } from "react-router-dom";
import "./Doctor.css"; // optional: for clean separation of styles

// ============== DOCTOR DASHBOARD ==============
const Doctor = ({ doctor }) => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    switch (action) {
      case "today":
        navigate("/doctor/appointments/today");
        break;
      case "bydate":
        navigate("/doctor/appointments/date");
        break;
      case "consult":
        navigate("/doctor/consult");
        break;
      case "prescribe-medicine":
        navigate("/doctor/prescription/medicine");
        break;
      case "prescribe-lab":
        navigate("/doctor/prescription/lab");
        break;
      case "history":
        navigate("/doctor/consultation/history");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // clear JWT token
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="doctor-header">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Welcome Message */}
      <section className="doctor-welcome">
        Welcome Dr. {doctor?.name || "John Doe"} (ID: {doctor?.id || "12345"})
      </section>

      {/* Action Grid */}
      <main className="doctor-dashboard">
        <div className="action-grid">
          <button onClick={() => handleAction("today")} className="action-card">
            View Today's Appointments
          </button>
          <button onClick={() => handleAction("bydate")} className="action-card">
            View Appointments by Date
          </button>
          <button onClick={() => handleAction("consult")} className="action-card">
            Consult Patient
          </button>
          <button
            onClick={() => handleAction("prescribe-medicine")}
            className="action-card"
          >
            Prescribe Medicine
          </button>
          <button
            onClick={() => handleAction("prescribe-lab")}
            className="action-card"
          >
            Prescribe Lab Test
          </button>
          <button onClick={() => handleAction("history")} className="action-card">
            View Patient Consultation History
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="doctor-footer">
        <p>© 2025 HealthIS. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Doctor;
