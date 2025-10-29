import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConsultationForm from "../../components/Doctor/ConsultationForm";
import UnifiedPrescriptionForm from "../../components/Doctor/UnifiedPrescriptionForm";
import { createConsultation } from "../../Service/doctor_api";

const ConsultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment || null;
  const [message, setMessage] = useState("");
  const [showPrescriptionOptions, setShowPrescriptionOptions] = useState(false);
  const [consultationData, setConsultationData] = useState(null);
  const [activeModal, setActiveModal] = useState("consult");

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

  const handleConsultSubmit = async (data) => {
    try {
      const res = await createConsultation(data);
      setConsultationData(res.data);
      setMessage(""); // Clear any previous messages
      setActiveModal(null);
      setShowPrescriptionOptions(true);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };


  if (!appointment) {
    return (
      <div className="container" style={{ padding: "1rem" }}>
        <div className="alert alert-warning mb-3">No appointment provided. Please pick one from Appointments.</div>
        <button className="btn btn-secondary" onClick={() => navigate("/doctor/appointments")}>Go to Appointments</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary mb-0">
          {activeModal === "consult" ? "Patient Consultation" : 
           activeModal === "prescription" ? "Add Prescription" : 
           activeModal === "labtest" ? "Prescribe Lab Tests" : "Consultation Complete"}
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/doctor/appointments")}>
          Back to Appointments
        </button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith("Error") || message.includes("❌") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}

      {/* Show prescription option after successful consultation */}
      {showPrescriptionOptions && (
        <div className="card border-success shadow-sm mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-check-circle me-2"></i>
              Consultation Completed Successfully!
            </h5>
          </div>
          <div className="card-body">
            <div className="alert alert-info mb-3">
              <strong>Patient:</strong> {appointment?._patientName || 'Unknown'}<br/>
              <strong>Consultation ID:</strong> {consultationData?.consultation_id}
            </div>
            
            <h6 className="mb-3">Next Step:</h6>
            
            {/* Single Prescription Button */}
            <div className="mb-3">
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={() => setActiveModal("prescription")}
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

            {/* Close Button */}
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/doctor/appointments")}
              >
                <i className="fas fa-times me-2"></i>
                Complete Without Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Form */}
      {activeModal === "consult" && (
        <ConsultationForm
          appointment={appointment}
          staffId={staffId}
          onSubmit={handleConsultSubmit}
          onClose={() => navigate("/doctor/appointments")}
        />
      )}

      {/* Unified Prescription Form */}
      {activeModal === "prescription" && consultationData && (
        <UnifiedPrescriptionForm
          consultation={consultationData}
          appointment={appointment}
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
            setActiveModal(null);
            setShowPrescriptionOptions(false);
            setTimeout(() => navigate("/doctor/appointments"), 2000);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default ConsultPage;
