import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConsultationForm from "../../components/Doctor/ConsultationForm";
import PrescriptionForm from "../../components/Doctor/PrescriptionForm";
import LabTestForm from "../../components/Doctor/LabTestForm";
import { createConsultation, createMedicinePrescription, createLabPrescription } from "../../Service/doctor_api";

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
      setMessage("✅ Consultation saved successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(true);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };

  const handlePrescriptionSubmit = async (data) => {
    try {
      await createMedicinePrescription(data);
      setMessage("✅ Medicine prescription added successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      // Wait a moment then redirect
      setTimeout(() => navigate("/doctor/appointments"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };

  const handleLabTestSubmit = async (data) => {
    try {
      await createLabPrescription(data);
      setMessage("✅ Lab tests prescribed successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      // Wait a moment then redirect
      setTimeout(() => navigate("/doctor/appointments"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setMessage(`Error: ${msg}`);
      throw err;
    }
  };

  const handleCompleteWithoutPrescription = () => {
    setMessage("✅ Consultation completed successfully!");
    setShowPrescriptionOptions(false);
    // Wait a moment then redirect
    setTimeout(() => navigate("/doctor/appointments"), 1500);
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

      {/* Show prescription options after successful consultation */}
      {showPrescriptionOptions && (
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center">
            <h5 className="card-title mb-3">✅ Consultation Completed Successfully!</h5>
            <p className="text-muted mb-4">Would you like to add prescriptions or lab tests?</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setActiveModal("prescription")}
              >
                <i className="bi bi-capsule me-2"></i>
                Add Medicine Prescription
              </button>
              <button 
                className="btn btn-info btn-lg"
                onClick={() => setActiveModal("labtest")}
              >
                <i className="bi bi-clipboard-pulse me-2"></i>
                Prescribe Lab Tests
              </button>
              <button 
                className="btn btn-success btn-lg"
                onClick={handleCompleteWithoutPrescription}
              >
                <i className="bi bi-check-circle me-2"></i>
                Complete (No Prescription)
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

      {/* Medicine Prescription Form */}
      {activeModal === "prescription" && consultationData && (
        <PrescriptionForm
          consultation={consultationData}
          staffId={staffId}
          onSubmit={handlePrescriptionSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Lab Test Form */}
      {activeModal === "labtest" && consultationData && (
        <LabTestForm
          consultation={consultationData}
          staffId={staffId}
          onSubmit={handleLabTestSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default ConsultPage;
