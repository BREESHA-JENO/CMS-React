import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStaff } from "../../Service/admin_api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getAllStaff();
        if (typeof res.data === "string" && res.data.startsWith("<!DOCTYPE html")) {
          toast.error("Your session has expired. Please login again.");
          setAllStaff([]);
          setFilteredStaff([]);
          setLoading(false);
          return;
        }
        const staffArray = Array.isArray(res.data) ? res.data : [];
        setAllStaff(staffArray);
        setFilteredStaff(staffArray);
      } catch (e) {
        toast.error("Failed to load staff data.");
        setAllStaff([]);
        setFilteredStaff([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredStaff(allStaff);
      return;
    }
    const lowerText = text.toLowerCase();
    const filtered = allStaff.filter(
      (staff) =>
        (staff.name && staff.name.toLowerCase().includes(lowerText)) ||
        (staff.staff_id && staff.staff_id.toLowerCase().includes(lowerText))
    );
    setFilteredStaff(filtered);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer />
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/admin/staff-management")}>
        Back to Dashboard
      </button>
      <h2 style={{ color: "#0153b3", marginBottom: "1rem" }}>Search Staff</h2>
      <input
        type="text"
        placeholder="Search by Name or Staff ID"
        value={searchText}
        onChange={handleSearchChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}
      />
      {filteredStaff.length === 0 ? (
        <div>No staff found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.staff_id}</td>
                <td>{staff.name}</td>
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
                      cursor: "pointer",
                    }}
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffSearch;
