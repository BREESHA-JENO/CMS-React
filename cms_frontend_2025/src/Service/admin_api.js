import api from "./api"; // the configured axios instance

// STAFF MANAGEMENT
export const getAllStaff = () => api.get("/api/admin/staff/");
export const getStaffByRole = (role) => api.get(`/api/admin/staff/?role=${role}`);
export const getStaffById = (id) => api.get(`/api/admin/staff/${id}/`);
export const createStaff = (data, config) => api.post("/api/admin/staff/", data, config);
export const updateStaff = (id, data, config) => api.put(`/api/admin/staff/${id}/`, data, config);
export const disableStaff = (id) => api.post(`/api/admin/staff/${id}/disable/`);
export const enableStaff = (id) => api.post(`/api/admin/staff/${id}/enable/`);


// LEAVE REQUESTS
export const getLeaveRequests = () => api.get("/admin/leave-requests/");
export const createLeaveRequest = (data) => api.post("/admin/leave-requests/", data);
export const updateLeaveRequestStatus = (id, data) => api.patch(`/admin/leave-requests/${id}/`, data);

export const changePassword = (data) => api.post("/api/admin/change-password/", data);

// SPECIALIZATIONS
export const getSpecializations = () => api.get("/api/admin/specializations/");
export const getSpecializationById = (id) => api.get(`/api/admin/specializations/${id}/`);
export const addSpecialization = (data) => api.post("/api/admin/specializations/", data);
export const updateSpecialization = (id, data) => api.put(`/api/admin/specializations/${id}/`, data);
export const disableSpecialization = (id) => api.post(`/api/admin/specializations/${id}/disable/`);
export const enableSpecialization = (id) => api.post(`/api/admin/specializations/${id}/enable/`);

// WORKING DAYS
export const getWorkingDays = () => api.get("api/admin/working-days/");
export const createWorkingDay = (data) => api.post("api/admin/working-days/", data);
export const deleteWorkingDay = (id) => api.delete(`api/admin/working-days/${id}/`);

// DOCTOR SCHEDULES
export const getDoctorSchedules = () => api.get("api/admin/doctor-schedules/");
export const createDoctorSchedule = (data) => api.post("api/admin/doctor-schedules/", data);
export const updateDoctorSchedule = (id, data) => api.put(`api/admin/doctor-schedules/${id}/`, data);
export const deleteDoctorSchedule = (id) => api.delete(`api/admin/doctor-schedules/${id}/`);

// FORGOT PASSWORD REQUESTS
export const getForgotPasswordRequests = () => api.get("/api/admin/forgot-password-requests/");
export const processForgotPasswordRequest = (id, data) => api.put(`/api/admin/forgot-password-requests/${id}/`, data);
export const forgotPasswordRequest = (email) =>api.post("/api/admin/forgot-password-requests/", { staff_email: email });

