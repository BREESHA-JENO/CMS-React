import React, { useState, useEffect } from "react";
import {
  createStaff,
  updateStaff,
  getStaffById,
  getSpecializations,
  getWorkingDays,
} from "../../Service/admin_api";
import { useNavigate, useParams } from "react-router-dom";

import {
  validateName,
  validateBloodGroup,
  validateEmail,
  validatePhoneNumber,
  validateGender,
  validateAgeByDOB,
  validateConsultationFee,
} from "../../Validations/StaffValidation"; // Adjust path as needed

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    dob: "",
    gender: "",
    blood_group: "",
    address: "",
    role: "REC",
    specialization_id: "",
    consultation_fee: "",
    schedules: [],
  });

  const [specializations, setSpecializations] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [createdStaff, setCreatedStaff] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Load specializations and working days
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const specRes = await getSpecializations();
        setSpecializations(Array.isArray(specRes.data) ? specRes.data : []);
        const wdRes = await getWorkingDays();
        setWorkingDays(Array.isArray(wdRes.data) ? wdRes.data : []);
      } catch (error) {
        alert("Failed to load specialization or working days data");
      }
    };
    fetchMeta();
  }, []);

  // Load staff data for edit
  useEffect(() => {
    if (id) {
      getStaffById(id).then((res) => {
        const staff = res.data;
        setFormData({
          ...staff,
          specialization_id: staff.doctor_details?.specialization?.id || "",
          consultation_fee: staff.doctor_details?.consultation_fee || "",
          schedules:
            staff.doctor_details?.schedules?.map((s) => ({
              day_id: s.day.id,
              start_time: s.start_time.slice(0, 5),
              end_time: s.end_time.slice(0, 5),
            })) || [],
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData((d) => ({
      ...d,
      role,
      ...(role !== "DOC"
        ? {
            specialization_id: "",
            consultation_fee: "",
            schedules: [],
          }
        : {}),
    }));
    setErrors((errs) => {
      // Clear doctor related errors if role changed away from DOC
      if (role !== "DOC") {
        const newErrs = { ...errs };
        delete newErrs.specialization_id;
        delete newErrs.consultation_fee;
        delete newErrs.schedules;
        return newErrs;
      }
      return errs;
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setFormData((d) => ({ ...d, schedules: newSchedules }));
  };

  const addSchedule = () => {
    setFormData((d) => ({
      ...d,
      schedules: [...d.schedules, { day_id: "", start_time: "", end_time: "" }],
    }));
  };

  const removeSchedule = (index) => {
    const newSchedules = [...formData.schedules];
    newSchedules.splice(index, 1);
    setFormData((d) => ({ ...d, schedules: newSchedules }));
  };

  // Validate entire form and set errors
  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhoneNumber(formData.phone_number);
    if (phoneError) newErrors.phone_number = phoneError;

    const genderError = validateGender(formData.gender);
    if (genderError) newErrors.gender = genderError;

    const bloodGroupError = validateBloodGroup(formData.blood_group);
    if (bloodGroupError) newErrors.blood_group = bloodGroupError;

    const dobError = validateAgeByDOB(formData.dob, formData.role);
    if (dobError) newErrors.dob = dobError;

    if (formData.role === "DOC") {
      const feeError = validateConsultationFee(formData.consultation_fee);
      if (feeError) newErrors.consultation_fee = feeError;

      if (!formData.specialization_id) {
        newErrors.specialization_id = "Specialization is required for Doctors.";
      }
      if (!formData.schedules.length) {
        newErrors.schedules = "At least one schedule is required for Doctors.";
      } else {
        // Optionally validate schedules have day_id/start_time/end_time
        formData.schedules.forEach((sch, idx) => {
          if (!sch.day_id || !sch.start_time || !sch.end_time) {
            newErrors.schedules = "All schedule fields are required.";
          }
          if (sch.start_time && sch.end_time && sch.start_time >= sch.end_time) {
            newErrors.schedules = "Schedule start time must be before end time.";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix validation errors before submitting the form.");
      return;
    }
    setIsSaving(true);
    setCreatedStaff(null);

    try {
      const formPayload = new FormData();

      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone_number", formData.phone_number);
      formPayload.append("dob", formData.dob);
      formPayload.append("gender", formData.gender);
      formPayload.append("blood_group", formData.blood_group);
      formPayload.append("address", formData.address);
      formPayload.append("role", formData.role);

      if (profileImage) {
        formPayload.append("profile_image", profileImage);
      }

      if (formData.role === "DOC") {
        formPayload.append(
          "doctor_details",
          JSON.stringify({
            specialization_id: formData.specialization_id,
            consultation_fee: formData.consultation_fee,
            schedules: formData.schedules,
          })
        );
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      const res = id
        ? await updateStaff(id, formPayload, config)
        : await createStaff(formPayload, config);

      if (!id) {
        setCreatedStaff({
          username: res.data.user_info?.username || res.data.email,
          password: res.data.generated_password,
        });
      } else {
        alert("Staff updated successfully");
        navigate("/admin/staff-list");
      }
    } catch (error) {
      console.error("Backend error:", error.response?.data);
      alert("Failed to save staff");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {createdStaff && (
        <div style={{ background: "#e6fff4", padding: "1em", marginBottom: 16 }}>
          <b>New Staff Credentials:</b>
          <div>
            Username: <code>{createdStaff.username}</code>
          </div>
          <div>
            Password: <code>{createdStaff.password}</code>
          </div>
          <small>Copy these and give to the new staff. They will need to change their password upon first login.</small>
          <br />
          <button style={{ marginTop: 12 }} onClick={() => navigate("/admin/staff-list")}>
            Go to Staff List
          </button>
        </div>
      )}
      <div>
        <button
          type="button"
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/admin/staff-management")}
        >
          Back to Staff Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }} noValidate>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
          {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
        </label>

        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </label>

        <label>
          Phone:
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          {errors.phone_number && <div style={{ color: "red" }}>{errors.phone_number}</div>}
        </label>

        <label>
          Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          {errors.dob && <div style={{ color: "red" }}>{errors.dob}</div>}
        </label>

        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <div style={{ color: "red" }}>{errors.gender}</div>}
        </label>

        <label>
          Blood Group:
          <select name="blood_group" value={formData.blood_group} onChange={handleChange} required>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.blood_group && <div style={{ color: "red" }}>{errors.blood_group}</div>}
        </label>

        <label>
          Address:
          <textarea name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleRoleChange} required>
            <option value="ADMIN">Admin</option>
            <option value="REC">Receptionist</option>
            <option value="DOC">Doctor</option>
            <option value="LAB">Lab Technician</option>
            <option value="PHARM">Pharmacist</option>
            <option value="AMB">Ambulance Driver</option>
          </select>
        </label>

        <label>
          Profile Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {/* Doctor fields */}
        {formData.role === "DOC" && (
          <>
            <label>
              Specialization:
              <select
                name="specialization_id"
                value={formData.specialization_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              {errors.specialization_id && <div style={{ color: "red" }}>{errors.specialization_id}</div>}
            </label>

            <label>
              Consultation Fee:
              <input
                type="number"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleChange}
                min={100}
                required
              />
              {errors.consultation_fee && <div style={{ color: "red" }}>{errors.consultation_fee}</div>}
            </label>

            <fieldset style={{ marginBottom: "1rem" }}>
              <legend>Working Days & Hours</legend>
              {errors.schedules && <div style={{ color: "red" }}>{errors.schedules}</div>}
              {formData.schedules.map((schedule, idx) => (
                <div key={idx} style={{ marginBottom: "0.5rem" }}>
                  <select
                    required
                    value={schedule.day_id}
                    onChange={(e) => handleScheduleChange(idx, "day_id", e.target.value)}
                  >
                    <option value="">Select Day</option>
                    {workingDays.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    required
                    value={schedule.start_time}
                    onChange={(e) => handleScheduleChange(idx, "start_time", e.target.value)}
                    style={{ marginLeft: "1rem" }}
                  />
                  <input
                    type="time"
                    required
                    value={schedule.end_time}
                    onChange={(e) => handleScheduleChange(idx, "end_time", e.target.value)}
                    style={{ marginLeft: "1rem" }}
                  />
                  <button type="button" onClick={() => removeSchedule(idx)} style={{ marginLeft: "1rem" }}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSchedule}>
                Add Schedule
              </button>
            </fieldset>
          </>
        )}

        <button type="submit" disabled={isSaving} style={{ marginTop: "1rem" }}>
          {isSaving ? (id ? "Updating..." : "Saving...") : id ? "Update Staff" : "Add Staff"}
        </button>
      </form>
    </div>
  );
};

export default StaffForm;
