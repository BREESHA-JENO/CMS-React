import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSpecializations, disableSpecialization, enableSpecialization } from "../../Service/admin_api";

const SpecializationTable = () => {
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  const loadSpecializations = () => {
    getSpecializations()
      .then(res => setSpecializations(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadSpecializations();
  }, []);

  const handleToggleActive = (specialization) => {
    if (specialization.is_active) {
      if (!window.confirm("Are you sure to disable this specialization?")) return;
      disableSpecialization(specialization.id)
        .then(loadSpecializations)
        .catch(err => console.error(err));
    } else {
      if (!window.confirm("Are you sure to enable this specialization?")) return;
      enableSpecialization(specialization.id)
        .then(loadSpecializations)
        .catch(err => console.error(err));
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "1rem auto" }}>
      <button onClick={() => navigate("/admin/specializations/add")} style={{ marginBottom: "1rem" }}>
        Add Specialization
      </button>
      <h2>Specializations</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specializations.map(s => (
            <tr key={s.id} style={{ background: s.is_active ? "#fff" : "#fee" }}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>
                <button onClick={() => navigate(`/admin/specializations/edit/${s.id}`)} style={{ marginRight: 8 }}>
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(s)}
                  style={{
                    backgroundColor: s.is_active ? "orange" : "#38b000",
                    color: "white",
                    marginLeft: 4
                  }}
                >
                  {s.is_active ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
          {specializations.length === 0 && (
            <tr><td colSpan="3" style={{ textAlign: "center" }}>No specializations found.</td></tr>
          )}
        </tbody>
      </table>
      <button onClick={() => navigate("/admin")} style={{ marginTop: "1rem" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default SpecializationTable;
