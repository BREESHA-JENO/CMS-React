// src/services/aeapi.js
import api from '../Service/api';

// ---------- TEMPORARY PATIENT ENDPOINTS ----------

// List all temporary patients (with optional filters)
export const listTempPatients = (params) =>
  api.get('/api/ae/temp-patient/', { params });

// Create a new temporary patient
export const addTempPatient = (payload) =>
  api.post('/api/ae/temp-patient/create/', payload);

// Get details of a single temporary patient
export const getTempPatient = (tempPatientId) =>
  api.get(`/api/ae/temp-patient/${tempPatientId}/`);

// Update a temporary patient
export const updateTempPatient = (tempPatientId, payload) =>
  api.put(`/api/ae/temp-patient/${tempPatientId}/update/`, payload);

// Delete a temporary patient
export const deleteTempPatient = (tempPatientId) =>
  api.delete(`/api/ae/temp-patient/${tempPatientId}/delete/`);

// Convert temp to permanent patient
export const convertToPermanent = (tempPatientId, payload) =>
  api.post(`/api/ae/temp-patient/${tempPatientId}/convert/`, payload);

// ---------- AE CASE ENDPOINTS ----------

// List all AE cases (with optional filters)
export const listAECases = (params) =>
  api.get('/api/ae/case/', { params });

// Create a new AE case
export const createAECase = (payload) =>
  api.post('/api/ae/case/create/', payload);

// Get details for one AE case
export const getAECase = (aeCaseId) =>
  api.get(`/api/ae/case/${aeCaseId}/`);

// Update an AE case
export const updateAECase = (aeCaseId, payload) =>
  api.put(`/api/ae/case/${aeCaseId}/update/`, payload);

// Assign ambulance to AE case
export const assignAmbulance = (aeCaseId, payload) =>
  api.post(`/api/ae/case/${aeCaseId}/assign-ambulance/`, payload);

// Search AE cases
export const searchAECases = (params) =>
  api.get('/api/ae/case/search/', { params });

// ---------- EMERGENCY TREATMENT ENDPOINTS ----------

// Create new emergency treatment
export const createTreatment = (payload) =>
  api.post('/api/ae/treatment/create/', payload);

// List all emergency treatments (with optional filters)
export const listTreatments = (params) =>
  api.get('/api/ae/treatment/list/', { params });

// Get details of a single treatment
export const getTreatment = (treatmentId) =>
  api.get(`/api/ae/treatment/${treatmentId}/`);

// Export all functions (if needed)
export default {
  listTempPatients,
  addTempPatient,
  getTempPatient,
  updateTempPatient,
  deleteTempPatient,
  convertToPermanent,
  listAECases,
  createAECase,
  getAECase,
  updateAECase,
  assignAmbulance,
  searchAECases,
  createTreatment,
  listTreatments,
  getTreatment,
};
