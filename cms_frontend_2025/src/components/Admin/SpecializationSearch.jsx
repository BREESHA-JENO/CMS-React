import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSpecializations } from "../../Service/admin_api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpecializationSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecs = async () => {
      setLoading(true);
      try {
        const res = await getSpecializations();
        const data = Array.isArray(res.data) ? res.data : [];
        setSpecializations(data);
        setFiltered(data);
      } catch {
        toast.error("Failed to load specializations");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setFiltered(
      val.trim()
        ? specializations.filter(
            (s) => s.name && s.name.toLowerCase().includes(val.toLowerCase())
          )
        : specializations
    );
  };

  return (
    <div>
      <ToastContainer />
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/admin/specializations-dashboard")}>
        Back to Specializations Dashboard
      </button>
      <h2>Search Specialization</h2>
      <input
        type="text"
        placeholder="Search by specialization name"
        value={searchText}
        onChange={handleSearch}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      {filtered.length === 0 ? (
        <div>No results found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((spec) => (
              <tr key={spec.id}>
                <td>{spec.name}</td>
                <td>{spec.is_active ? "Active" : "Disabled"}</td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/specializations/edit/${spec.id}`)}
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

export default SpecializationSearch;
