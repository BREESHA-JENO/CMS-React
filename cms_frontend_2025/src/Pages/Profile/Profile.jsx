import React from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-page">
      <h2>Profile Information</h2>
      <div className="profile-image-container">
        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt={`${user.username}'s profile`}
            className="profile-image"
          />
        ) : (
          <div className="profile-image-placeholder">
            {/* You can also use an icon or initials here */}
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="profile-details">
        <p><strong>Name:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
}

export default Profile;
