import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/userprofile.css";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/persons/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfileData(res.data.data);
        setFormData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...formData });
    setIsEditing(false);
    // Here you would typically make an API call to update the user profile
    axios.put("http://localhost:5005/api/users/profile", profileData);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>

      <div className="profile-card">
        <div className="profile-layout">
          {/* Profile Picture Section */}
          {/* <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img 
                src={profileData.profilePicture || ''} 
                alt="Profile" 
                className="profile-picture"
              />
              {isEditing && (
                <button 
                  className="change-picture-btn"
                  title="Change Profile Picture"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-profile-btn"
              >
                Edit Profile
              </button>
            )}
          </div> */}

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
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
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
                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-grid">
                  <div className="info-group">
                    <h3 className="info-label">First Name</h3>
                    <p className="info-value">{profileData.firstName}</p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Last Name</h3>
                    <p className="info-value">{profileData.lastName}</p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Email</h3>
                    <p className="info-value">{profileData.email}</p>
                  </div>
                  <div className="info-group">
                    <h3 className="info-label">Phone Number</h3>
                    <p className="info-value">{profileData.phone}</p>
                  </div>
                </div>
                <div className="bio-section">
                  <h3 className="info-label">Bio</h3>
                  <p className="info-value">{profileData.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
