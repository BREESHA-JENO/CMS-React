import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Login API call
export const loginUser = (username, password) =>
  axios.post(`${BASE_URL}/auth/login/`, { username, password });

// Forgot password API call
export const forgotPasswordRequest = (email) =>
  axios.post(`${BASE_URL}/api/forgot-password/`, { email });
