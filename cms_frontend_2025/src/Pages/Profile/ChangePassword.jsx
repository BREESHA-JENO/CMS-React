import React, { useState } from "react";
import { changePassword } from "../../Service/admin_api";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password does not match.");
      return;
    }
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setSuccess("Password updated successfully. Please log in again.");
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.current_password?.[0] ||
        "Failed to change password"
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {error && <div style={{ color: "red", margin: "0.5rem 0" }}>{error}</div>}
        {success && <div style={{ color: "green", margin: "0.5rem 0" }}>{success}</div>}
        <button type="submit" style={{ marginTop: "1rem" }}>
          Change Password
        </button>
        <button
            type="button"
            style={{ marginLeft: "1rem" }}
            onClick={() => navigate("/admin")} // or your dashboard path
        >
            Cancel
          </button>
      </form>
    </div>
  );
};

export default ChangePassword;
