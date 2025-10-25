import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrescriptionForm from "../../components/Doctor/PrescriptionForm";
import LabTestForm from "../../components/Doctor/LabTestForm";
import { createMedicinePrescription, createLabPrescription } from "../../Service/doctor_api";

const PrescribePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const consultation = location.state?.consultation || null;
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("medicine");

  const staffId = (() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        return u.staff_id || u.id;
      }
    } catch {}
    return undefined;
  })();

  const onMedicineSubmit = async (data) => {
    try {
      const res = await createMedicinePrescription(data);
      setMessage("Medicine prescribed successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };

  const onLabSubmit = async (data) => {
    try {
      const res = await createLabPrescription(data);
      setMessage("Lab test prescribed successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };

  if (!consultation) {
    return (
      <div className="container" style={{ padding: "1rem" }}>
        <div className="alert alert-warning mb-3">No consultation found. Start from an appointment and save a consultation first.</div>
        <button className="btn btn-secondary" onClick={() => navigate("/doctor/appointments")}>Go to Appointments</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary mb-0">Prescriptions</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${active === "medicine" ? "active" : ""}`} onClick={() => setActive("medicine")}>
            Medicine
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${active === "lab" ? "active" : ""}`} onClick={() => setActive("lab")}>
            Lab Test
          </button>
        </li>
      </ul>

      {message && (
        <div className={`alert ${message.startsWith("Error") ? "alert-danger" : "alert-info"}`}>{message}</div>
      )}

      {active === "medicine" ? (
        <PrescriptionForm
          consultation={consultation}
          staffId={staffId}
          onSubmit={onMedicineSubmit}
          onClose={() => navigate("/doctor")}
        />
      ) : (
        <LabTestForm
          consultation={consultation}
          staffId={staffId}
          onSubmit={onLabSubmit}
          onClose={() => navigate("/doctor")}
        />
      )}
    </div>
  );
};

export default PrescribePage;
