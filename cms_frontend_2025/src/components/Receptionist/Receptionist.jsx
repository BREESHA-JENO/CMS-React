import React, { useState } from "react";
import { addPatient, updatePatient } from "../../Service/recep_api";

function Receptionist({ onCancel, patientData }) {
  const [formData, setFormData] = useState({
    patientname: patientData?.patient_name || "",
    patientphone: patientData?.patient_phone || "",
    patientemail: patientData?.patient_email || "",
    patientage: patientData?.patient_age || "",
    patientgender: patientData?.patient_gender || "",
    patientaddress: patientData?.patient_address || "",
    patientbloodgroup: patientData?.patient_blood_group || "",
    patientregdate: patientData?.patient_reg_date || "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validations
    if (!formData.patientname.trim()) return setError("Name is required");
    if (formData.patientname.trim().length < 3)
      return setError("Name must be at least 3 characters");
    if (!/^[0-9]{10}$/.test(formData.patientphone))
      return setError("Phone number must be exactly 10 digits");
    if (
      formData.patientemail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientemail)
    )
      return setError("Enter a valid email address");
    if (formData.patientage && (formData.patientage <= 0 || formData.patientage > 120))
      return setError("Enter a valid age (1–120)");
    if (!["Male", "Female", "Other"].includes(formData.patientgender))
      return setError("Gender must be Male, Female or Other");
    if (!formData.patientaddress.trim() || formData.patientaddress.length < 5)
      return setError("Address must be at least 5 characters");
    if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(formData.patientbloodgroup))
      return setError("Enter a valid blood group");
    if (!formData.patientregdate) return setError("Registration date is required");

    try {
      if (patientData) {
        // Edit Mode
        await updatePatient(patientData.patient_id, {
          patient_name: formData.patientname,
          patient_phone: formData.patientphone,
          patient_email: formData.patientemail,
          patient_age: formData.patientage,
          patient_gender: formData.patientgender,
          patient_address: formData.patientaddress,
          patient_blood_group: formData.patientbloodgroup,
          patient_reg_date: formData.patientregdate,
        });
        alert("Patient updated successfully!");
      } else {
        // Add Mode
        await addPatient({
          patient_name: formData.patientname,
          patient_phone: formData.patientphone,
          patient_email: formData.patientemail,
          patient_age: formData.patientage,
          patient_gender: formData.patientgender,
          patient_address: formData.patientaddress,
          patient_blood_group: formData.patientbloodgroup,
          patient_reg_date: formData.patientregdate,
        });
        setSuccess(true);
        alert("Patient added successfully!");
      }

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
      onCancel();
    } catch (err) {
      console.error(err);
      setError("Could not submit patient data. Check server or inputs.");
    }
  };

  return (
    <div className="receptionist-form">
      <h2>{patientData ? "Edit Patient" : "Add New Patient"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="patientname" placeholder="Name" value={formData.patientname} onChange={handleChange} />
        <input name="patientphone" placeholder="Phone" value={formData.patientphone} onChange={handleChange} />
        <input name="patientemail" placeholder="Email" value={formData.patientemail} onChange={handleChange} />
        <input name="patientage" placeholder="Age" type="number" value={formData.patientage} onChange={handleChange} />
        <select name="patientgender" value={formData.patientgender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="patientaddress" placeholder="Address" value={formData.patientaddress} onChange={handleChange} />
        <input name="patientbloodgroup" placeholder="Blood Group" value={formData.patientbloodgroup} onChange={handleChange} />
        <input name="patientregdate" type="date" value={formData.patientregdate} onChange={handleChange} />
        <button type="submit">{patientData ? "Update" : "Submit"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default Receptionist;
