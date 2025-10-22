import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // update if backend URL differs

export function useAdminDashboard() {
  const [staff, setStaff] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("staff");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [staffRes, leaveRes, passRes] = await Promise.all([
        axios.get(`${API_BASE}/staff/`),
        axios.get(`${API_BASE}/leaves/`),
        axios.get(`${API_BASE}/forgot-passwords/`),
      ]);
      setStaff(staffRes.data);
      setLeaveRequests(leaveRes.data);
      setPasswordRequests(passRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/leaves/${id}/`, { status });
      setLeaveRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status } : req))
      );
      alert(`Leave request ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const handlePasswordAction = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/forgot-passwords/${id}/`, { status });
      setPasswordRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status } : req))
      );
      alert(`Password request ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating password status:", error);
    }
  };

  return {
    staff,
    leaveRequests,
    passwordRequests,
    loading,
    activeTab,
    setActiveTab,
    handleLeaveAction,
    handlePasswordAction,
  };
}
