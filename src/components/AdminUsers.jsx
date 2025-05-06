// src/components/AdminUsers.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import "../styles/adminusers.css";
import LoadingSpinner from "./common/LoadingSpinner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { success, error: toastError } = useToast();

  const token = localStorage.getItem("token");
  const roles = ["All", "student", "instructor"];

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCurrentUserId(response.data.data.id);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          throw new Error(response.data.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load users"
        );
        if (toastError) toastError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, toastError]);

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    // Don't show the current admin user in the list
    if (user._id === currentUserId) return false;

    const fullName = `${user.person?.firstName || ""} ${
      user.person?.lastName || ""
    }`.toLowerCase();
    const email = user.person?.email?.toLowerCase() || "";

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "All" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Handle adding new user
  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddForm(true);
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  // Handle deleting user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the deleted user from state
        setUsers(users.filter((user) => user._id !== userId));
        success("User deleted successfully");
      } else {
        throw new Error(response.data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toastError(
        err.response?.data?.error || err.message || "Failed to delete user"
      );
    }
  };

  // Handle form submission (add/edit user)
  const handleSaveUser = async (userData) => {
    try {
      let response;

      if (editingUser) {
        // Update existing user
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${editingUser._id}`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          // Update user in state
          setUsers(
            users.map((user) =>
              user._id === editingUser._id ? response.data.data : user
            )
          );
          success("User updated successfully");
        } else {
          throw new Error(response.data.error || "Failed to update user");
        }
      } else {
        // Add new user
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/users`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          // Add new user to state
          setUsers([...users, response.data.data]);
          success("User added successfully");
        } else {
          throw new Error(response.data.error || "Failed to add user");
        }
      }

      // Close form
      setShowAddForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
      toastError(
        err.response?.data?.error || err.message || "Failed to save user"
      );
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading users..." />;
  }

  if (showAddForm) {
    return (
      <UserForm
        onSubmit={handleSaveUser}
        initialData={editingUser}
        onCancel={() => {
          setShowAddForm(false);
          setEditingUser(null);
        }}
      />
    );
  }

  return (
    <div className="users-container">
      <h1 className="users-title">Manage Users</h1>

      {/* Filters and Search */}
      <div className="users-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="role-filter">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-select"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "All"
                  ? "All Roles"
                  : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.person?.firstName} {user.person?.lastName}
                  </td>
                  <td>{user.person?.email}</td>
                  <td className="role-cell">
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.person?.lastLogin
                      ? new Date(user.person.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-users">
          <p className="no-users-message">
            No users found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterRole("All");
            }}
            className="clear-filters-btn"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Add User Button */}
      <div className="add-section">
        <h2 className="add-title">Add New User</h2>
        <p className="add-description">
          Create a new student or instructor account
        </p>
        <button className="add-user-btn" onClick={handleAddUser}>
          + Add User
        </button>
      </div>
    </div>
  );
}

// User Form component for adding/editing users
function UserForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.person?.firstName || "",
    lastName: initialData?.person?.lastName || "",
    email: initialData?.person?.email || "",
    phoneNumber: initialData?.person?.phoneNumber || "",
    role: initialData?.role || "student",
    password: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill all required fields");
      setSubmitting(false);
      return;
    }

    // If adding new user, password is required
    if (!initialData && !formData.password) {
      setError("Password is required for new users");
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>{initialData ? "Edit User" : "Add New User"}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!initialData} // Email cannot be changed for existing users
            />
            {initialData && (
              <p className="field-hint">Email cannot be changed</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Role*</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              {/* Admin option removed */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">
              {initialData
                ? "New Password (leave blank to keep current)"
                : "Password*"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!initialData}
              placeholder={initialData ? "••••••" : ""}
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting
              ? initialData
                ? "Updating..."
                : "Adding..."
              : initialData
              ? "Update User"
              : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}
