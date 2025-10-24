import React, { useState } from "react";
import Doctor from "../../components/Doctor/Doctor";
import Header1 from "../../Elements/Header1";
import Footer1 from "../../Elements/Footer1";
import ConsultationForm from "../../components/Doctor/ConsultationForm";
import PrescriptionForm from "../../components/Doctor/PrescriptionForm";
import LabTestForm from "../../components/Doctor/LabTestForm";
import "../../components/Doctor/Doctor.css";
import {
  getTodaysAppointments,
  getAppointmentsByDate,
  createConsultation,
  createMedicinePrescription,
  createLabPrescription,
  getPatientConsultationHistory,
  getCurrentDoctor,
  getStaffById,
  getDashboardStats,
  getTotalAppointmentsCount,
  getTodaysAppointmentsCount,
  getTotalConsultationsCount,
  getPendingAppointmentsCount,
} from "../../Service/doctor_api";

const DoctorDashboard = () => {
  const [message, setMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [lastConsultation, setLastConsultation] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionOptions, setShowPrescriptionOptions] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loadingDoctorInfo, setLoadingDoctorInfo] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalConsultations: 0,
    pendingAppointments: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Get doctor info from localStorage or API
  React.useEffect(() => {
    const fetchDoctorInfo = async () => {
      setLoadingDoctorInfo(true);
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            // If we have a staff_id, fetch the full doctor info from backend
            if (user.staff_id || user.id) {
              const staffId = user.staff_id || user.id;
              try {
                const response = await getStaffById(staffId);
                const staffData = response.data;
                setDoctorInfo({
                  name: staffData.name || staffData.username || 'Doctor',
                  staff_id: staffData.staff_auto_id || staffData.id || staffId
                });
              } catch (error) {
                console.error("Error fetching staff data:", error);
                // Fallback to stored user data
                setDoctorInfo({
                  name: user.name || user.username || 'Doctor',
                  staff_id: user.staff_id || user.id || 'N/A'
                });
              }
            } else {
              setDoctorInfo({
                name: user.name || user.username || 'Doctor',
                staff_id: user.staff_id || user.id || 'N/A'
              });
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
            // Set default if parsing fails
            setDoctorInfo({
              name: 'Doctor',
              staff_id: 'N/A'
            });
          }
        } else {
          // No stored user, try to get current user from backend
          try {
            const response = await getCurrentDoctor();
            const staffData = response.data;
            setDoctorInfo({
              name: staffData.name || staffData.username || 'Doctor',
              staff_id: staffData.staff_auto_id || staffData.id || 'N/A'
            });
          } catch (error) {
            console.error("Error fetching current doctor:", error);
            setDoctorInfo({
              name: 'Doctor',
              staff_id: 'N/A'
            });
          }
        }
      } catch (error) {
        console.error("Error in fetchDoctorInfo:", error);
        setDoctorInfo({
          name: 'Doctor',
          staff_id: 'N/A'
        });
      } finally {
        setLoadingDoctorInfo(false);
      }
    };

    fetchDoctorInfo();
  }, []);

  // Fetch dashboard statistics
  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      try {
        // Try to get combined stats first
        try {
          const response = await getDashboardStats();
          setDashboardStats(response.data);
        } catch (error) {
          console.log("Combined stats not available, fetching individual counts");
          // If combined stats not available, fetch individual counts
          const [totalApps, todayApps, totalConsults, pendingApps] = await Promise.allSettled([
            getTotalAppointmentsCount(),
            getTodaysAppointmentsCount(),
            getTotalConsultationsCount(),
            getPendingAppointmentsCount()
          ]);

          setDashboardStats({
            totalAppointments: totalApps.status === 'fulfilled' ? totalApps.value.data.count || totalApps.value.data : 0,
            todayAppointments: todayApps.status === 'fulfilled' ? todayApps.value.data.count || todayApps.value.data : 0,
            totalConsultations: totalConsults.status === 'fulfilled' ? totalConsults.value.data.count || totalConsults.value.data : 0,
            pendingAppointments: pendingApps.status === 'fulfilled' ? pendingApps.value.data.count || pendingApps.value.data : 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Set default values if all API calls fail
        setDashboardStats({
          totalAppointments: 0,
          todayAppointments: 0,
          totalConsultations: 0,
          pendingAppointments: 0
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleAction = async (action) => {
    try {
      switch (action) {
        case "viewAppointments": {
          setCurrentView("appointments");
          setMessage("");
          break;
        }
        default:
          setMessage("Action not recognized.");
          break;
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleViewTodaysAppointments = async () => {
    try {
      const todayAppointments = await getTodaysAppointments();
      setAppointments(todayAppointments.data);
      setMessage(`Found ${todayAppointments.data.length} appointments for today`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleViewAppointmentsByDate = async () => {
    try {
      const appointmentsByDate = await getAppointmentsByDate(appointmentDate);
      setAppointments(appointmentsByDate.data);
      setMessage(`Found ${appointmentsByDate.data.length} appointments for ${appointmentDate}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const openPatientHistory = async (pid) => {
    try {
      setPatientId(pid || "");
      setHistoryError("");
      setHistoryLoading(true);
      const res = await getPatientConsultationHistory(pid);
      setHistoryRecords(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      setShowHistoryModal(true);
    } catch (err) {
      setHistoryError(err.response?.data?.error || err.message || "Failed to load history.");
      setShowHistoryModal(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveModal("consult");
  };

  const handleConsultSubmit = async (data) => {
    try {
      const response = await createConsultation(data);
      setMessage("Consultation saved successfully! You can now prescribe medicine or lab tests.");
      setActiveModal(null);
      setLastConsultation(response.data);
      setShowPrescriptionOptions(true);
      return response.data;
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
      throw err;
    }
  };

  const handlePrescriptionSubmit = async (data) => {
    try {
      const response = await createMedicinePrescription(data);
      setMessage("Medicine prescribed successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      setLastConsultation(null);
      return response.data;
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
      throw err;
    }
  };

  const handleLabTestSubmit = async (data) => {
    try {
      const response = await createLabPrescription(data);
      setMessage("Lab test prescribed successfully!");
      setActiveModal(null);
      setShowPrescriptionOptions(false);
      setLastConsultation(null);
      return response.data;
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
      throw err;
    }
  };

  // Get staff ID from doctor info
  const staffId = doctorInfo?.staff_id || 1;

  const renderAppointmentsView = () => (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">📅 Appointment Management</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <button 
                    className="btn btn-success btn-lg w-100 mb-3"
                    onClick={handleViewTodaysAppointments}
                  >
                    <i className="fas fa-calendar-day me-2"></i>
                    View Today's Appointments
                  </button>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                      <input
                        type="date"
                        className="form-control"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    <button 
                      className="btn btn-info"
                      onClick={handleViewAppointmentsByDate}
                      disabled={!appointmentDate}
                    >
                      <i className="fas fa-search me-2"></i>
                      Search by Date
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Available Appointments ({appointments.length})</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {appointments.map((appointment) => (
                    <div key={appointment.appointment_auto_id} className="col-lg-4 col-md-6 mb-3">
                      <div className="card h-100 border-left-primary">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                              <i className="fas fa-user text-white"></i>
                            </div>
                            <div>
                              <h6 className="mb-0">{appointment.patient_id?.patient_name || 'Unknown Patient'}</h6>
                              <small className="text-muted">ID: {appointment.patient_id?.patient_id || 'N/A'}</small>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-muted">Appointment ID</small>
                                <div className="fw-bold">{appointment.appointment_id}</div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Date</small>
                                <div className="fw-bold">{appointment.appoinment_date}</div>
                              </div>
                            </div>
                            <div className="text-center mt-2">
                              <small className="text-muted">Time</small>
                              <div className="fw-bold">{appointment.appoinment_time}</div>
                            </div>
                          </div>
                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-primary"
                              onClick={() => handleAppointmentSelect(appointment)}
                            >
                              <i className="fas fa-stethoscope me-2"></i>
                              Consult Patient
                            </button>
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => openPatientHistory(appointment.patient_id?.patient_id || '')}
                            >
                              <i className="fas fa-history me-2"></i>
                              View History
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrescriptionOptions && lastConsultation && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">✅ Consultation Completed Successfully!</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Patient:</strong> {lastConsultation.appointment_id?.patient_id?.patient_name || 'Unknown'}</p>
                    <p><strong>Consultation ID:</strong> {lastConsultation.consultation_id}</p>
                  </div>
                  <div className="col-md-6 text-end">
                    <button 
                      className="btn btn-warning btn-lg me-2"
                      onClick={() => setActiveModal("medicine")}
                    >
                      <i className="fas fa-pills me-2"></i>
                      Prescribe Medicine
                    </button>
                    <button 
                      className="btn btn-info btn-lg"
                      onClick={() => setActiveModal("lab")}
                    >
                      <i className="fas fa-vial me-2"></i>
                      Prescribe Lab Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case "appointments":
        return renderAppointmentsView();
      default:
        return null;
    }
  };

  return (
    <>
      <Header1 />
      <div className="doctor-dashboard" style={{ margin: "1rem", minHeight: "80vh" }}>
        {loadingDoctorInfo ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading doctor information...</p>
            </div>
          </div>
        ) : currentView === "dashboard" ? (
          <Doctor onAction={handleAction} doctorInfo={doctorInfo} dashboardStats={dashboardStats} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-primary mb-1">
                  {currentView === "appointments" && "📅 Appointment Management"}
                </h2>
                {doctorInfo && (
                  <p className="text-muted mb-0">
                    Welcome, Dr. {doctorInfo.name} (ID: {doctorInfo.staff_id})
                  </p>
                )}
              </div>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setCurrentView("dashboard")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
            </div>
            {renderCurrentView()}
          </div>
        )}
        
        <div className="mt-3">
          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'} alert-dismissible fade show`}>
              <i className={`fas ${message.includes('Error') ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2`}></i>
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
            </div>
          )}
        </div>

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

        {activeModal === "medicine" && lastConsultation && (
          <PrescriptionForm
            consultation={lastConsultation}
            staffId={staffId}
            onSubmit={handlePrescriptionSubmit}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === "lab" && lastConsultation && (
          <LabTestForm
            consultation={lastConsultation}
            staffId={staffId}
            onSubmit={handleLabTestSubmit}
            onClose={() => setActiveModal(null)}
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
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Consultation ID</th>
                            <th>Patient Name</th>
                            <th>Consultation Date</th>
                            <th>Prescription</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyRecords.map((record) => (
                            <tr key={record.consultation_id}>
                              <td>{record.consultation_id}</td>
                              <td>{record.patient_name}</td>
                              <td>{record.consultation_date}</td>
                              <td>{record.prescription}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
      </div>
      <Footer1 />
    </>
  );
};

export default DoctorDashboard;