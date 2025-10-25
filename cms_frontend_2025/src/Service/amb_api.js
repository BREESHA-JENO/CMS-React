// src/Service/amb_api.js
import api from "./api";

// Fetch ambulances (for Admin or Driver views)
export const getAmbulances = () => api.get("/api/ambulance/ambulances/");

// Fetch ambulance requests (for driver or receptionist views)
export const getAmbulanceRequests = () => api.get("/api/ambulance/requests/");

// Create a request (Receptionist)
export const createAmbulanceRequest = (data) =>
  api.post("/api/ambulance/requests/create/", data);

// Update request status (Admin or Driver completing task)
export const updateAmbulanceRequestStatus = (requestId, data) =>
  api.post(`/api/ambulance/requests/${requestId}/update-status/`, data);
