import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/userprofile.css";
import { useToast } from "../contexts/ToastContext";
import LoadingSpinner from "./common/LoadingSpinner";
import { authAxios } from "../services/authService";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await authAxios().get("/persons/me");

        if (response.data.success) {
          setProfileData(response.data.data);
          setFormData({
            firstName: response.data.data.firstName || "",
            lastName: response.data.data.lastName || "",
            email: response.data.data.email || "",
            phoneNumber: response.data.data.phoneNumber || "",
            bio: response.data.data.bio || "",
          });
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
        toastError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [toastError]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Update basic profile info
      const response = await authAxios().put(
        `/persons/${profileData._id}`,
        formData
      );

      if (response.data.success) {
        // Update local state with new data
        setProfileData({
          ...profileData,
          ...formData,
        });

        setIsEditing(false);
        success("Profile updated successfully!");
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to update profile"
      );
      toastError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      email: profileData.email || "",
      phoneNumber: profileData.phoneNumber || "",
      bio: profileData.bio || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading profile data..." />;
  }

  if (error && !profileData) {
    return (
      <div className="profile-error">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="reload-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>

      <div className="profile-card">
        <div className="profile-layout">
          {/* Profile Details Section */}
          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled // Email is typically not changeable
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                      pattern="[0-9+\-\(\)\s]+"
                      title="Please enter a valid phone number"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="form-textarea"
                  ></textarea>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="profile-header">
                  <div className="profile-actions">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="edit-profile-btn"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-group">
                    <h3 className="info-label">First Name</h3>
                    <p className="info-value">
                      {profileData.firstName || "Not set"}
                    </p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Last Name</h3>
                    <p className="info-value">
                      {profileData.lastName || "Not set"}
                    </p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Email</h3>
                    <p className="info-value">
                      {profileData.email || "Not set"}
                    </p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Phone Number</h3>
                    <p className="info-value">
                      {profileData.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="bio-section">
                  <h3 className="info-label">Bio</h3>
                  <p className="info-value bio-text">
                    {profileData.bio || "No bio information provided yet."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
