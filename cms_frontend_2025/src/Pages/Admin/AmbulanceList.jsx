// src/Pages/Admin/AmbulanceCRUD.jsx
import React, { useEffect, useState } from "react";
import {
  getAmbulances,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
} from "../../Service/amb_api";

const defaultForm = { vehicle_no: "", driver_id: "", status: "Available" };

const AmbulanceCRUD = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [drivers, setDrivers] = useState([]); // You must fetch this via API or props

  // Fetch all ambulances
  useEffect(() => {
    async function fetchData() {
      const res = await getAmbulances();
      setAmbulances(res.data);
      // Also, fetch drivers-only staff for dropdown if not already in memory
      // Example:
      // const driverRes = await api.get("/api/admin/staff/?role=AMB")
      // setDrivers(driverRes.data)
    }
    fetchData();
  }, []);

  // Form handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateAmbulance(editingId, form);
    } else {
      await createAmbulance(form);
    }
    setForm(defaultForm);
    setEditingId(null);
    const res = await getAmbulances();
    setAmbulances(res.data);
  };

  const handleEdit = (record) => {
    setEditingId(record.ambulance_id);
    setForm({
      vehicle_no: record.vehicle_no,
      driver_id: record.driver_id,
      status: record.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteAmbulance(id);
      setAmbulances(ambulances.filter((a) => a.ambulance_id !== id));
    }
  };

  return (
    <div className="dashboard-content">
      <h1>Ambulance Management</h1>
      <form onSubmit={handleSubmit} className="dashboard-card" style={{ maxWidth: 700 }}>
        <h3>{editingId ? "Edit Ambulance" : "Add New Ambulance"}</h3>
        <label>Vehicle Number</label>
        <input
          type="text"
          value={form.vehicle_no}
          onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
          required
        />
        <label>Driver</label>
        <select
          value={form.driver_id}
          onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
          required
        >
          <option value="">Select</option>
          {drivers.map((d) => (
            <option value={d.id} key={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="On Duty">On Duty</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && <button onClick={() => { setForm(defaultForm); setEditingId(null); }}>Cancel</button>}
      </form>
      <table className="ambulance-request-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle No</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ambulances.map((a) => (
            <tr key={a.ambulance_id}>
              <td>{a.ambulance_id}</td>
              <td>{a.vehicle_no}</td>
              <td>{a.driver_name}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a.ambulance_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AmbulanceCRUD;
