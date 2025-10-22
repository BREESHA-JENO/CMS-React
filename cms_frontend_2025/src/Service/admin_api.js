import api from "./api"; // the configured axios instance

// STAFF MANAGEMENT
export const getAllStaff = () => api.get("/admin/staff/");
export const getStaffByRole = (role) => api.get(`/admin/staff/?role=${role}`);
export const getStaffById = (id) => api.get(`/admin/staff/${id}/`);
export const createStaff = (data) => api.post("/admin/staff/", data);
export const updateStaff = (id, data) => api.put(`/admin/staff/${id}/`, data);
export const deleteStaff = (id) => api.delete(`/admin/staff/${id}/`);

// LEAVE REQUESTS
export const getLeaveRequests = () => api.get("/admin/leave-requests/");
export const createLeaveRequest = (data) => api.post("/admin/leave-requests/", data);
export const updateLeaveRequestStatus = (id, data) => api.patch(`/admin/leave-requests/${id}/`, data);

// SPECIALIZATIONS
export const getSpecializations = () => api.get("/admin/specializations/");
export const addSpecialization = (data) => api.post("/admin/specializations/", data);
export const deleteSpecialization = (id) => api.delete(`/admin/specializations/${id}/`);

// WORKING DAYS
export const getWorkingDays = () => api.get("/admin/working-days/");
export const createWorkingDay = (data) => api.post("/admin/working-days/", data);
export const deleteWorkingDay = (id) => api.delete(`/admin/working-days/${id}/`);

// DOCTOR SCHEDULES
export const getDoctorSchedules = () => api.get("/admin/doctor-schedules/");
export const createDoctorSchedule = (data) => api.post("/admin/doctor-schedules/", data);
export const updateDoctorSchedule = (id, data) => api.put(`/admin/doctor-schedules/${id}/`, data);
export const deleteDoctorSchedule = (id) => api.delete(`/admin/doctor-schedules/${id}/`);

// FORGOT PASSWORD REQUESTS
export const getForgotPasswordRequests = () => api.get("/admin/forgot-password-requests/");
export const processForgotPasswordRequest = (id, data) => api.put(`/admin/forgot-password-requests/${id}/`, data);
