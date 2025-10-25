export const validateName = (name) => {
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Name should contain only alphabets and spaces.";
  }
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters long.";
  }
  return null;
};

export const validateBloodGroup = (bg) => {
  const validGroups = new Set(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);
  if (!validGroups.has(bg.toUpperCase())) {
    return "Invalid blood group.";
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

export const validatePhoneNumber = (phone) => {
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return "Phone number must be 10 digits and start with 6,7,8, or 9.";
  }
  return null;
};

export const validateGender = (gender) => {
  const genders = new Set(["Male", "Female", "Other"]);
  if (!genders.has(gender)) {
    return "Gender must be 'Male', 'Female', or 'Other'.";
  }
  return null;
};

export const validateAgeByDOB = (dob, role) => {
  if (!dob) return null;
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  if (role === "DOC" && (age < 25 || age > 80)) {
    return "Doctor's age must be between 25 and 80.";
  }
  if (role !== "DOC" && (age < 18 || age > 80)) {
    return "Staff age must be between 18 and 80.";
  }
  return null;
};

export const validateConsultationFee = (fee) => {
  if (fee === "" || Number(fee) < 100) {
    return "Consultation fee must be at least 100.";
  }
  return null;
};
