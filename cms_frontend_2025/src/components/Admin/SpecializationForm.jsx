import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSpecializationById, addSpecialization, updateSpecialization } from "../../Service/admin_api";

const SpecializationForm = () => {
  const { id } = useParams(); // id present means edit mode
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load specialization if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      getSpecializationById(id)
        .then(res => {
          setName(res.data.name);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await updateSpecialization(id, { name });
      } else {
        await addSpecialization({ name });
      }
      navigate("/admin/specializations"); // After save, return to list
    } catch (e) {
      alert("Failed to save specialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>{id ? "Edit Specialization" : "Add Specialization"}</h2>
      {loading && <div>Loading...</div>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Specialization Name"
              required
              autoFocus
            />
          </label>
          <br />
          <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
            {id ? "Update" : "Add"}
          </button>
          <button type="button" onClick={() => navigate("/admin/specializations-dashboard")} style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default SpecializationForm;
