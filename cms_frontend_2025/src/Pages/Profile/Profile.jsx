import React from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="profile-page">
      <h2>Profile Information</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
}

export default Profile;
