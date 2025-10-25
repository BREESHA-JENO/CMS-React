import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStaff, disableStaff, enableStaff } from "../../Service/admin_api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getAllStaff(); // Should return both active and inactive staff
      if (
        typeof res.data === "string" &&
        res.data.startsWith("<!DOCTYPE html")
      ) {
        toast.error("Your session has expired. Please login again.");
        setStaffList([]);
        setLoading(false);
        return;
      }
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error("Failed to load staff data.");
      setStaffList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleActive = async (staff) => {
    const action = staff.is_active ? "disable" : "enable";
    if (!window.confirm(`Are you sure to ${action} this staff?`)) return;

    try {
      if (staff.is_active) {
        await disableStaff(staff.id);
      } else {
        await enableStaff(staff.id); // Make sure this API call exists!
      }
      toast.success(`Staff ${action}d successfully.`);
      fetchStaff();
    } catch {
      toast.error(`Failed to ${action} staff.`);
    }
  };

  if (loading) return <div>Loading...</div>;

  // StaffList.jsx (updated only the relevant JSX and handlers)

return (
  <div>
    <ToastContainer />
    <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/admin/staff-management")}>
      Back to Dashboard
    </button>
    <h2 style={{ color: "#0153b3", marginBottom: "2rem" }}>Staff List</h2>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Profile</th>
          <th>Staff ID</th>
          <th>Name</th>
          <th>Username</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staffList.map(staff => (
          <tr key={staff.id} style={{ background: staff.is_active ? "#fff" : "#f9fafb" }}>
            <td>
              {staff.profile_image ? (
                <img
                  src={staff.profile_image}
                  alt={`${staff.name}'s profile`}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
              )}
            </td>
            <td>{staff.staff_id}</td>
            <td>{staff.name}</td>
            <td>{staff.user_info?.username}</td> 
            <td>{staff.user_info?.role}</td>
            <td>{staff.email}</td>
            <td>{staff.phone_number}</td>
            <td>
              <button
                onClick={() => navigate(`/admin/staff-form/${staff.id}`)}
                style={{
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.4em 0.8em",
                  marginRight: "0.5rem",
                  cursor: "pointer"
                }}
                title="Edit Staff"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleActive(staff)}
                style={{
                  background: staff.is_active ? "#0153b3" : "#38b000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.4em 1em",
                  cursor: "pointer"
                }}
                title={staff.is_active ? "Disable Staff" : "Enable Staff"}
              >
                {staff.is_active ? "Disable" : "Enable"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default StaffList;
