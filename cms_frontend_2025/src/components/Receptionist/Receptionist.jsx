import React, { useState } from "react";
import { addPatient } from "../../Service/recep_api";

function Receptionist({ onCancel }) {
  const [formData, setFormData] = useState({
    patientname: "",
    patientphone: "",
    patientemail: "",
    patientage: "",
    patientgender: "",
    patientaddress: "",
    patientbloodgroup: "",
    patientregdate: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  // Basic validations
  if (!formData.patientname.trim()) return setError("Name is required");
  if (!/^[0-9]{10}$/.test(formData.patientphone))
    return setError("Phone number must be 10 digits");
  if (formData.patientemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientemail))
    return setError("Enter a valid email address");
  if (formData.patientage && (formData.patientage < 0 || formData.patientage > 120))
    return setError("Enter a valid age (0–120)");
  if (!formData.patientgender)
    return setError("Gender is required");
  if (!formData.patientaddress.trim())
    return setError("Address is required");
  if (!formData.patientbloodgroup.trim())
    return setError("Blood group is required");
  if (!formData.patientregdate)
    return setError("Registration date is required");

  try {
    await addPatient(formData); // API call to backend
    setSuccess(true);
    setFormData({
      patientname: "",
      patientphone: "",
      patientemail: "",
      patientage: "",
      patientgender: "",
      patientaddress: "",
      patientbloodgroup: "",
      patientregdate: "",
    });
  } catch (err) {
    console.error(err);
    setError("Could not add patient. Check inputs or server.");
  }
};


  return (
    <div className="add-patient-form">
      <h2>Add New Patient</h2>
      {success && <div className="success-message">Patient added successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="patientname" type="text" placeholder="Name" value={formData.patientname} onChange={handleChange} required />
        <input name="patientphone" type="text" placeholder="Phone" value={formData.patientphone} onChange={handleChange} required />
        <input name="patientemail" type="email" placeholder="Email" value={formData.patientemail} onChange={handleChange} />
        <input name="patientage" type="number" placeholder="Age" value={formData.patientage} onChange={handleChange} />
        <input name="patientgender" type="text" placeholder="Gender" value={formData.patientgender} onChange={handleChange} />
        <input name="patientaddress" type="text" placeholder="Address" value={formData.patientaddress} onChange={handleChange} />
        <input name="patientbloodgroup" type="text" placeholder="Blood Group" value={formData.patientbloodgroup} onChange={handleChange} />
        <input name="patientregdate" type="date" placeholder="Registration Date" value={formData.patientregdate} onChange={handleChange} />
        <button type="submit">Add Patient</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default Receptionist;
