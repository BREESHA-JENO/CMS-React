import axios from "axios";
const base = "/api/patients/";

// Add patient
export const addPatient = (data) => axios.post(base, data);

// Get all patients
export const getPatients = () => axios.get(base);

// Search patient by id or phone
export const searchPatient = (params) => axios.get(base + "search/", { params });

// Update patient
export const updatePatient = (id, data) => axios.put(`${base}${id}/`, data);

// Delete patient
export const deletePatient = (id) => axios.delete(`${base}${id}/`);
