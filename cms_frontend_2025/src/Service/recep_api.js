// src/services/recep_api.js
import axios from 'axios';

// Base URL for your Django backend
const API_BASE_URL = 'http://localhost:8000/api/receptionist';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://localhost:8000/api/token/refresh/',
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// PATIENT API CALLS
// ============================================

export const patientAPI = {
  // Get all patients
  getAll: () => api.get('/patients/'),
  
  // Get single patient by ID
  getById: (id) => api.get(`/patients/${id}/`),
  
  // Create new patient
  create: (patientData) => api.post('/patients/', patientData),
  
  // Update patient
  update: (id, patientData) => api.put(`/patients/${id}/`, patientData),
  
  // Partial update
  partialUpdate: (id, patientData) => api.patch(`/patients/${id}/`, patientData),
  
  // Search patient by ID or phone
  search: (searchParams) => api.get('/patients/search/', { params: searchParams }),
  
  // Disable patient (soft delete)
  disable: (id) => api.post(`/patients/${id}/disable/`),
  
  // Get patient count
  getCount: async () => {
    const response = await api.get('/patients/');
    return response.data.length;
  },
};

// ============================================
// APPOINTMENT API CALLS
// ============================================

export const appointmentAPI = {
  // Get all appointments
  getAll: () => api.get('/appointments/'),
  
  // Get single appointment
  getById: (id) => api.get(`/appointments/${id}/`),
  
  // Create new appointment
  create: (appointmentData) => api.post('/appointments/', appointmentData),
  
  // Update appointment
  update: (id, appointmentData) => api.put(`/appointments/${id}/`, appointmentData),
  
  // Update appointment status
  updateStatus: (id, status) => 
    api.patch(`/appointments/${id}/status/`, { appoinment_status: status }),
  
  // Get pending appointments count
  getPendingCount: async () => {
    const response = await api.get('/appointments/');
    return response.data.filter(apt => apt.appoinment_status === 'Scheduled').length;
  },
  
  // Search appointments
  search: (searchParams) => api.get('/appointments/', { params: searchParams }),
};

// ============================================
// BILLING API CALLS
// ============================================

export const billingAPI = {
  // Get all billing records
  getAll: () => api.get('/billing/'),
  
  // Get single billing record
  getById: (id) => api.get(`/billing/${id}/`),
  
  // Create new billing
  create: (billingData) => api.post('/billing/', billingData),
  
  // Update billing
  update: (id, billingData) => api.put(`/billing/${id}/`, billingData),
  
  // Partial update (mark as paid)
  partialUpdate: (id, billingData) => api.patch(`/billing/${id}/`, billingData),
  
  // Get pending billing count
  getPendingCount: async () => {
    const response = await api.get('/billing/');
    return response.data.filter(bill => bill.billing_status === 'Unpaid').length;
  },
  
  // Get billing summary
  getSummary: async () => {
    const response = await api.get('/billing/');
    const bills = response.data;
    
    const total = bills.reduce((sum, bill) => sum + parseFloat(bill.consultation_fee), 0);
    const paid = bills
      .filter(b => b.billing_status === 'Paid')
      .reduce((sum, bill) => sum + parseFloat(bill.consultation_fee), 0);
    const unpaid = total - paid;
    
    return { total, paid, unpaid, count: bills.length };
  },
};

// ============================================
// STAFF/DOCTOR API
// ============================================

export const staffAPI = {
  getDoctors: async () => {
    try {
      // Use receptionist's own doctor endpoint
      const response = await api.get('/doctors/');
      console.log('Doctors fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      console.error('Error details:', error.response?.data);
      
      // Show user-friendly error
      return [];
    }
  },
};

export default api;
