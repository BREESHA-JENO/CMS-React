import axios from "axios";
import api from "./api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Login API call
export const loginUser = (username, password) =>
  axios.post(`${BASE_URL}/auth/login/`, { username, password });

// Forgot password API call
export const forgotPasswordRequest = (identifier) =>
  api.post("/api/admin/forgot-password-requests/", { staff_email: identifier });
