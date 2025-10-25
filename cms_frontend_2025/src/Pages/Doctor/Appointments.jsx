import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAppointments } from "../../Service/doctor_api";

const AppointmentsPage = () => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [doctorInfo, setDoctorInfo] = useState(null);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for date picker
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Set default date to today when component mounts
  useEffect(() => {
    setAppointmentDate(getTodayDate());
  }, []);


  useEffect(() => {
    // pull minimal doctor info from localStorage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setDoctorInfo({ name: user.name || user.username || "Doctor", staff_id: user.staff_id || user.id });
      }
    } catch { }
  }, []);

  const normalizeAppointments = (items = []) => {
    return items.map((a) => {
      // Check if patient_id is a nested object (from doctor API)
      const patientData = typeof a.patient_id === 'object' && a.patient_id !== null ? a.patient_id : null;

      return {
        ...a,
        _patientName: patientData?.patient_name || a.patient_name || a.patient?.name || 'Unknown Patient',
        _patientId: patientData?.patient_id || a.patient_code || a.patient?.patient_id || 'N/A',
        _patientPhone: patientData?.patient_phone || 'N/A',
        _patientAge: patientData?.patient_age || 'N/A',
        _date: a.appoinment_date || a.appointment_date || a.date,
        _time: a.appoinment_time || a.appointment_time || a.time,
        _appointmentId: a.appointment_id,
        _appointmentAutoId: a.appointment_auto_id || a.id,
        _doctorId: typeof a.staff === 'number' ? a.staff : (a.staff?.id || a.staff_id || a.doctor?.id || a.doctor_id),
      };
    });
  };

  const filterAppointmentsToDoctor = (items = [], staffIdVal) => {
    const sid = Number(staffIdVal);
    return items.filter((a) => Number(a._doctorId) === sid || (!a._doctorId && sid));
  };

  // Get tomorrow's date string
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  };

  // Filter to show only today and tomorrow appointments
  const filterTodayAndTomorrowAppointments = (items = []) => {
    const todayStr = getTodayDate();
    const tomorrowStr = getTomorrowDate();
    
    return items.filter(a => {
      const appointmentDate = String(a._date).slice(0, 10);
      const isToday = appointmentDate === todayStr;
      const isTomorrow = appointmentDate === tomorrowStr;
      
      if (isToday) {
        console.log(`Today's appointment: ${appointmentDate} for patient ${a._patientName}`);
      } else if (isTomorrow) {
        console.log(`Tomorrow's appointment: ${appointmentDate} for patient ${a._patientName}`);
      }
      
      return isToday || isTomorrow;
    });
  };

  const loadToday = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await getMyAppointments();
      const norm = normalizeAppointments(res.data);

      // Today filter by local date match (backend already filters consulted patients)
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      console.log('Today\'s date for filtering:', todayStr);

      // Filter by today's date only - exclude future appointments
      const filtered = norm.filter(a => {
        const appointmentDate = String(a._date).slice(0, 10);
        console.log(`Checking appointment date: ${appointmentDate} vs today: ${todayStr}`);
        
        // Only show appointments for today (not future dates)
        const isToday = appointmentDate === todayStr;
        const isFuture = appointmentDate > todayStr;
        
        if (isFuture) {
          console.log(`Excluding future appointment: ${appointmentDate}`);
        }
        
        return isToday;
      });

      setAppointments(filtered);
      if (filtered.length === 0) {
        setMessage(`No appointments scheduled for today (${new Date().toLocaleDateString()}). You have ${norm.length} total appointment${norm.length !== 1 ? 's' : ''}.`);
      } else {
        setMessage(`Successfully loaded ${filtered.length} appointment${filtered.length > 1 ? 's' : ''} for today`);
      }
    } catch (e) {
      console.error('[Appointments Page] Error:', e);
      const errorMessage = e.userFriendlyMessage || 'Unable to load today\'s appointments. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load today's appointments when page loads
  useEffect(() => {
    loadToday();
  }, [loadToday]);

  const loadTodayAndTomorrowAppointments = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await getMyAppointments();
      const norm = normalizeAppointments(res.data);
      
      // Filter to show only today and tomorrow appointments
      const filtered = filterTodayAndTomorrowAppointments(norm);
      
      console.log(`Total appointments: ${norm.length}, Today & Tomorrow: ${filtered.length}`);
      
      setAppointments(filtered);
      if (filtered.length === 0) {
        setMessage('No appointments found for today or tomorrow.');
      } else {
        const todayStr = getTodayDate();
        const tomorrowStr = getTomorrowDate();
        const todayCount = filtered.filter(a => String(a._date).slice(0, 10) === todayStr).length;
        const tomorrowCount = filtered.filter(a => String(a._date).slice(0, 10) === tomorrowStr).length;
        
        setMessage(`Successfully loaded ${filtered.length} appointment${filtered.length > 1 ? 's' : ''}: ${todayCount} for today, ${tomorrowCount} for tomorrow`);
      }
    } catch (e) {
      console.error('[Appointments Page] Error:', e);
      const errorMessage = e.userFriendlyMessage || 'Unable to load appointments. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadByDate = async () => {
    if (!appointmentDate) {
      setMessage('Please select a date to search appointments.');
      return;
    }
    
    // Check if selected date is beyond tomorrow
    const todayStr = getTodayDate();
    const tomorrowStr = getTomorrowDate();
    
    if (appointmentDate > tomorrowStr) {
      setMessage(`⚠️ Only today's and tomorrow's appointments are available. Selected date ${new Date(appointmentDate + 'T00:00:00').toLocaleDateString()} is beyond tomorrow. Please select today or tomorrow.`);
      setAppointments([]);
      return;
    }
    
    console.log('Loading appointments for date:', appointmentDate);
    setLoading(true);
    setMessage("");
    try {
      const res = await getMyAppointments();
      console.log('Raw API response:', res.data);
      const norm = normalizeAppointments(res.data);
      console.log('Normalized appointments:', norm);
      
      // Backend already filters by doctor, just filter by date
      const filtered = norm.filter(a => {
        const appointmentDateStr = String(a._date).slice(0, 10);
        console.log(`Comparing appointment date ${appointmentDateStr} with selected date ${appointmentDate}`);
        return appointmentDateStr === appointmentDate;
      });
      
      console.log('Filtered appointments for selected date:', filtered);
      setAppointments(filtered);
      
      if (filtered.length === 0) {
        setMessage(`No appointments found for ${new Date(appointmentDate + 'T00:00:00').toLocaleDateString()}. You have ${norm.length} total appointment${norm.length !== 1 ? 's' : ''}.`);
      } else {
        setMessage(`Successfully loaded ${filtered.length} appointment${filtered.length > 1 ? 's' : ''} for ${new Date(appointmentDate + 'T00:00:00').toLocaleDateString()}`);
      }
    } catch (e) {
      console.error('[Appointments Page] Error:', e);
      const errorMessage = e.userFriendlyMessage || 'Unable to load appointments for the selected date. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goConsult = (appointment) => {
    navigate("/doctor/consult", { state: { appointment } });
  };

  const goHistory = (patientId) => {
    console.log('Navigating to history for patient ID:', patientId);
    if (!patientId || patientId === 'N/A') {
      alert('Patient ID not available. Cannot view history.');
      return;
    }
    navigate(`/doctor/history/${patientId}`);
  };

  return (
    <div className="container-fluid" style={{ padding: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="text-primary mb-1">Appointments</h2>
          {doctorInfo && (
            <p className="text-muted mb-0">Welcome, Dr. {doctorInfo.name} (ID: {doctorInfo.staff_id})</p>
          )}
        </div>
        <div>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/doctor")}>Back to Dashboard</button>
        </div>
      </div>

      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            📅 Calendar & Appointment Search
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info mb-3">
            <i className="fas fa-info-circle me-2"></i>
            <strong>How to use:</strong> Click the date picker to open calendar or search by specific date. 
            <br/><strong>Today's appointments:</strong> Can be consulted immediately.
            <br/><strong>Tomorrow's appointments:</strong> View-only (consultation available tomorrow).
          </div>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <button className="btn btn-success w-100 py-2" onClick={loadToday} disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin me-2"></i>Loading...</>
                ) : (
                  <><i className="fas fa-calendar-day me-2"></i>Today's Appointments</>
                )}
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-info w-100 py-2" onClick={loadTodayAndTomorrowAppointments} disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin me-2"></i>Loading...</>
                ) : (
                  <><i className="fas fa-calendar-week me-2"></i>Today & Tomorrow</>
                )}
              </button>
            </div>
            <div className="col-md-4">
              <label htmlFor="appointmentDate" className="form-label fw-bold">
                <i className="fas fa-calendar-alt me-2"></i>
                Pick a Date from Calendar
              </label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <i className="fas fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="appointmentDate"
                  className="form-control form-control-lg border-primary"
                  value={appointmentDate}
                  max={getTomorrowDate()}
                  onChange={(e) => {
                    console.log('Date picker changed to:', e.target.value);
                    setAppointmentDate(e.target.value);
                    // Auto-search when date changes (with small delay)
                    if (e.target.value) {
                      setTimeout(() => {
                        console.log('Auto-searching for date:', e.target.value);
                        loadByDate();
                      }, 500);
                    }
                  }}
                  onFocus={(e) => {
                    console.log('Date picker focused');
                    e.target.showPicker && e.target.showPicker();
                  }}
                  title="Click to open calendar and select a date (future dates disabled)"
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '12px',
                    borderWidth: '2px',
                    minHeight: '48px'
                  }}
                  placeholder="Click to select date from calendar"
                />
              </div>
              <small className="text-muted mt-1">
                Selected: {appointmentDate ? new Date(appointmentDate + 'T00:00:00').toLocaleDateString() : 'No date selected'}
              </small>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100 py-2"
                onClick={loadByDate}
                disabled={!appointmentDate || loading}
                title="Search appointments for selected date"
              >
                <i className="fas fa-search me-2"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-info"}`}>{message}</div>
      )}

      <div className="row">
        {appointments.map((appointment) => {
          const appointmentDate = String(appointment._date).slice(0, 10);
          const todayStr = getTodayDate();
          const tomorrowStr = getTomorrowDate();
          const isToday = appointmentDate === todayStr;
          const isTomorrow = appointmentDate === tomorrowStr;
          
          return (
            <div key={appointment._appointmentAutoId} className="col-lg-4 col-md-6 mb-3">
              <div className={`card h-100 ${isTomorrow ? 'border-warning' : ''}`}>
                {isTomorrow && (
                  <div className="card-header bg-warning text-dark">
                    <small><i className="fas fa-clock me-1"></i><strong>Tomorrow's Appointment</strong> - View Only</small>
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className={`avatar-sm ${isToday ? 'bg-primary' : 'bg-warning'} rounded-circle d-flex align-items-center justify-content-center me-3`}>
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">{appointment._patientName}</h6>
                      <small className="text-muted">ID: {appointment._patientId || "N/A"}</small>
                    </div>
                  </div>
                  <div className="row text-center mb-2">
                    <div className="col-6">
                      <small className="text-muted">Appointment ID</small>
                      <div className="fw-bold">{appointment._appointmentId}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Date</small>
                      <div className="fw-bold">{appointment._date}</div>
                    </div>
                  </div>
                  <div className="text-center mb-3">
                    <small className="text-muted">Time</small>
                    <div className="fw-bold">{appointment._time}</div>
                  </div>
                  <div className="d-grid gap-2">
                    {isToday ? (
                      // Today's appointments - can consult
                      <>
                        <button className="btn btn-primary" onClick={() => goConsult(appointment)}>
                          <i className="fas fa-stethoscope me-2"></i>
                          Consult Patient
                        </button>
                        <button className="btn btn-outline-info btn-sm" onClick={() => goHistory(appointment._patientId || "")}>
                          <i className="fas fa-history me-2"></i>
                          View History
                        </button>
                      </>
                    ) : (
                      // Tomorrow's appointments - view history only
                      <>
                        <div className="alert alert-warning mb-2 py-2">
                          <small><i className="fas fa-info-circle me-1"></i>Consultation available tomorrow</small>
                        </div>
                        <button className="btn btn-outline-info" onClick={() => goHistory(appointment._patientId || "")}>
                          <i className="fas fa-history me-2"></i>
                          View Patient History
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsPage;
