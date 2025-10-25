import React, { useState, useEffect } from "react";
import {
  getAmbulances,
  createAmbulance,
  updateAmbulance,
} from "../../Service/amb_api";
import { getStaffByRole } from "../../Service/admin_api";
import "../../Pages/Receptionist/Receptionist_Dashboard.css";

const defaultForm = { vehicle_no: "", driver_id: "", status: "Available" };

const AdminAmbulanceDashboard = () => {
  const [activeCard, setActiveCard] = useState("list");
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ambulanceRes, driversRes] = await Promise.all([
          getAmbulances(),
          getStaffByRole("AMB"),
        ]);
        setAmbulances(ambulanceRes.data);
        setDrivers(driversRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtered search list
  const filteredAmbulances = ambulances.filter(
    (a) =>
      a.vehicle_no.toLowerCase().includes(searchText.toLowerCase()) ||
      (a.driver_name && a.driver_name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAmbulance(editingId, form);
        alert("Ambulance updated successfully");
      } else {
        await createAmbulance(form);
        alert("Ambulance created successfully");
      }
      // Refresh
      const res = await getAmbulances();
      setAmbulances(res.data);
      handleCancel();
      setActiveCard("list");
    } catch (error) {
      alert("Error saving ambulance");
      console.error(error);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  // Edit ambulance
  const handleEdit = (ambulance) => {
    setForm({
      vehicle_no: ambulance.vehicle_no,
      driver_id: ambulance.driver_id,
      status: ambulance.status,
    });
    setEditingId(ambulance.ambulance_id);
    setActiveCard("add");
  };

  // Disable ambulance
  const handleDisable = async (id) => {
    if (window.confirm("Are you sure you want to disable this ambulance?")) {
      try {
        await updateAmbulance(id, { status: "Maintenance" });
        const res = await getAmbulances();
        setAmbulances(res.data);
      } catch (error) {
        alert("Failed to disable ambulance");
      }
    }
  };

  // Cards layout
  const cards = [
    {
      title: "Add Ambulance",
      description: "Register a new ambulance",
      icon: "🚑", // swap with icon if you use react-icons/fa
      card: "add"
    },
    {
      title: "List Ambulance",
      description: "View all ambulances",
      icon: "📋",
      card: "list"
    },
    {
      title: "Search and View",
      description: "Search by vehicle or driver",
      icon: "🔍",
      card: "search"
    }
  ];

  return (
    <div className="dashboard-content">
      <h1>Ambulance Management</h1>

      <div className="cards-grid" style={{ marginBottom: "2rem" }}>
        {cards.map(({ title, description, icon, card }) => (
          <div
            key={card}
            className={`dashboard-card nav-card${activeCard === card ? " active-card" : ""}`}
            onClick={() => setActiveCard(card)}
            style={{
              borderTop: activeCard === card ? "4px solid #003087" : undefined,
              cursor: "pointer"
            }}>
            <div className="card-icon" style={{ fontSize: "2.5rem" }}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="card-arrow" style={{ color: "#003087" }}>→</div>
          </div>
        ))}
      </div>

      {/* Add/Edit Ambulance */}
      {activeCard === "add" && (
        <form onSubmit={handleSubmit} className="dashboard-card" style={{ maxWidth: 700, margin: "0 auto" }}>
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
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
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

          <div style={{ marginTop: "1rem" }}>
            <button className="btn" type="submit">{editingId ? "Update" : "Create"}</button>
            <button
              className="btn"
              type="button"
              style={{ marginLeft: "1rem" }}
              onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List Ambulances */}
      {activeCard === "list" && (
        loading ? (
          <p>Loading Ambulances...</p>
        ) : (
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
              {ambulances.map((ambulance) => (
                <tr key={ambulance.ambulance_id}>
                  <td>{ambulance.ambulance_id}</td>
                  <td>{ambulance.vehicle_no}</td>
                  <td>{ambulance.driver_name}</td>
                  <td>{ambulance.status}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(ambulance)}>Edit</button>
                    {ambulance.status !== "Maintenance" && (
                      <button
                        className="btn"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => handleDisable(ambulance.ambulance_id)}
                      >Disable</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {/* Search Ambulances */}
      {activeCard === "search" && (
        <>
          <input
            type="text"
            placeholder="Search by vehicle number or driver"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginTop: "1rem", padding: "0.5rem", width: "100%", maxWidth: 400 }}
          />
          <table className="ambulance-request-table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle No</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbulances.map((ambulance) => (
                <tr key={ambulance.ambulance_id}>
                  <td>{ambulance.ambulance_id}</td>
                  <td>{ambulance.vehicle_no}</td>
                  <td>{ambulance.driver_name}</td>
                  <td>{ambulance.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminAmbulanceDashboard;
