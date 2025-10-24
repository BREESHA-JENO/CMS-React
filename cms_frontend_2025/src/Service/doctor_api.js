import axios from "axios";



// Create axios instance with custom config
const apiClient = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || "",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Consultations
export const createConsultation = (data) =>
  apiClient.post("/consultations/", {
    consultation_id: data.consultation_id,
    appointment_id: data.appointment_id,
    staff_id: data.staff_id,
    symptoms: data.symptoms,
    diagnosis: data.diagnosis,
    notes: data.notes
  });

export const getConsultations = () =>
  apiClient.get("/consultations/");

// Prescriptions - Medicine
export const createMedicinePrescription = (data) =>
  apiClient.post("/prescriptions/med/", {
    consultation_id: data.consultation_id,
    appointment_id: data.appointment_id,
    staff_id: data.staff_id,
    details: data.medicines.map(med => ({
      medicine: med.medicine,
      dosage: med.dosage,
      quantity: med.quantity,
      instructions: med.instructions
    }))
  });

export const getMedicinePrescriptions = () =>
  apiClient.get("/prescriptions/med/");

// Prescriptions - Lab Tests
export const createLabPrescription = (data) =>
  apiClient.post("/prescriptions/lab/", {
    consultation_id: data.consultation_id,
    appointment_id: data.appointment_id,
    staff_id: data.staff_id,
    details: data.lab_tests.map(test => ({
      lab_test: test.lab_test,
      instructions: test.instructions
    }))
  });

export const getLabPrescriptions = () =>
  apiClient.get("/prescriptions/lab/");

// Appointments
export const getAllAppointments = () =>
  apiClient.get("/receptionist/appointments/");

export const getTodaysAppointments = () =>
  apiClient.get("/receptionist/appointments/today/");

export const getAppointmentsByDate = (date) =>
  apiClient.get(`/receptionist/appointments/?date=${date}`);

// Medicines (for Doctor module) - Temporary stub until pharmacist API is ready
export const getAllMedicines = () =>
  Promise.resolve({ data: [
    { med_auto_id: 1, name: 'Paracetamol', med_id: 'MED001' },
    { med_auto_id: 2, name: 'Amoxicillin', med_id: 'MED002' },
    { med_auto_id: 3, name: 'Ibuprofen', med_id: 'MED003' }
  ]});

// Lab Tests (for Doctor module) - Updated to match Django backend  
export const getAllLabTests = () =>
  apiClient.get("/labtech/tests/");

// Patients (for Doctor module) - Updated to match Django backend
export const getAllPatients = () =>
  apiClient.get("/receptionist/patients/");

export const getPatientById = (patientId) =>
  apiClient.get(`/receptionist/patients/${patientId}/`);

// Get current doctor/staff information
export const getCurrentDoctor = () =>
  apiClient.get("/admin/staff/me/");

export const getStaffById = (staffId) =>
  apiClient.get(`/admin/staff/${staffId}/`);

// Patient Consultation History
export const getPatientConsultationHistory = (patientId) =>
  apiClient.get(`/consultations/?patient_id=${patientId}`);

// Get consultation by ID
export const getConsultationById = (consultationId) =>
  apiClient.get(`/consultations/${consultationId}/`);

// Get prescription by ID
export const getMedicinePrescriptionById = (prescriptionId) =>
  apiClient.get(`/prescriptions/med/${prescriptionId}/`);

export const getLabPrescriptionById = (prescriptionId) =>
  apiClient.get(`/prescriptions/lab/${prescriptionId}/`);

// Dashboard Statistics
export const getDashboardStats = () =>
  apiClient.get("/doctor/dashboard-stats/");

// Get total appointments count
export const getTotalAppointmentsCount = () =>
  apiClient.get("/receptionist/appointments/count/");

// Get today's appointments count
export const getTodaysAppointmentsCount = () =>
  apiClient.get("/receptionist/appointments/today/count/");

// Get total consultations count
export const getTotalConsultationsCount = () =>
  apiClient.get("/consultations/count/");

// Get pending appointments count
export const getPendingAppointmentsCount = () =>
  apiClient.get("/receptionist/appointments/pending/count/");
