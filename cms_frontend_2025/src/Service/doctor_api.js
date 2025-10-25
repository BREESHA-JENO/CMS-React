import axios from "axios";



// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper function to convert HTTP errors to user-friendly messages
const getUserFriendlyError = (error) => {
  if (!error.response) {
    return {
      message: "Unable to connect to the server. Please check your internet connection and try again.",
      type: "network"
    };
  }

  const status = error.response.status;
  const errorData = error.response.data;
  
  // Extract specific error message from backend if available
  const backendMessage = errorData?.error || errorData?.message || errorData?.detail;
  
  switch (status) {
    case 400:
      if (backendMessage && backendMessage.includes('Duplicate medicines')) {
        return {
          message: "You cannot prescribe the same medicine twice. Please remove duplicate medicines from your prescription.",
          type: "validation"
        };
      }
      if (backendMessage && backendMessage.includes('Duplicate lab tests')) {
        return {
          message: "You cannot order the same lab test twice. Please remove duplicate tests from your prescription.",
          type: "validation"
        };
      }
      if (backendMessage && backendMessage.includes('consultation already exists')) {
        return {
          message: "This patient has already been consulted today. Please wait for their next appointment.",
          type: "validation"
        };
      }
      return {
        message: backendMessage || "The information you provided is not valid. Please check your entries and try again.",
        type: "validation"
      };
    
    case 401:
      return {
        message: "Your session has expired. Please log in again to continue.",
        type: "auth"
      };
    
    case 403:
      return {
        message: "You don't have permission to perform this action. Please contact your administrator if you believe this is an error.",
        type: "permission"
      };
    
    case 404:
      return {
        message: "The requested information could not be found. It may have been moved or deleted.",
        type: "notfound"
      };
    
    case 409:
      return {
        message: backendMessage || "This action conflicts with existing data. Please refresh the page and try again.",
        type: "conflict"
      };
    
    case 422:
      return {
        message: backendMessage || "The data you provided cannot be processed. Please check all required fields.",
        type: "validation"
      };
    
    case 500:
      return {
        message: "A server error occurred. Please try again in a few moments or contact technical support if the problem persists.",
        type: "server"
      };
    
    case 502:
    case 503:
      return {
        message: "The server is temporarily unavailable. Please try again in a few minutes.",
        type: "server"
      };
    
    default:
      return {
        message: backendMessage || `An unexpected error occurred. Please try again or contact support if the problem continues.`,
        type: "unknown"
      };
  }
};

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const friendlyError = getUserFriendlyError(error);
    
    if (error.response?.status === 401) {
      // Show user-friendly message before redirect
      alert(friendlyError.message);
      window.location.href = '/login';
    }
    
    // Attach user-friendly error to the error object
    error.userFriendlyMessage = friendlyError.message;
    error.errorType = friendlyError.type;
    
    return Promise.reject(error);
  }
);

// Consultations (Doctor API)
export const createConsultation = (data) =>
  apiClient.post("/doctor/consultations/", {
    consultation_id: data.consultation_id,
    appointment_id: data.appointment_id,
    staff_id: data.staff_id,
    symptoms: data.symptoms,
    diagnosis: data.diagnosis,
    notes: data.notes
  });

export const getConsultations = () =>
  apiClient.get("/doctor/consultations/");

// Prescriptions - Medicine (Doctor API)
export const createMedicinePrescription = (data) =>
  apiClient.post("/doctor/prescriptions/med/", data);

// Prescriptions - Lab Tests
export const createLabPrescription = (payload) => apiClient.post("/doctor/prescriptions/lab/", payload);
export const getLabPrescriptions = () => apiClient.get("/doctor/prescriptions/lab/");

// Appointments
export const getAllAppointments = () => apiClient.get("/receptionist/appointments/");
export const getMyAppointments = () => apiClient.get("/doctor/appointments/");
export const getAppointmentsByDate = (date) => apiClient.get("/receptionist/appointments/", { params: { date } });
export const getTodaysAppointments = () => apiClient.get("/receptionist/appointments/", { params: {} });

// Medicines (for Doctor module) - Fetch from doctor API
export const getAllMedicines = () => apiClient.get("/doctor/medicines/");

// Lab Tests (for Doctor module) - Fetch from doctor API
export const getAllLabTests = () => apiClient.get("/doctor/lab-tests/");

// Patients (for Doctor module) - Updated to match Django backend
export const getAllPatients = () => apiClient.get("/receptionist/patients/");
export const getPatientById = (patientId) => apiClient.get(`/receptionist/patients/${patientId}/`);

// Get current doctor/staff information
export const getCurrentDoctor = () => apiClient.get("/admin/staff/me/");
// Note: admin staff endpoints are ADMIN-only; avoid for doctor users
export const getStaffById = (id) => apiClient.get(`/admin/staff/${id}/`);

// Patient Consultation History with full prescriptions
export const getPatientConsultationHistory = (patientId, month = null) => {
  const url = `/doctor/patient-history/${patientId}/`;
  const params = month ? { month } : {};
  return apiClient.get(url, { params });
};

// Get consultation by ID
export const getConsultationById = (consultationId) => apiClient.get(`/doctor/consultations/${consultationId}/`);

// Get prescription by ID
export const getMedicinePrescriptionById = (prescriptionId) => apiClient.get(`/doctor/prescriptions/med/${prescriptionId}/`);
export const getLabPrescriptionById = (prescriptionId) => apiClient.get(`/doctor/prescriptions/lab/${prescriptionId}/`);

// Dashboard Statistics
export const getDoctorDashboardStats = () => apiClient.get("/doctor/dashboard/stats/");
