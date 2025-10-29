import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UnifiedPrescriptionForm from "../../components/Doctor/UnifiedPrescriptionForm";

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-1">
            <i className="fas fa-check-circle me-2"></i>
            Consultation Completed Successfully!
          </h2>
          <p className="text-muted mb-0">
            Patient: <strong>{consultation?.appointment_id?.patient_id?.patient_name || 'Unknown'}</strong> | 
            Consultation ID: <strong>{consultation?.consultation_id}</strong>
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/doctor/appointments")}>
          <i className="fas fa-arrow-left me-2"></i>Back to Appointments
        </button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith("Error") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}

      <div className="card border-success shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="fas fa-prescription me-2"></i>
            Choose Prescription Option
          </h5>
        </div>
        <div className="card-body">
          <h6 className="mb-3">Select how you want to prescribe:</h6>
          {/* Single Prescription Button */}
          <div className="mb-3">
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={() => setActive("prescription")}
              style={{
                background: 'linear-gradient(45deg, #28a745, #17a2b8)',
                border: 'none'
              }}
            >
              <i className="fas fa-pills me-2"></i>
              <i className="fas fa-vial me-2"></i>
              Create Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Render Selected Form */}
      {active === "prescription" && (
        <UnifiedPrescriptionForm
          consultation={consultation}
          staffId={staffId}
          onSubmit={async (results) => {
            let successMessage = "✅ Prescription created successfully! ";
            if (results.medicine && results.labTest) {
              successMessage += "Both medicine and lab test prescriptions have been saved.";
            } else if (results.medicine) {
              successMessage += "Medicine prescription has been saved.";
            } else if (results.labTest) {
              successMessage += "Lab test prescription has been saved.";
            }
            setMessage(successMessage);
            setActive("medicine"); // Reset to show options again
          }}
          onClose={() => setActive("medicine")}
        />
      )}

    </div>
  );
};

export default PrescribePage;
