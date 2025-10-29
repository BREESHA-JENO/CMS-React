import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPills,
  FaVial,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaCalendarDay,
  FaSearch,
  FaUser,
  FaStethoscope,
  FaHistory
} from "react-icons/fa";
import Doctor from "../../components/Doctor/Doctor";
import ConsultationForm from "../../components/Doctor/ConsultationForm";
import UnifiedPrescriptionForm from "../../components/Doctor/UnifiedPrescriptionForm";
import "../../components/Doctor/Doctor.css";
import "./DoctorDashboard.css";
import {
  createConsultation,
  createMedicinePrescription,
  createLabPrescription,
  getPatientConsultationHistory,
  getDoctorDashboardStats,
} from "../../Service/doctor_api";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [lastConsultation, setLastConsultation] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionOptions, setShowPrescriptionOptions] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loadingDoctorInfo, setLoadingDoctorInfo] = useState(true);

  // Debug: Add global click listener to detect any button clicks
  React.useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.tagName === 'BUTTON') {
        console.log('Button clicked:', e.target.textContent, e.target.className);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 0,
    todayConsulted: 0,
    todayRemaining: 0,
    tomorrowAppointments: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Helper function to generate meaningful error messages
  const getErrorMessage = (error, context = "operation") => {
    // Use user-friendly message from API interceptor if available
    if (error.userFriendlyMessage) {
      return error.userFriendlyMessage;
    }

    // Fallback to custom context-specific messages
    if (!error.response) {
      return `Unable to connect to the server. Please check your internet connection and try again.`;
    }

    const status = error.response.status;
    const errorData = error.response.data;
    const backendMessage = errorData?.error || errorData?.message || errorData?.detail;

    switch (status) {
      case 400:
        if (backendMessage && backendMessage.includes('consultation already exists')) {
          return 'This patient has already been consulted today. Please wait for their next appointment.';
        }
        return backendMessage || 'The information provided is not valid. Please check your entries and try again.';
      case 401:
        return 'Your session has expired. Please log in again to continue.';
      case 403:
        return `You don't have permission to ${context}. Please contact your administrator if you believe this is an error.`;
      case 404:
        return `The requested information could not be found. It may have been moved or deleted.`;
      case 409:
        return backendMessage || 'This action conflicts with existing data. Please refresh the page and try again.';
      case 422:
        return backendMessage || 'The data provided cannot be processed. Please check all required fields.';
      case 500:
        return 'A server error occurred. Please try again in a few moments or contact technical support if the problem persists.';
      case 502:
      case 503:
        return 'The server is temporarily unavailable. Please try again in a few minutes.';
      default:
        return backendMessage || `An unexpected error occurred while trying to ${context}. Please try again or contact support if the problem continues.`;
    }
  };

  // Get doctor info from localStorage only (avoid admin-only endpoints)
  React.useEffect(() => {
    setLoadingDoctorInfo(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setDoctorInfo({
          name: user.name || user.username || 'Doctor',
          staff_id: user.staff_id || user.id || 'N/A'
        });
      } else {
        setDoctorInfo({ name: 'Doctor', staff_id: 'N/A' });
      }
    } catch (e) {
      setDoctorInfo({ name: 'Doctor', staff_id: 'N/A' });
    } finally {
      setLoadingDoctorInfo(false);
    }
  }, []);

  // Fetch dashboard statistics
  const fetchStats = React.useCallback(async () => {
    setLoadingStats(true);
    try {
      // Prefer authoritative dashboard stats endpoint for these four values
      const statsRes = await getDoctorDashboardStats();
      const statsData = statsRes.data || {};

      // Map backend fields into frontend state. Support both old and new backend key names.
      const todayConsultedVal = statsData.todayConsulted ?? statsData.todayConsultationsDone ?? 0;
      const todayRemainingVal = statsData.todayRemaining ?? statsData.pendingToday ?? statsData.todayAppointmentsToConsult ?? 0;

      // Compute today's total appointments.
      // Prefer explicit 'todayTotalAppointments' if present. Otherwise, if backend provides consulted + pending, sum them.
      let todayAppointmentsVal = 0;
      if (typeof statsData.todayTotalAppointments !== 'undefined' || typeof statsData.todayTotal !== 'undefined') {
        todayAppointmentsVal = statsData.todayTotalAppointments ?? statsData.todayTotal ?? 0;
      } else if (typeof statsData.todayConsultationsDone !== 'undefined' || typeof statsData.pendingToday !== 'undefined') {
        const consulted = statsData.todayConsultationsDone ?? statsData.todayConsulted ?? 0;
        const pending = statsData.pendingToday ?? statsData.todayRemaining ?? statsData.todayAppointmentsToConsult ?? 0;
        todayAppointmentsVal = Number(consulted) + Number(pending);
      } else {
        // Fallback to other keys if available
        todayAppointmentsVal = statsData.totalAppointmentsToConsult ?? statsData.todayAppointmentsToConsult ?? 0;
      }

      const tomorrowAppointmentsVal = (statsData.tomorrowAppointments ?? statsData.tomorrow) || 0;

      setDashboardStats({
        todayAppointments: todayAppointmentsVal,
        todayConsulted: todayConsultedVal,
        todayRemaining: todayRemainingVal,
        tomorrowAppointments: tomorrowAppointmentsVal,
      });
    } catch (err) {
      console.error('[Dashboard Stats] Failed to load dashboard statistics:', err.response?.data || err);
      // Keep default values on error
    } finally {
      setLoadingStats(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleAction = async (action) => {
    console.log('handleAction called with:', action);
    try {
      switch (action) {
        case "viewAppointments": {
          console.log('Navigating to appointments page...');
          // Navigate to the existing appointments route
          navigate("/doctor/appointments");
          break;
        }
        default:
          console.log('Unrecognized action:', action);
          setMessage("Action not recognized.");
          break;
      }
    } catch (err) {
      console.error('Error in handleAction:', err);
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveModal("consult");
  };

  const openPatientHistory = async (pid) => {
    if (!pid) {
      setMessage('Validation Error: Patient ID is required to view history.');
      return;
    }
    try {
      setPatientId(pid || "");
      setHistoryError("");
      setHistoryLoading(true);
      const res = await getPatientConsultationHistory(pid);
      // New API returns: { patient_id, patient_name, history: [...] }
      const historyData = res.data?.history || [];
      setHistoryRecords(historyData);
      setShowHistoryModal(true);
      if (historyData.length === 0) {
        setHistoryError(`No consultation history found for Patient ${res.data?.patient_name || pid}`);
      }
    } catch (err) {
      console.error('[Patient History] Loading consultation history failed:', err.response?.data || err);
      setHistoryError(getErrorMessage(err, "load patient consultation history"));
      setShowHistoryModal(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleConsultSubmit = async (data) => {
    try {
      const response = await createConsultation(data);
      setMessage("✅ Consultation saved successfully! You can now prescribe medicine or lab tests.");
      setActiveModal(null);
      setLastConsultation(response.data);
      setShowPrescriptionOptions(true);
      // Refresh dashboard stats after successful consultation
      fetchStats();
      return response.data;
    } catch (err) {
      console.error('[Consultation] Creating consultation failed:', err.response?.data || err);
      const errorMsg = getErrorMessage(err, "save consultation");
      setMessage(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const handlePrescriptionSubmit = async (data) => {
    try {
      const response = await createMedicinePrescription(data);
      setMessage("✅ Medicine prescription created successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      setLastConsultation(null);
      return response.data;
    } catch (err) {
      console.error('[Prescription] Creating medicine prescription failed:', err.response?.data || err);
      const errorMsg = getErrorMessage(err, "create medicine prescription");
      setMessage(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const handleLabTestSubmit = async (data) => {
    try {
      const response = await createLabPrescription(data);
      setMessage("✅ Lab test prescription created successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      setLastConsultation(null);
      return response.data;
    } catch (err) {
      console.error('[Lab Test] Creating lab test prescription failed:', err.response?.data || err);
      const errorMsg = getErrorMessage(err, "create lab test prescription");
      setMessage(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const handleCombinedPrescriptionSubmit = async (results) => {
    try {
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
      setLastConsultation(null);
      return results;
    } catch (err) {
      console.error('[Combined Prescription] Creating combined prescription failed:', err);
      const errorMsg = getErrorMessage(err, "create combined prescription");
      setMessage(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Get staff ID from doctor info
  const staffId = doctorInfo?.staff_id || 1;

  return (
    <div className="doctor-dashboard">
      {loadingDoctorInfo ? (
        <div className="doctor-loading-container">
          <div className="doctor-loading-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="doctor-loading-text">Loading doctor information...</p>
        </div>
      ) : (
        <Doctor onAction={handleAction} doctorInfo={doctorInfo} dashboardStats={dashboardStats} darkMode={false} />
      )}

      {message && (
        <div className={`doctor-alert ${message.includes('Error') ? 'doctor-alert-error' : message.includes('success') ? 'doctor-alert-success' : 'doctor-alert-info'}`}>
          {message.includes('Error') ? <FaExclamationCircle /> : message.includes('success') ? <FaCheckCircle /> : <FaInfoCircle />}
          <span>{message}</span>
          <button className="doctor-alert-close" onClick={() => setMessage("")}>&times;</button>
        </div>
      )}


      {activeModal === "consult" && selectedAppointment && (
        <ConsultationForm
          appointment={selectedAppointment}
          staffId={staffId}
          onSubmit={handleConsultSubmit}
          onClose={() => {
            setActiveModal(null);
            setSelectedAppointment(null);
          }}
        />
      )}


      {showHistoryModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Consultation History</h5>
                <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
              </div>
              <div className="modal-body">
                {historyLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading consultation history...</p>
                  </div>
                ) : historyError ? (
                  <div className="alert alert-danger">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {historyError}
                  </div>
                ) : historyRecords.length > 0 ? (
                  <div className="consultation-history-list">
                    {historyRecords.map((record) => (
                      <div key={record.consultation_id} className="card mb-3">
                        <div className="card-header bg-primary text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Consultation ID:</strong> {record.consultation_id}
                            </div>
                            <div>
                              <small>{new Date(record.created_at).toLocaleDateString()}</small>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <p><strong>Appointment ID:</strong> {record.appointment_id}</p>
                              <p><strong>Doctor:</strong> {record.doctor_name}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Appointment Date:</strong> {new Date(record.appointment_date).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h6 className="text-primary">Symptoms:</h6>
                            <p className="text-muted">{record.symptoms || 'N/A'}</p>
                          </div>

                          <div className="mb-3">
                            <h6 className="text-primary">Diagnosis:</h6>
                            <p className="text-muted">{record.diagnosis || 'N/A'}</p>
                          </div>

                          {record.notes && (
                            <div className="mb-3">
                              <h6 className="text-primary">Notes:</h6>
                              <p className="text-muted">{record.notes}</p>
                            </div>
                          )}

                          {record.medicine_prescriptions && record.medicine_prescriptions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-success">Medicine Prescriptions:</h6>
                              {record.medicine_prescriptions.map((medPresc) => (
                                <div key={medPresc.prescription_id} className="card mb-2">
                                  <div className="card-body">
                                    <p className="mb-2"><strong>Prescription ID:</strong> {medPresc.prescription_id}</p>
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Medicine</th>
                                          <th>Dosage</th>
                                          <th>Quantity</th>
                                          <th>Instructions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {medPresc.medicines.map((med, idx) => (
                                          <tr key={idx}>
                                            <td>{med.medicine_name} ({med.medicine_id})</td>
                                            <td>{med.dosage}</td>
                                            <td>{med.quantity}</td>
                                            <td>{med.instructions || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {record.lab_prescriptions && record.lab_prescriptions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-info">Lab Test Prescriptions:</h6>
                              {record.lab_prescriptions.map((labPresc) => (
                                <div key={labPresc.prescription_id} className="card mb-2">
                                  <div className="card-body">
                                    <p className="mb-2"><strong>Prescription ID:</strong> {labPresc.prescription_id}</p>
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Test Name</th>
                                          <th>Test ID</th>
                                          <th>Instructions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {labPresc.tests.map((test, idx) => (
                                          <tr key={idx}>
                                            <td>{test.test_name}</td>
                                            <td>{test.test_id}</td>
                                            <td>{test.instructions || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted">No consultation history found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrescriptionOptions && lastConsultation && (
        <div className="prescription-options-section">
          <div className="card border-success shadow-sm mt-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-check-circle me-2"></i>
                Consultation Completed Successfully!
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-3">
                <strong>Patient:</strong> {lastConsultation.appointment_id?.patient_id?.patient_name || 'Unknown'}<br/>
                <strong>Consultation ID:</strong> {lastConsultation.consultation_id}
              </div>
              
              <h6 className="mb-3">Choose Prescription Option:</h6>
              
              {/* Single Prescription Button */}
              <div className="mb-3">
                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={() => {
                    console.log('Unified prescription button clicked');
                    setActiveModal("prescription");
                  }}
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
                  onClick={() => {
                    setShowPrescriptionOptions(false);
                    setLastConsultation(null);
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Close Prescription Options
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;