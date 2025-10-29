import api from './api';

// Use the configured api instance with the correct base URL
const apiClient = api;

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
  apiClient.post("/api/doctor/consultations/", {
    consultation_id: data.consultation_id,
    appointment_id: data.appointment_id,
    staff_id: data.staff_id,
    symptoms: data.symptoms,
    diagnosis: data.diagnosis,
    notes: data.notes
  });

export const getConsultations = () =>
  apiClient.get("/api/doctor/consultations/");

// Create medicine prescription
export const createMedicinePrescription = async (consultationId, details) => {
    try {
        const formattedDetails = details.map(detail => ({
      medicine: detail.isCustom ? null : detail.medicine,
      // serializer expects empty string for custom name when not provided (not null)
      custom_medicine_name: detail.isCustom ? (detail.customMedicine || '') : '',
            dosage: detail.dosage,
            quantity: parseInt(detail.quantity),
            instructions: detail.instructions || ''
        }));

    const payload = {
      // ensure consultation id is numeric PK where possible
      consultation_id: Number.isInteger(consultationId) ? consultationId : parseInt(consultationId, 10),
      details: formattedDetails
    };

    const response = await apiClient.post("/api/doctor/prescriptions/med/", payload);
        return response.data;
    } catch (error) {
        console.error("[Medicine Prescription] Error:", error);
        const errorMsg = error.response?.data?.message 
            || error.response?.data?.error 
            || error.message 
            || "Failed to create medicine prescription";
        throw new Error(errorMsg);
    }
};

// Prescriptions - Lab Tests
export const createLabPrescription = async (consultationId, details) => {
    try {
    const formattedDetails = details.map(detail => {
      const labVal = detail.lab_test;
      const labPk = detail.isCustom ? null : (labVal === '' || labVal == null ? null : Number(labVal));
      return {
        lab_test: labPk,
        // serializer doesn't accept null for custom name; send empty string when not provided
        custom_lab_test_name: detail.isCustom ? (detail.customLabTest || '') : '',
        instructions: detail.instructions || ''
      };
    });
    const payload = {
      consultation_id: Number.isInteger(consultationId) ? consultationId : parseInt(consultationId, 10),
      details: formattedDetails
    };

  // Debug: log payload to help diagnose PK/type issues
  console.log('[Lab Prescription] Payload:', JSON.stringify(payload, null, 2));
  const response = await apiClient.post("/api/doctor/prescriptions/lab/", payload);
    return response.data;
    } catch (error) {
        console.error("[Lab Prescription] Error:", error);
        const errorMsg = error.response?.data?.message 
            || error.response?.data?.error 
            || error.message 
            || "Failed to create lab prescription";
        throw new Error(errorMsg);
    }
};

export const getLabPrescriptions = () => apiClient.get("/api/doctor/prescriptions/lab/");

// Appointments
export const getMyAppointments = async (date) => {
    try {
        console.log('[Doctor API] Fetching appointments for date:', date);
        const response = await apiClient.get("/api/doctor/appointments/", {
            params: { date }
        });
        console.log('[Doctor API] Appointments response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[Doctor API] Failed to fetch appointments:', error);
        throw error;
    }
};

// Medicines (for Doctor module) - Fetch from doctor API
// Get all medicines for prescription
export const getAllMedicines = async () => {
    try {
  const response = await apiClient.get("/api/doctor/medicines/");
        return response.data;
    } catch (error) {
        console.error("[Medicines] Error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to fetch medicines";
        throw new Error(errorMsg);
    }
};

// Get all lab tests
export const getAllLabTests = async () => {
    try {
  const response = await apiClient.get("/api/doctor/lab-tests/");
    // Normalize backend shape to frontend expected keys
    // Backend may return keys like { Id, test_id, test_name, price }
    if (Array.isArray(response.data)) {
      return response.data.map(item => ({
        // Primary key used by backend is `Id`
        test_auto_id: item.Id ?? item.id ?? item.test_auto_id,
        test_id: item.test_id ?? item.LabTestId ?? null,
        test_name: item.test_name ?? item.LabTestName ?? item.test_name,
        rate: item.price ?? item.Rate ?? item.rate ?? '0'
      }));
    }
    return [];
    } catch (error) {
        console.error("[Lab Tests] Error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to fetch lab tests";
        throw new Error(errorMsg);
    }
};

// Patients (for Doctor module) - Updated to match Django backend
export const getAllPatients = () => apiClient.get("/api/receptionist/patients/");
export const getPatientById = (patientId) => apiClient.get(`/api/receptionist/patients/${patientId}/`);

// Get current doctor/staff information
export const getCurrentDoctor = () => apiClient.get("/api/admin/staff/me/");
// Note: admin staff endpoints are ADMIN-only; avoid for doctor users
export const getStaffById = (id) => apiClient.get(`/api/admin/staff/${id}/`);

// Patient Consultation History with full prescriptions
export const getPatientConsultationHistory = (patientId, month = null) => {
  const url = `/api/doctor/patient-history/${patientId}/`;
  const params = month ? { month } : {};
  return apiClient.get(url, { params });
};

// Get consultation by ID
export const getConsultationById = (consultationId) => apiClient.get(`/doctor/consultations/${consultationId}/`);

// Get prescription by ID
export const getMedicinePrescriptionById = (prescriptionId) => apiClient.get(`/api/doctor/prescriptions/med/${prescriptionId}/`);
export const getLabPrescriptionById = (prescriptionId) => apiClient.get(`/api/doctor/prescriptions/lab/${prescriptionId}/`);

// Dashboard Statistics
export const getDoctorDashboardStats = () => apiClient.get("/api/doctor/dashboard/stats/");
