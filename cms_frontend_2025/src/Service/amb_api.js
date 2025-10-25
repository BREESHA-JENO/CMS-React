// src/Service/amb_api.js
import api from "./api";

export const getAmbulances = () =>
  api.get("/api/ambulance/ambulances/");

export const createAmbulance = (data) =>
  api.post("/api/ambulance/ambulances/", data);

export const updateAmbulance = (id, data) =>
  api.put(`/api/ambulance/ambulances/${id}/`, data);

export const deleteAmbulance = (id) =>
  api.delete(`/api/ambulance/ambulances/${id}/`);

// Fetch ambulance requests (for driver or receptionist views)
export const getAmbulanceRequests = () => api.get("/api/ambulance/requests/");

// Create a request (Receptionist)
export const createAmbulanceRequest = (data) =>
  api.post("/api/ambulance/requests/create/", data);

// Update request status (Admin or Driver completing task)
export const updateAmbulanceRequestStatus = (requestId, data) =>
  api.post(`/api/ambulance/requests/${requestId}/update-status/`, data);
